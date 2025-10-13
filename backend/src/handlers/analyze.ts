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
      if (!notice) notice = "No frames returned by model. Emitting heuristic signal.";
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
  return `You are a manipulation-detection analyst.

STRICT OUTPUT CONTRACT:
- Return ONE (1) JSON object ONLY.
- DO NOT include Markdown, backticks, or any prose outside the JSON.
- The object MUST have keys: "frames" (array) and "summary" (string).
- Each frame object MUST contain:
  - reflex_id (string)
  - reflex_name (string)
  - score (number 0..1)
  - severity ("low"|"medium"|"high")
  - rationale (string)
  - snippet (string)
  - OPTIONAL: suggestion (string), start_pos (number), end_pos (number)

HANDSHAKE PARAMETERS:
- mode: ${handshake.mode}
- stakes: ${handshake.stakes}
- min_confidence: ${handshake.min_confidence}
- cite_policy: ${handshake.cite_policy}
- omission_scan: ${String(handshake.omission_scan)}
- reflex_profile: ${handshake.reflex_profile}

TASK:
Analyze the text for manipulation patterns, logical fallacies, and omissions.

CRITICAL RULES:
1) Only include frames with score >= ${handshake.min_confidence}
2) If cite_policy = "force", flag unsourced factual claims
3) If omission_scan = true or (auto and stakes = high), look for missing context
4) ${handshake.reflex_profile} sensitivity
5) Be explicit about uncertainty
6) Prefer concise snippets from the input text

REFLEX PATTERNS (ids → names):
- vx-ai01 → Speculative Authority
- vx-pc01 → Perceived Consensus
- vx-fp01 → False Precision
- vx-ha01 → Hallucination
- vx-os01 → Omission
- vx-em08 → Emotional Manipulation
- vx-da01 → Data-less Claims
- vx-fo01 → False Options
- vx-vg01 → Vague Generalization

TEXT:
"""${text}"""

RESPONSE (JSON ONLY):
{
  "frames": [
    {
      "reflex_id": "vx-ai01",
      "reflex_name": "Speculative Authority",
      "score": 0.75,
      "severity": "medium",
      "rationale": "Uses 'experts' without attribution",
      "snippet": "Experts say…",
      "suggestion": "Ask which experts and credentials"
    }
  ],
  "summary": "1–2 sentences summarizing the detections."
}`;
}

function parseBedrockToFrames(
  response: string | null,
  originalText: string,
  handshake: AnalyzeRequestBody["handshake"]
): VXFrame[] {
  if (!response) return [];
  try {
    // Accept raw JSON, or fenced ```json ... ``` or leading/trailing prose
    let candidate = response.trim();

    // strip common fences
    candidate = candidate.replace(/^```json\s*|\s*```$/gi, "");
    candidate = candidate.replace(/^```\s*|\s*```$/gi, "");

    // If the whole thing isn't JSON, try to grab the first object with "frames"
    if (!/\"frames\"\s*:/.test(candidate)) {
      const m = candidate.match(/\{[\s\S]*\}/);
      if (m) candidate = m[0];
    }

    const parsed = JSON.parse(candidate);
    const arr = Array.isArray(parsed.frames) ? parsed.frames : [];
    return arr
      .filter((f: any) => typeof f?.score === "number" && f.score >= handshake.min_confidence)
      .map((f: any): VXFrame => ({
        reflex_id: String(f.reflex_id || "vx-unknown"),
        reflex_name: String(f.reflex_name || "Unknown Pattern"),
        score: Number(f.score ?? 0.5),
        severity: (["low", "medium", "high"].includes(f.severity)
          ? f.severity
          : "medium") as VXFrame["severity"],
        rationale: String(f.rationale || ""),
        context: String(f.context || originalText.slice(0, 200)),
        snippet: String(f.snippet || ""),
        suggestion: f.suggestion ? String(f.suggestion) : undefined,
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
    let candidate = response.trim();
    candidate = candidate.replace(/^```json\s*|\s*```$/gi, "");
    candidate = candidate.replace(/^```\s*|\s*```$/gi, "");

    const hasSummary = /\"summary\"\s*:/.test(candidate);
    if (!hasSummary) {
      const m = candidate.match(/\{[\s\S]*\}/);
      if (!m) return undefined;
      candidate = m[0];
    }

    const parsed = JSON.parse(candidate);
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
