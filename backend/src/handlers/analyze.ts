// backend/src/handlers/analyze.ts
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { maybeInvokeBedrock } from "../lib/bedrock.js";
import type { Message } from "../lib/types.js";

interface AnalyzeRequestBody {
  input: {
    text: string;
  };
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
    total_tokens?: number;
    processing_time_ms?: number;
  };
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
  const startTime = Date.now();

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
          message: "Invalid payload. Required: { input: { text: string }, handshake: {...} }"
        }),
      };
    }

    const { input, handshake } = body;
    const text = input.text.trim();

    if (!text) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Input text cannot be empty" }),
      };
    }

    // Build analysis prompt following codex v0.9 policies
    const prompt = buildAnalysisPrompt(text, handshake);

    // Call Bedrock for deep reasoning
    let bedrockResponse: string | null = null;
    try {
      bedrockResponse = await maybeInvokeBedrock(prompt);
    } catch (e: any) {
      console.error("Bedrock invocation failed:", e);
      // Soft fail - return empty frames with notice
      return {
        statusCode: 200,
        headers: cors(),
        body: JSON.stringify({
          ok: true,
          frames: [],
          summary: "AWS Bedrock analysis unavailable. Please check BEDROCK_MODEL_ID configuration.",
          handshake,
          telemetry: {
            mode: handshake.mode,
            stakes: handshake.stakes,
            processing_time_ms: Date.now() - startTime,
          },
        } as AnalyzeResponse),
      };
    }

    // Parse Bedrock response into VX frames
    const frames = parseBedrockToFrames(bedrockResponse, text, handshake);
    const summary = extractSummary(bedrockResponse);

    const response: AnalyzeResponse = {
      ok: true,
      frames,
      summary,
      handshake,
      telemetry: {
        mode: handshake.mode,
        stakes: handshake.stakes,
        processing_time_ms: Date.now() - startTime,
      },
    };

    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify(response)
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

function buildAnalysisPrompt(text: string, handshake: AnalyzeRequestBody["handshake"]): string {
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
- vx-ai01: Speculative Authority ("experts say" without names)
- vx-pc01: Perceived Consensus ("everyone agrees")
- vx-fp01: False Precision (overconfident statistics)
- vx-ha01: Hallucination (unverifiable claims)
- vx-os01: Omission (missing context/caveats)
- vx-em08: Emotional Manipulation (fear/urgency)
- vx-da01: Data-less Claims (assertions without evidence)
- vx-fo01: False Options (false dichotomies)
- vx-vg01: Vague Generalization (weasel words)

TEXT TO ANALYZE:
"""
${text}
"""

RESPONSE FORMAT (JSON):
{
  "frames": [
    {
      "reflex_id": "vx-ai01",
      "reflex_name": "Speculative Authority",
      "score": 0.75,
      "severity": "medium",
      "rationale": "Uses 'experts' without attribution",
      "snippet": "exact quote from text",
      "suggestion": "Ask: Which experts? What are their credentials?"
    }
  ],
  "summary": "Brief 1-2 sentence analysis overview"
}

Return ONLY valid JSON. If no patterns detected, return empty frames array.`;
}

function parseBedrockToFrames(
  response: string | null,
  originalText: string,
  handshake: AnalyzeRequestBody["handshake"]
): VXFrame[] {
  if (!response) return [];

  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*"frames"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("No JSON structure found in Bedrock response");
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const frames = Array.isArray(parsed.frames) ? parsed.frames : [];

    // Filter by min_confidence threshold
    return frames
      .filter((f: any) => typeof f.score === "number" && f.score >= handshake.min_confidence)
      .map((f: any) => ({
        reflex_id: f.reflex_id || "vx-unknown",
        reflex_name: f.reflex_name || "Unknown Pattern",
        score: f.score || 0.5,
        severity: f.severity || "medium",
        rationale: f.rationale || "",
        context: f.context || originalText.slice(0, 200),
        snippet: f.snippet || "",
        suggestion: f.suggestion || "",
        start_pos: f.start_pos,
        end_pos: f.end_pos,
      }));

  } catch (e: any) {
    console.error("Failed to parse Bedrock response as JSON:", e);
    return [];
  }
}

function extractSummary(response: string | null): string | undefined {
  if (!response) return undefined;

  try {
    const jsonMatch = response.match(/\{[\s\S]*"summary"[\s\S]*\}/);
    if (!jsonMatch) return undefined;

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.summary || undefined;
  } catch {
    return undefined;
  }
}
