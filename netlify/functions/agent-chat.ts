import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, modelId, corsHeaders } from "./_bedrock";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";

const REQUIRED_KEY = process.env.TSCA_API_KEY;            // secret (server-only)
const PUBLIC_KEY   = process.env.VITE_TSCA_PUBLIC_KEY;    // public (also in client)

function sysPrompt(params: {
  mode?: Mode;
  stakes?: Stakes;
  cite?: CitePolicy;
  omission_scan?: "auto" | boolean;
  profile?: "default" | "strict" | "lenient";
}) {
  const { mode="--careful", stakes="medium", cite="auto", omission_scan="auto", profile="default" } = params || {};
  return [
    "You are Clarity Armor, an epistemic analysis agent.",
    "Core rules:",
    "- Be specific. Avoid false precision. State uncertainty plainly.",
    "- Prefer evidence. If evidence is weak, qualify it.",
    "- Flag manipulative rhetoric, vagueness, and unnamed authority.",
    "- Do not invent citations. If none, say so.",
    `mode=${mode} stakes=${stakes} cite_policy=${cite} omission_scan=${String(omission_scan)} reflex_profile=${profile}`,
  ].join("\n");
}

function toAnthropicMessages(
  history: Array<{ role: "user" | "assistant"; text: string }>,
  userNow: string,
  system: string
) {
  const msgs = history.map((h) => ({
    role: h.role,
    content: [{ type: "text", text: h.text }],
  }));
  // Inline system into the user turn for Bedrock Anthropic
  msgs.push({ role: "user", content: [{ type: "text", text: `${system}\n\nUser: ${userNow}` }] });
  return msgs as any;
}

export const handler: Handler = async (event) => {
  // CORS (allow our custom header)
  const headers = {
    ...corsHeaders,
    "Access-Control-Allow-Headers": "content-type,x-tsca-key",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  // ✅ Simple header check (allow either secret or public key)
  const gotKey =
    event.headers["x-tsca-key"] ||
    event.headers["X-Tsca-Key"] ||
    event.headers["X-TSCA-KEY"];

  const ok =
    (!!REQUIRED_KEY && gotKey === REQUIRED_KEY) ||
    (!!PUBLIC_KEY && gotKey === PUBLIC_KEY);

  if (!ok) {
    return { statusCode: 401, headers, body: "Unauthorized" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      text = "",
      history = [] as Array<{ role: "user" | "assistant"; text: string }>,
      mode,
      stakes,
      cite_policy,
      omission_scan,
      reflex_profile,
    } = body;

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
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ message, tools: [] }),
    };
  } catch (e: any) {
    console.error("agent-chat error:", e);
    return { statusCode: 500, headers, body: e?.message || "agent-chat error" };
  }
};
