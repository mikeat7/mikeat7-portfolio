// backend/src/handlers/analyze.ts
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { maybeInvokeBedrock } from "../lib/bedrock.js";

interface AnalyzeRequestBody {
  input: { text: string };
  handshake: {
    mode: "--direct" | "--careful" | "--recap";
    stakes: "low" | "medium" | "high";
    min_confidence: number;
    cite_policy: "auto" | "force" | "off";
    omission_scan: "auto" | boolean;
    reflex_profile: "default" | "strict" | "lenient";
    codex_version: string;
  };
}

interface VXFrame {
  reflex_id: string;
  reflex_name: string;
  score: number;
  severity: "low" | "medium" | "high";
  rationale: string;
  context: string;
  snippet: string;
  start_pos?: number;
  end_pos?: number;
  suggestion?: string;
}

interface AnalyzeResponse {
  ok: boolean;
  frames: VXFrame[];
  summary?: string;
  handshake: AnalyzeRequestBody["handshake"];
  telemetry?: {
    mode: string;
    stakes: string;
    processing_time_ms?: number;
  };
  notice?: string;
}

function validateHandshake(h: any): h is AnalyzeRequestBody["handshake"] {
  if (!h) return false;
  if (!["--direct", "--careful", "--recap"].includes(h.mode)) return false;
  if (!["low", "medium", "high"].includes(h.stakes)) return false;
  if (typeof h.min_confidence !== "number") return false;
  if (!["auto", "force", "off"].includes(h.cite_policy)) return false;
  if (!(h.omission_scan === "auto" || typeof h.omission_scan === "boolean")) return false;
  if (!["default", "strict", "lenient"].includes(h.reflex_profile)) return false;
  if (typeof h.codex_version !== "string") return false;
  return true;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const t0 = Date.now();

  try {
    if (event.requestContext.http.method === "OPTIONS") {
      return { statusCode: 200, headers: cors(), body: "" };
    }

    const body = event.body ? (JSON.parse(event.body) as AnalyzeRequestBody) : null;
    if (!body?.input?.text || !validateHandshake(body.handshake)) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({
          ok: false,
          message:
            "Invalid payload. Required: { input: { text: string }, handshake: {...} }",
        }),
      };
    }

    const { input, handshake } = body;
    const text = (input.text ?? "").trim();
    if (!text) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Input text cannot be empty" }),
      };
    }

    // Build prompt (codex v0.9)
    const prompt = buildAnalysisPrompt(text, handshake);

    // Call Bedrock (returns plain TEXT from model per bedrock.ts)
    let frames: VXFrame[] = [];
    let summary: string | undefined;
    let notice: string | undefined;

    try {
      console.info("[analyze] invoking Bedrock…");
      const bedrockText = await maybeInvokeBedrock(prompt);
      console.info(
        "[analyze] Bedrock returned:",
        bedrockText ? bedrockText.slice(0, 200) : "(null)"
      );

      if (bedrockText) {
        frames = parseBedrockToFrames(bedrockText, text, handshake);
        summary = extractSummary(bedrockText);
      }
    } catch (e: any) {
      console.error("[analyze] Bedrock invocation failed:", e?.message || e);
      notice = "AWS Bedrock analysis unavailable. Using heuristic fallback.";
    }

    // Fallback if model gave nothing usable
    if (!Array.isArray(frames) || frames.length === 0) {
      frames = minimalHeuristicFrames(text, handshake);
      if (!notice) {
        notice = "No frames returned by model. Emitting heuristic signal.";
      }
    }

    const resp: AnalyzeResponse = {
      ok: true,
      frames,
      summary,
      handshake,
      telemetry: {
        mode: handshake.mode,
        stakes: handshake.stakes,
        processing_time_ms: Date.now() - t0,
      },
      ...(notice ? { notice } : {}),
    };

    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify(resp),
    };
  } catch (err: any) {
    console.error("analyze handler error:", err);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ ok: false, message: "Internal error during analysis" }),
    };
  }
};

function buildAnalysisPrompt(
  text: string,
  handshake: AnalyzeRequestBody["handshake"]
): string {
  return `SYSTEM: You are a manipulation detection agent governed by FRONT-END CODEX v0.9.

HANDSHAKE PARAMETERS:
- mode: ${handshake.mode}
- stakes: ${handshake.stakes}
- min_confidence: ${handshake.min_confidence}
- cite_policy: ${handshake.cite_policy}
- omission_scan: ${String(handshake.omission_scan)}
- reflex_profile: ${handshake.reflex_profile}

TASK: Analyze the following text for manipulation patterns, logical fallacies, and omissions.

CRITICAL RULES:
1. Only flag patterns where confidence >= ${handshake.min_confidence}
2. If cite_policy = "force", flag any unsourced factual claims
3. If omission_scan = true or (auto and stakes = high), actively search for missing context
4. Follow ${handshake.reflex_profile} sensitivity (strict = more aggressive, lenient = fewer flags)
5. Be explicit about uncertainty - never fake confidence
6. For each detection, provide: reflex_id, score (0-1), severity, rationale, snippet

REFLEX PATTERNS TO DETECT:
- vx-ai01: Speculative Authority
- vx-pc01: Perceived Consensus
- vx-fp01: False Precision
- vx-ha01: Hallucination
- vx-os01: Omission
- vx-em08: Emotional Manipulation
- vx-da01: Data-less Claims
- vx-fo01: False Options
- vx-vg01: Vague Generalization

TEXT TO ANALYZE:
"""
${text}
"""

RESPONSE FORMAT (JSON, ONLY THIS, NO MARKDOWN FENCES, NO PROSE BEFORE/AFTER):
{"frames":[{"reflex_id":"vx-ai01","reflex_name":"Speculative Authority","score":0.75,"severity":"medium","rationale":"Uses 'experts' without attribution","snippet":"exact quote from text","suggestion":"Ask: Which experts? What are their credentials?"}],"summary":"Brief 1-2 sentence analysis overview"}

RULES:
- Return one single JSON object exactly like above (minified is fine).
- Do NOT include \`\`\`json fences or any commentary.
- If no patterns are detected, return {"frames":[],"summary":"..."}.
`;
}

function parseBedrockToFrames(
  response: string | null,
  originalText: string,
  handshake: AnalyzeRequestBody["handshake"]
): VXFrame[] {
  if (!response) return [];
  try {
    // Trim & strip common code fences first
    let cleaned = response.trim();
    cleaned = cleaned.replace(/^```json\s*|\s*```$/g, "");
    cleaned = cleaned.replace(/^```\s*|\s*```$/g, "");

    // Pull out the JSON block if the model wrapped it in prose
    const jsonMatch = cleaned.match(/\{[\s\S]*"frames"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("[analyze] no JSON structure found in Bedrock response");
      return [];
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const arr = Array.isArray(parsed.frames) ? parsed.frames : [];
    return arr
      .filter((f: any) => typeof f?.score === "number" && f.score >= handshake.min_confidence)
      .map((f: any): VXFrame => ({
        reflex_id: f.reflex_id || "vx-unknown",
        reflex_name: f.reflex_name || "Unknown Pattern",
        score: f.score ?? 0.5,
        severity: (f.severity as VXFrame["severity"]) || "medium",
        rationale: f.rationale || "",
        context: f.context || originalText.slice(0, 200),
        snippet: f.snippet || "",
        suggestion: f.suggestion || "",
        start_pos: typeof f.start_pos === "number" ? f.start_pos : undefined,
        end_pos: typeof f.end_pos === "number" ? f.end_pos : undefined,
      }));
  } catch (e) {
    console.error("[analyze] failed to parse Bedrock JSON:", e);
    return [];
  }
}

function extractSummary(response: string | null): string | undefined {
  if (!response) return undefined;
  try {
    let cleaned = response.trim();
    cleaned = cleaned.replace(/^```json\s*|\s*```$/g, "");
    cleaned = cleaned.replace(/^```\s*|\s*```$/g, "");

    const jsonMatch = cleaned.match(/\{[\s\S]*"summary"[\s\S]*\}/);
    if (!jsonMatch) return undefined;
    const parsed = JSON.parse(jsonMatch[0]);
    return typeof parsed.summary === "string" ? parsed.summary : undefined;
  } catch {
    return undefined;
  }
}

function minimalHeuristicFrames(
  text: string,
  handshake: AnalyzeRequestBody["handshake"]
): VXFrame[] {
  const urgency = /\b(now|must act|urgent|immediately|never)\b/i.exec(text || "");
  const score = urgency ? 0.72 : 0.38;
  if (score < (handshake.min_confidence ?? 0)) return [];
  return [
    {
      reflex_id: "vx-em08",
      reflex_name: "Emotional Manipulation",
      score,
      severity: score >= 0.75 ? "high" : score >= 0.55 ? "medium" : "low",
      rationale: urgency
        ? `Detected urgency cue "${urgency[0]}".`
        : "Low-signal emotional/urgency heuristic.",
      context: text.slice(0, 200),
      snippet: urgency
        ? urgency.input.slice(
            Math.max(0, urgency.index - 30),
            urgency.index + urgency[0].length + 30
          )
        : text.slice(0, 120),
      suggestion: 'Ask: "What is the concrete evidence and timeline?"',
    },
  ];
}
