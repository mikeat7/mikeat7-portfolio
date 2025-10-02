import type { Handler } from "@netlify/functions";
import { bedrock, modelId, corsHeaders, InvokeModelCommand } from "./_bedrock";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };

  try {
    const { inputText, frames, handshakeOverrides } = JSON.parse(event.body || "{}");

    const prompt = [
      "You are Clarity Armor, an epistemic analysis agent.",
      "Write a concise analysis report based on FRAMES.",
      "Principles: epistemic humility; qualify uncertainty; avoid false precision; highlight omissions if present.",
      "",
      "INPUT:",
      String(inputText || ""),
      "",
      "FRAMES (JSON):",
      JSON.stringify(frames || [], null, 2),
      "",
      "HANDSHAKE:",
      JSON.stringify(handshakeOverrides || {}, null, 2),
    ].join("\n");

    const res = await bedrock.send(new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{ role: "user", content: [{ type: "text", text: prompt }]}],
        max_tokens: 1600,
        temperature: 0.2,
      }),
    }));

    const out = JSON.parse(new TextDecoder().decode(res.body));
    const reportText = out?.content?.[0]?.text ?? "(no report)";
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ reportText }),
    };
  } catch (e: any) {
    return { statusCode: 500, headers: corsHeaders, body: e?.message || "agent-summarize error" };
  }
};

