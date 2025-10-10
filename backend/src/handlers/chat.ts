// backend/src/handlers/chat.ts
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { maybeInvokeBedrock } from "../lib/bedrock.js";
import { stripTags } from "../lib/cleanHtml.js";
import type { ChatRequestBody, ChatResponse, ToolTrace, Message } from "../lib/types.js";

function validateHandshake(h: any): h is ChatRequestBody["handshake"] {
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

// Accept both modern and legacy shapes by normalizing into { input, history }
function normalizeBody(raw: any): ChatRequestBody | null {
  if (!raw || typeof raw !== "object") return null;

  // Clone shallow so we can assign safely
  const b: any = { ...raw };

  // Case A: modern "messages" array → build history[] and input.text
  if (Array.isArray(b.messages)) {
    const msgs = b.messages;
    const history: Message[] = [];

    for (const m of msgs) {
      const role = m?.role;
      const text = typeof m?.text === "string" ? m.text :
                   typeof m?.content === "string" ? m.content : "";
      if (!text) continue;
      if (role === "system" || role === "user" || role === "assistant" || role === "tool") {
        history.push({ role, text });
      }
    }

    // If no explicit input provided, infer last user as the current input
    if (!b.input) {
      const lastUser = [...history].reverse().find((m) => m.role === "user");
      if (lastUser) {
        b.input = { text: lastUser.text };
      }
    }

    b.history = Array.isArray(b.history) ? b.history : history;
  }

  // Case B: legacy quick shape: top-level text/history without input
  if (!b.input && typeof b.text === "string") {
    b.input = { text: b.text };
  }

  // Ensure required containers exist
  if (!b.input || typeof b.input !== "object") b.input = { text: "" };
  if (!Array.isArray(b.history)) b.history = [];

  return b as ChatRequestBody;
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

    const raw = event.body ? JSON.parse(event.body) : null;
    const body = normalizeBody(raw);

    if (!body || !validateHandshake((body as any).handshake)) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Invalid payload or handshake." }),
      };
    }

    // Build conversation state
    const history: Message[] = Array.isArray(body.history) ? body.history : [];
    const userText = (body.input?.text || (body as any).input?.query || "").trim();

    // Append the new user turn if not present
    if (userText) {
      history.push({ role: "user", text: userText });
    }

    // Auto-tool: fetch the most recent URL seen in recent user turns
    const toolTraces: ToolTrace[] = [];
    let fetchedSnippet = "";
    const url = detectRecentUrl(history, 5);

    if (url) {
      try {
        const start = Date.now();
        const { text } = await toolFetchUrl(url);
        fetchedSnippet = text.slice(0, 3500);
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          duration_ms: Date.now() - start,
          result_preview: fetchedSnippet.slice(0, 500),
        });
        history.push({
          role: "tool",
          text: `fetch_url(${url}) => ${fetchedSnippet.slice(0, 2000)}`,
        });
      } catch (e: any) {
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          result_preview: `ERROR: ${e?.message || String(e)}`,
        });
      }
    } else {
      // Breadcrumb for tests
      toolTraces.push({
        name: "fetch_url",
        args: {},
        result_preview: "no_url_detected_in_recent_user_turns",
      });
    }

    // Construct a concise prompt for Bedrock (if configured)
    const convo = history.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n\n");
    const modelPrompt = `SYSTEM:
You are a policy-gated analyzer governed by codex v0.9. Be honest and explicit about uncertainty.
Respect the handshake: mode=${body.handshake.mode}, stakes=${body.handshake.stakes}, min_conf=${body.handshake.min_confidence},
cite_policy=${body.handshake.cite_policy}, omission_scan=${String(body.handshake.omission_scan)}, profile=${body.handshake.reflex_profile}.
If information is missing, hedge or ask a focused question. Avoid false precision.

CONVERSATION:
${convo}

TASK:
Respond briefly with what you know, what you don't, and what you would fetch or check next. If a URL was provided, incorporate the fetched snippet when relevant.`;

    let bedrockNote: string | null = null;
    try {
      bedrockNote = await maybeInvokeBedrock(modelPrompt);
    } catch {
      bedrockNote = null; // soft-fail: still return 200
    }

    const response: ChatResponse = {
      ok: true,
      message: bedrockNote ?? "Agent response generated without Bedrock (dry run).",
      frames: [], // client runs VX for transparency
      tools: toolTraces,
      handshake: body.handshake,
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
