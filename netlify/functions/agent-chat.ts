// File: netlify/functions/agent-chat.ts
import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, modelId, corsHeaders as baseCors } from "./_bedrock";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";

// --- CORS + Security Gates ---------------------------------------------------
const ALLOWED_ORIGINS = new Set([
  "https://clarityarmor.com",
  "http://localhost:5173",
]);

// Ensure preflight allows our custom header
const corsHeaders = {
  ...baseCors,
  "Access-Control-Allow-Headers": "authorization,content-type,x-tsca-key,x-amz-date,x-amz-security-token,x-amz-user-agent,x-amzn-trace-id,x-api-key",
};

function forbidden(body = "Forbidden") {
  return { statusCode: 403, headers: corsHeaders, body };
}

function unauthorized(body = "Unauthorized") {
  return { statusCode: 401, headers: corsHeaders, body };
}

function badRequest(body = "Bad Request") {
  return { statusCode: 400, headers: corsHeaders, body };
}

function getOrigin(event: any): string {
  return event.headers?.origin || event.headers?.Origin || "";
}

function requireApiKey(event: any) {
  // 1) Origin allowlist
  const origin = getOrigin(event);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return forbidden("Forbidden origin");
  }

  // 2) x-tsca-key header check (required)
  const expected =
    process.env.TSCA_API_KEY ||
    // temporary fallback so this deploy works immediately; remove after setting the env var in Netlify
    "hihfgjejjnvj7787529y329y83898y938y5982yhuhukhkhkkjjh";

  if (!expected) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: "Server misconfigured: TSCA_API_KEY is not set",
    };
  }

  const provided =
    event.headers?.["x-tsca-key"] ||
    event.headers?.["X-Tsca-Key"] ||
    event.headers?.["X-TSCA-Key"];

  if (!provided) return unauthorized("Missing x-tsca-key");
  if (provided !== expected) return forbidden("Invalid x-tsca-key");
  return null;
}
// ---------------------------------------------------------------------------

function sysPrompt(params: {
  mode?: Mode; stakes?: Stakes; cite?: CitePolicy;
  omission_scan?: "auto" | boolean; profile?: "default" | "strict" | "lenient";
}) {
  const { mode="--careful", stakes="medium", cite="auto", omission_scan="auto", profile="default" } = params || {};
  return [
    "You are Clarity Armor, an epistemic analysis agent.",
    "Core rules:",
    "- Be specific. Avoid false precision. State uncertainty plainly.",
    "- Prefer evidence. If evidence is weak, qualify it.",
    "- Flag manipulative rhetoric, vagueness, and unnamed authority.",
    "- Do not invent citations. If none, say so.",
    `mode=${mode} stakes=${stakes} cite_policy=${cite} omission_scan=${String(omission_scan)} reflex_profile=${profile}`
  ].join("\n");
}

function toAnthropicMessages(
  history: Array<{role:"user"|"assistant", text:string}>,
  userNow: string,
  system: string
) {
  const msgs = history.map(h => ({ role: h.role, content: [{ type:"text", text: h.text }]}));
  // For Bedrock Anthropic, inline system into the user turn:
  msgs.push({ role: "user", content: [{ type: "text", text: `${system}\n\nUser: ${userNow}` }] });
  return msgs;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };
  }

  // 🔐 Gate: origin + x-tsca-key required
  const gate = requireApiKey(event);
  if (gate) return gate;

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      text = "",
      history = [] as Array<{ role: "user" | "assistant"; text: string }>,
      mode, stakes, cite_policy, omission_scan, reflex_profile
    } = body;

    if (!text || typeof text !== "string") {
      return badRequest("Missing 'text' string");
    }

    const system = sysPrompt({ mode, stakes, cite: cite_policy, omission_scan, profile: reflex_profile });
    const messages = toAnthropicMessages(history, String(text), system);

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      messages,
      max_tokens: 800,
      temperature: 0.2,
    };

    const res = await bedrock.send(new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    }));

    const out = JSON.parse(new TextDecoder().decode(res.body as Uint8Array));
    const message = out?.content?.[0]?.text ?? "(no reply)";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ message, tools: [] })
    };
  } catch (e: any) {
    console.error("agent-chat error:", e);
    return { statusCode: 500, headers: corsHeaders, body: e?.message || "agent-chat error" };
  }
};

