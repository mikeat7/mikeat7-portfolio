import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, modelId, corsHeaders } from "./_bedrock";

const REQUIRED_KEY = process.env.TSCA_API_KEY;

export const handler: Handler = async (event) => {
  const headers = {
    ...corsHeaders,
    "Access-Control-Allow-Headers": "content-type,x-tsca-key",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  const gotKey = event.headers["x-tsca-key"] || event.headers["X-Tsca-Key"];
  if (REQUIRED_KEY && gotKey !== REQUIRED_KEY) {
    return { statusCode: 401, headers, body: "Unauthorized" };
  }

  try {
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
      messages: [{ role: "user", content: [{ type: "text", text: prompt }]}],
      max_tokens: 1200,
      temperature: 0.2,
    };

    const res = await bedrock.send(new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    }));

    const out = JSON.parse(new TextDecoder().decode(res.body as Uint8Array));
    const reportText = out?.content?.[0]?.text ?? "(no report)";

    return { statusCode: 200, headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify({ reportText }) };
  } catch (e: any) {
    console.error("agent-summarize error:", e);
    return { statusCode: 500, headers, body: e?.message || "agent-summarize error" };
  }
};


