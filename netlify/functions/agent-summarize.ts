import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, modelId, corsHeaders } from "./_bedrock";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };

  try {
    if (!process.env.CLARITY_AWS_ACCESS_KEY_ID || !process.env.CLARITY_AWS_SECRET_ACCESS_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: "Server misconfig: missing CLARITY_AWS_ACCESS_KEY_ID/CLARITY_AWS_SECRET_ACCESS_KEY.",
      };
    }

    const { inputText, frames, handshakeOverrides } = JSON.parse(event.body || "{}");

    const prompt = [
      "Write a concise analysis report based on FRAMES.",
      "Principles: epistemic humility; qualify uncertainty; avoid false precision; highlight omissions if present.",
      "Bullet points are fine. If citations are required by policy, say which claims would need them.",
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

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      max_tokens: 1600,
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

