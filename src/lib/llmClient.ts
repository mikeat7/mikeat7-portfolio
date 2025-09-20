import codex from "@/data/front-end-codex.v0.9.json";
import { buildHandshake, emitTelemetry, type Mode, type Stakes } from "@/lib/codex-runtime";

export interface LLMRequest {
  prompt: string;
  stakes?: Stakes;
  mode?: Mode;
  // Optional: any other headers/params your backend expects
  system?: string;
  max_tokens?: number;
}

export interface LLMResponse {
  ok: boolean;
  text?: string;
  citations?: Array<{ title?: string; url?: string }>;
  error?: string;
}

/**
 * Build a handshake and POST to your (future) API route.
 * If you don’t have a backend yet, this will still return a mock response
 * so the UI can function in “front-end only” mode.
 */
export async function callLLM(payload: LLMRequest): Promise<LLMResponse> {
  const handshake = buildHandshake(codex as any, {
    stakes: payload.stakes ?? "medium",
    mode: payload.mode ?? "--careful",
  });

  // Telemetry (pre-call)
  emitTelemetry("llm.call.start", {
    mode: handshake.mode,
    stakes: handshake.stakes,
  });

  try {
    const res = await fetch("/api/llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, handshake }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      emitTelemetry("llm.call.error", { status: res.status, error: errorText });
      // Front-end-only mock fallback
      return {
        ok: true,
        text:
          "⚠️ (Mocked) No backend yet. This is a placeholder completion so the UI keeps working.\n\n" +
          "Tip: wire /api/llm to call your hosted model and pass `handshake` into the request headers/body.",
        citations: [],
      };
    }

    const data = (await res.json()) as LLMResponse;

    // Telemetry (post-call)
    emitTelemetry("llm.call.complete", { ok: data.ok });
    return data;
  } catch (err: any) {
    emitTelemetry("llm.call.error", { error: String(err?.message || err) });
    // Front-end-only mock fallback
    return {
      ok: true,
      text:
        "⚠️ (Mocked) Network error or no backend. Returning placeholder text so you can proceed.",
      citations: [],
    };
  }
}
