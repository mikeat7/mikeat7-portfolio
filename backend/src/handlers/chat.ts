// backend/src/handlers/chat.ts
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { maybeInvokeBedrock } from "../lib/bedrock.js";
import { stripTags } from "../lib/cleanHtml.js";

// --- Types compatible with both old and new payloads ---
type Role = "user" | "assistant" | "tool" | "system";

type MessageTurn = {
  role: Role;
  // for messages[] (new contract)
  content?: string;
  // for legacy history[]
  text?: string;
};

interface Handshake {
  mode: "--direct" | "--careful" | "--recap";
  stakes: "low" | "medium" | "high";
  min_confidence: number;
  cite_policy: "auto" | "force" | "off";
  omission_scan: "auto" | boolean;
  reflex_profile: "default" | "strict" | "lenient";
  codex_version: string;
}

interface ChatRequestBodyNew {
  messages?: MessageTurn[];
  handshake: Handshake;
  sessionId?: string;
}

interface ChatRequestBodyLegacy {
  input?: { text?: string; query?: string };
  history?: Array<{ role: Exclude<Role, "system">; text: string }>;
  handshake: Handshake;
}

type ChatRequestBody = ChatRequestBodyNew & ChatRequestBodyLegacy;

function validHandshake(h: any): h is Handshake {
  if (!h) return false;
  return (
    ["--direct", "--careful", "--recap"].includes(h.mode) &&
    ["low", "medium", "high"].includes(h.stakes) &&
    typeof h.min_confidence === "number" &&
    ["auto", "force", "off"].includes(h.cite_policy) &&
    (h.omission_scan === "auto" || typeof h.omission_scan === "boolean") &&
    ["default", "strict", "lenient"].includes(h.reflex_profile) &&
    typeof h.codex_version === "string"
  );
}

// Extract the most recent URL from the last N user turns
function detectRecentUrl(turns: Array<{ role: Role; text: string }>, lookback = 5): string | null {
  const urlRe = /https?:\/\/[^\s<>"'()]+/gi;
  const userTurns = turns.filter((m) => m.role === "user").slice(-lookback).reverse();
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
    if (!body || !validHandshake(body.handshake)) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Invalid payload or handshake." }),
      };
    }

    const handshake = body.handshake;

    // Normalize to a single conversation array of { role, text }
    const convo: Array<{ role: Role; text: string }> = [];

    if (Array.isArray(body.messages) && body.messages.length > 0) {
      // New contract: messages[]
      for (const m of body.messages) {
        const text = (m.content ?? m.text ?? "").trim();
        if (!text) continue;
        // Allow "system" internally but we won't send it to the model as a user/tool turn
        convo.push({ role: m.role, text });
      }
    } else {
      // Legacy contract: input + history[]
      const legacyHistory = Array.isArray(body.history) ? body.history : [];
      for (const h of legacyHistory) {
        const text = (h.text ?? "").trim();
        if (!text) continue;
        convo.push({ role: h.role, text });
      }
      const userText = (body.input?.text ?? body.input?.query ?? "").trim();
      if (userText) {
        convo.push({ role: "user", text: userText });
      }
    }

    // Minimal validation: need at least one user/assistant/tool turn of text
    if (convo.length === 0) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "No conversation content found." }),
      };
    }

    // Auto-tool: fetch latest URL if present in recent user turns
    const toolTraces: Array<{
      name: string;
      args: Record<string, any>;
      duration_ms?: number;
      result_preview: string;
    }> = [];

    const url = detectRecentUrl(convo, 5);
    if (url) {
      try {
        const t0 = Date.now();
        const { text } = await toolFetchUrl(url);
        const fetchedSnippet = text.slice(0, 3500);
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          duration_ms: Date.now() - t0,
          result_preview: fetchedSnippet.slice(0, 500),
        });
        convo.push({ role: "tool", text: `fetch_url(${url}) => ${fetchedSnippet.slice(0, 2000)}` });
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

    // Build compact prompt for Bedrock (we keep system notes out of the chat transcript)
    const transcript = convo
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n\n");

    const modelPrompt = `SYSTEM:
You are a policy-gated analyzer governed by codex v0.9. Be honest about uncertainty.
Respect the handshake: mode=${handshake.mode}, stakes=${handshake.stakes}, min_conf=${handshake.min_confidence},
cite_policy=${handshake.cite_policy}, omission_scan=${String(handshake.omission_scan)}, profile=${handshake.reflex_profile}.
If info is missing, hedge or ask a focused question. Avoid false precision.

CONVERSATION:
${transcript}

TASK:
Respond briefly with what you know, what you don't, and what you would fetch or check next. If a URL was provided, incorporate the fetched snippet when relevant.`;

    let bedrockNote: string | null = null;
    try {
      console.info(
        "[chat] invoking Bedrock. MODEL =",
        process.env.BEDROCK_MODEL_ID || "(missing)",
        "REGION =",
        process.env.BEDROCK_REGION || "(missing)"
      );
      bedrockNote = await maybeInvokeBedrock(modelPrompt);
      console.info("[chat] Bedrock returned:", bedrockNote ? bedrockNote.slice(0, 200) : "(null)");
    } catch (e: any) {
      console.error("[chat] Bedrock invocation failed:", e?.message || e);
      console.error("[chat] Stack:", e?.stack);
      bedrockNote = null; // soft-fail
    }

    const response = {
      ok: true,
      message: bedrockNote ?? "Agent response generated without Bedrock (dry run).",
      frames: [], // transparency frames come from client VX
      tools: toolTraces,
      handshake,
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

