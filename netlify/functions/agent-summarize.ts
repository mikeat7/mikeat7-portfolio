import type { Handler } from "@netlify/functions";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, modelId, corsHeaders as baseCors } from "./_bedrock";

// ---- CORS + Security Gates (same as agent-chat) ----------------------------
const ALLOWED_ORIGINS = new Set([
  "https://clarityarmor.com",
  "http://localhost:5173",
]);

const corsHeaders = {
  ...baseCors,
  "Access-Control-Allow-Headers":
    "authorization,content-type,x-tsca-key,x-amz-date,x-amz-security-token,x-amz-user-agent,x-amzn-trace-id,x-api-key",
};

function forbidden(body = "Forbidden") {
  return { statusCode: 403, headers: corsHeaders, body };
}
function unauthorized(body = "Unauthorized") {
  return { statusCode: 401, headers: corsHeaders, body };
}
function getOrigin(event: any): string {
  return event.headers?.origin || event.headers?.Origin || "";
}

function requireApiKey(event: any) {
  const origin = getOrigin(event);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return forbidden("Forbidden origin");
  }

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

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS")
    return { statusCode: 200, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };

  // 🔐 Gate: origin + x-tsca-key required
  const gate = requireApiKey(event);
  if (gate) return gate;

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
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      max_tokens: 1200,
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

    const out = JSON.parse(new TextDecoder().decode(res.body as Uint8Array));
    const reportText = out?.content?.[0]?.text ?? "(no report)";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ reportText }),
    };
  } catch (e: any) {
    console.error("agent-summarize error:", e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: e?.message || "agent-summarize error",
    };
  }
};

