// netlify/functions/agent-summarize.ts
import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { makeBedrockClient } from "./_bedrock";

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0";

export const handler: Handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: "Method Not Allowed" };

  try {
    const { inputText, frames, handshakeOverrides } = JSON.parse(event.body || "{}");

    // Keep payloads bounded
    const input = String(inputText || "").slice(0, 60_000);
    const framesJson = JSON.stringify(frames || [], null, 2).slice(0, 120_000);
    const handshakeJson = JSON.stringify(handshakeOverrides || {}, null, 2).slice(0, 20_000);

    const prompt = [
      "Write a concise analysis report based on FRAMES.",
      "Principles: epistemic humility; qualify uncertainty; avoid false precision; highlight omissions if present.",
      "Bullet points are fine. If citations are required by policy, say which claims would need them.",
      "",
      "INPUT:",
      input,
      "",
      "FRAMES (JSON):",
      framesJson,
      "",
      "HANDSHAKE:",
      handshakeJson,
    ].join("\n");

    const client = makeBedrockClient(); // reads BEDROCK_REGION + AWS_* creds
    const res = await client.send(
      new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: Buffer.from(
          JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            messages: [{ role: "user", content: [{ type: "text", text: prompt }]}],
            max_tokens: 1600,
            temperature: 0.2,
          })
        ),
      })
    );

    const out = JSON.parse(Buffer.from(res.body as any).toString("utf-8"));
    const reportText = out?.content?.[0]?.text ?? "(no report)";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ reportText }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ error: e?.message || "agent-summarize error" }),
    };
  }
};

