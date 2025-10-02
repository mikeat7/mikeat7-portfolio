import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, modelId, corsHeaders } from "./_bedrock";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";

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
  userNow: string
) {
  const msgs = history.map((h) => ({
    role: h.role,
    content: [{ type: "text", text: h.text }],
  }));
  msgs.push({ role: "user", content: [{ type: "text", text: userNow }] });
  return msgs;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };

  try {
    // Sanity check: ensure creds exist (Netlify reserves AWS_* names, so we use CLARITY_*)
    if (!process.env.CLARITY_AWS_ACCESS_KEY_ID || !process.env.CLARITY_AWS_SECRET_ACCESS_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: "Server misconfig: missing CLARITY_AWS_ACCESS_KEY_ID/CLARITY_AWS_SECRET_ACCESS_KEY.",
      };
    }

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

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      system,
      messages: toAnthropicMessages(history, String(text || "")),
      max_tokens: 1400,
      temperature: 0.2,
    };

    const res = await bedrock.send(
      new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      })
    );

    const out = JSON.parse(new TextDecoder().decode(res.body));
    const message = out?.content?.[0]?.text ?? "(no reply)";

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ message, tools: [] }),
    };
  } catch (e: any) {
    return { statusCode: 500, headers: corsHeaders, body: e?.message || "agent-chat error" };
  }
};
