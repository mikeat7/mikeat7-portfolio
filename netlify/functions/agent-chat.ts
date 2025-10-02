import type { Handler } from "@netlify/functions";
import { makeBedrock, bedrockChat } from "./_bedrock";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";

function sysPrompt(p: {
  mode?: Mode; stakes?: Stakes; cite_policy?: CitePolicy;
  omission_scan?: "auto" | boolean; reflex_profile?: "default" | "strict" | "lenient";
}) {
  const { mode="--careful", stakes="medium", cite_policy="auto", omission_scan="auto", reflex_profile="default" } = p || {};
  return [
    "You are Clarity Armor, an epistemic analysis agent.",
    "Core rules:",
    "- Be specific. Avoid false precision. State uncertainty plainly.",
    "- Prefer evidence. If evidence is weak, qualify it.",
    "- Flag manipulative rhetoric, vagueness, and unnamed authority.",
    "- Do not invent citations. If none, say so.",
    `mode=${mode} stakes=${stakes} cite_policy=${cite_policy} omission_scan=${String(omission_scan)} reflex_profile=${reflex_profile}`
  ].join("\n");
}

function toAnthropicMessages(
  history: Array<{role:"user"|"assistant", text:string}>,
  userNow: string,
  system: string
) {
  const msgs = history.map(h => ({ role: h.role, content: [{ type:"text", text: h.text }]}));
  // Inline system into the next user turn for Bedrock Anthropic
  msgs.push({ role: "user", content: [{ type: "text", text: `${system}\n\nUser: ${userNow}` }] });
  return msgs as Array<{ role: "user" | "assistant"; content: { type: "text"; text: string }[] }>;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { client, modelId, region, usingClarity } = makeBedrock();

    const body = JSON.parse(event.body || "{}");
    const {
      text = "",
      history = [] as Array<{ role: "user" | "assistant"; text: string }>,
      mode, stakes, cite_policy, omission_scan, reflex_profile,
      debug = false
    } = body;

    const system = sysPrompt({ mode, stakes, cite_policy, omission_scan, reflex_profile });
    const messages = toAnthropicMessages(history, String(text), system);

    const message = await bedrockChat({ client, modelId, messages });

    const payload: any = { message, tools: [] };
    if (debug) payload.debug = { usingClarityCreds: usingClarity, region, modelId };

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "agent-chat error" };
  }
};
