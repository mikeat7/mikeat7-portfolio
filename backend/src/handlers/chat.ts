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

function firstUrl(s: string): string | null {
  const m = s.match(/https?:\/\/[^\s)]+/i);
  return m ? m[0] : null;
}

async function toolFetchUrl(url: string): Promise<{ text: string; contentType: string }> {
  const t0 = Date.now();
  const res = await fetch(url, { redirect: "follow" });
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();
  const text = contentType.includes("html") ? stripTags(raw) : raw;
  const duration_ms = Date.now() - t0;
  return { text, contentType };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (event.requestContext.http.method === "OPTIONS") {
      return { statusCode: 200, headers: cors(), body: "" };
    }

    const body = event.body ? (JSON.parse(event.body) as ChatRequestBody) : null;
    if (!body?.input || !validateHandshake(body.handshake)) {
      return { statusCode: 400, headers: cors(), body: JSON.stringify({ ok: false, message: "Invalid payload or handshake." }) };
    }

    // Build conversation state
    const history: Message[] = Array.isArray(body.history) ? body.history : [];
    const userText = (body.input.text || body.input.query || "").trim();

    // Append the new user turn if not present
    if (userText) {
      history.push({ role: "user", text: userText });
    }

    // Optional tool: auto fetch when a URL is present in the latest user turn
    const toolTraces: ToolTrace[] = [];
    let fetchedSnippet = "";
    const lastUser = [...history].reverse().find((m) => m.role === "user");
    const url = lastUser ? firstUrl(lastUser.text) : null;

    if (url) {
      try {
        const start = Date.now();
        const { text } = await toolFetchUrl(url);
        fetchedSnippet = text.slice(0, 3500);
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          duration_ms: Date.now() - start,
          result_preview: fetchedSnippet.slice(0, 500)
        });
        history.push({ role: "tool", text: `fetch_url(${url}) => ${fetchedSnippet.slice(0, 2000)}` });
      } catch (e: any) {
        toolTraces.push({
          name: "fetch_url",
          args: { url },
          result_preview: `ERROR: ${e?.message || e}`
        });
      }
    }

    // Construct a concise prompt for Bedrock (if configured)
    const convo = history.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n\n");
    const modelPrompt =
`SYSTEM:
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
      frames: [],          // client runs VX for transparency
      tools: toolTraces,
      handshake: body.handshake
    };

    return { statusCode: 200, headers: cors(), body: JSON.stringify(response) };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ ok: false, message: "Internal error" }) };
  }
};

