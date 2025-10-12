// backend/src/handlers/chat.ts
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { maybeInvokeBedrock } from "../lib/bedrock.js";
import { stripTags } from "../lib/cleanHtml.js";
import type { Message } from "../lib/types.js";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";
type ReflexProfile = "default" | "strict" | "lenient";

type Handshake = {
  mode: Mode;
  stakes: Stakes;
  min_confidence: number;
  cite_policy: CitePolicy;
  omission_scan: "auto" | boolean;
  reflex_profile: ReflexProfile;
  codex_version: string;
};

// Old contract
type ChatRequestOld = {
  input?: { text?: string; query?: string };
  history?: Message[];
  handshake: Handshake;
};

// New contract (OpenAI-style)
type ChatRequestNew = {
  messages?: Array<{ role: "system" | "user" | "assistant" | "tool"; content: string }>;
  handshake: Handshake;
  sessionId?: string;
};

type ChatRequestBody = ChatRequestOld | ChatRequestNew;

type ToolTrace = {
  name: string;
  args: Record<string, any>;
  duration_ms?: number;
  result_preview?: string;
};

type ChatResponse = {
  ok: true;
  message: string;
  frames: any[];
  tools: ToolTrace[];
  handshake: Handshake;
  sessionId?: string;
} | {
  ok: false;
  message: string;
};

function validateHandshake(h: any): h is Handshake {
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

// Convert either request shape to a unified history[]
function normalizeToHistory(body: ChatRequestBody): { history: Message[]; sessionId?: string } {
  // New contract: messages -> history
  if ("messages" in body && Array.isArray(body.messages)) {
    const history: Message[] = body.messages.map((m) => ({
      role: m.role,
      text: m.content,
    }));
    return { history, sessionId: (body as ChatRequestNew).sessionId };
  }
  // Old contract: input/history
  const old = body as ChatRequestOld;
  const history: Message[] = Array.isArray(old.history) ? [...old.history] : [];
  const userText = (old.input?.text ?? old.input?.query ?? "").trim();
  if (userText) history.push({ role: "user", text: userText });
  return { history };
}

// Return the most recent URL from any of the last N user messages
function detectRecentUrl(history: Message[], lookback = 5): string | null {
  const urlRe = /https?:\/\/[^\s<>"'()]+/gi;
  const userTurns = history.filter((m) => m.role === "user").slice(-lookback).reverse();
  for (const m of userTurns) {
    const matches = m.text.match(urlRe);
    if (matches && matches.length > 0) return matches[0];
  }
  return null;
}

async function toolFetchUrl(url: string): Promise<{ text: string; contentType: string }> {
  const res = await fetch(url, { redirect: "follow" });
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();
  const text = contentType.includes("html") ? stripTags(raw) : raw;
  return { text, contentType };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (event.requestContext.http.method === "OPTIONS") {
      return { statusCode: 200, headers: cors(), body: "" };
    }

    const body = event.body ? (JSON.parse(event.body) as ChatRequestBody) : null;
    if (!body || !validateHandshake((body as any).handshake)) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Invalid payload or handshake." }),
      };
    }

    const { history, sessionId } = normalizeToHistory(body);
    const toolTraces: ToolTrace[] = [];

    // Auto-tool: fetch the most recent URL seen in recent user turns
    const url = detectRecentUrl(history, 5);
    if (url) {
      try {
        const start = Date.now();
        const { text } = await toolFetchUrl(url);
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          duration_ms: Date.now() - start,
          result_preview: text.slice(0, 500),
        });
        history.push({
          role: "tool",
          text: `fetch_url(${url}) => ${text.slice(0, 2000)}`,
        });
      } catch (e: any) {
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          result_preview: `ERROR: ${e?.message || String(e)}`,
        });
      }
    } else {
      toolTraces.push({
        name: "fetch_url",
        args: {},
        result_preview: "no_url_detected_in_recent_user_turns",
      });
    }

    // Build concise prompt for Bedrock (if configured)
    const convo = history.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n\n");
    const modelPrompt = `SYSTEM:
You are a policy-gated analyzer governed by codex v0.9. Be honest and explicit about uncertainty.
Respect the handshake: mode=${(body as any).handshake.mode}, stakes=${(body as any).handshake.stakes}, min_conf=${(body as any).handshake.min_confidence},
cite_policy=${(body as any).handshake.cite_policy}, omission_scan=${String((body as any).handshake.omission_scan)}, profile=${(body as any).handshake.reflex_profile}.
If information is missing, hedge or ask a focused question. Avoid false precision.

CONVERSATION:
${convo}

TASK:
Respond briefly with what you know, what you don't, and what you would fetch or check next. If a URL was provided, incorporate the fetched snippet when relevant.`;

    let bedrockNote: string | null = null;
    try {
      console.log(
        "[chat] invoking Bedrock. MODEL =",
        process.env.BEDROCK_MODEL_ID,
        "REGION =",
        process.env.BEDROCK_REGION || "us-east-1"
      );
      bedrockNote = await maybeInvokeBedrock(modelPrompt);
      console.log("[chat] Bedrock returned:", bedrockNote ? bedrockNote.slice(0, 200) : "(null)");
    } catch (e: any) {
      console.error("[chat] Bedrock invocation failed:", e?.message || String(e));
      console.error("[chat] Stack:", e?.stack);
      bedrockNote = null; // soft-fail
    }

    const response: ChatResponse = {
      ok: true,
      message: bedrockNote ?? "Agent response generated without Bedrock (dry run).",
      frames: [], // client runs VX locally for transparency
      tools: toolTraces,
      handshake: (body as any).handshake,
      ...(sessionId ? { sessionId } : {}),
    };

    return { statusCode: 200, headers: cors(), body: JSON.stringify(response) };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ ok: false, message: "Internal error" }),
    };
  }
};
