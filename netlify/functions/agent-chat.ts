// netlify/functions/agent-chat.ts
import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { makeBedrockClient } from "./_bedrock";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0";

function sysPrompt(params: {
  mode?: Mode;
  stakes?: Stakes;
  cite?: CitePolicy;
  omission_scan?: "auto" | boolean;
  profile?: "default" | "strict" | "lenient";
}) {
  const {
    mode = "--careful",
    stakes = "medium",
    cite = "auto",
    omission_scan = "auto",
    profile = "default",
  } = params || {};
  return [
    "You are Clarity Armor, an epistemic analysis agent.",
    "Core rules:",
    "- Be specific. Avoid false precision. State uncertainty plainly.",
    "- Prefer evidence. If evidence is weak, qualify it.",
    "- Flag manipulative rhetoric, vagueness, and unnamed authority.",
    "- Do not invent citations. If none, say so.",
    `mode=${mode} stakes=${stakes} cite_policy=${cite} omission_scan=${String(
      omission_scan
    )} reflex_profile=${profile}`,
  ].join("\n");
}

function toAnthropicMessages(
  history: Array<{ role: "user" | "assistant"; text: string }>,
  userNow: string,
  system: string
) {
  // Anthropic (Bedrock) doesn't have a separate system role. Inline system into the user turn.
  const msgs = history.map((h) => ({
    role: h.role,
    content: [{ type: "text", text: h.text }],
  }));
  msgs.push({
    role: "user",
    content: [{ type: "text", text: `${system}\n\nUser: ${userNow}` }],
  });
  return msgs;
}

export const handler: Handler = async (event) => {
  // CORS (safe default)
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
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

    const system = sysPrompt({
      mode,
      stakes,
      cite: cite_policy,
      omission_scan,
      profile: reflex_profile,
    });
    const messages = toAnthropicMessages(history, String(text), system);

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      messages,
      max_tokens: 1400,
      temperature: 0.2,
    };

    const client = makeBedrockClient(); // <- uses BEDROCK_REGION + your AWS_* env creds
    const res = await client.send(
      new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: Buffer.from(JSON.stringify(payload)),
      })
    );

    const out = JSON.parse(Buffer.from(res.body as any).toString("utf-8"));
    const message = out?.content?.[0]?.text ?? "(no reply)";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ message, tools: [] }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ error: e?.message || "agent-chat error" }),
    };
  }
};
