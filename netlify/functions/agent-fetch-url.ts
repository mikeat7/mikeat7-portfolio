import type { Handler } from "@netlify/functions";

// ---- CORS + Security Gates (aligned with agent-chat/summarize) --------------
const ALLOWED_ORIGINS = new Set([
  "https://clarityarmor.com",
  "http://localhost:5173",
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // keep wide for simplicity; origin is still checked below
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "content-type,x-tsca-key,authorization,x-amz-date,x-amz-security-token,x-amz-user-agent,x-amzn-trace-id,x-api-key",
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

function stripHtml(html: string) {
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const noStyles = noScripts.replace(/<style[\s\S]*?<\/style>/gi, "");
  const text = noStyles.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS")
    return { statusCode: 200, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };

  // 🔐 Gate: origin + x-tsca-key required
  const gate = requireApiKey(event);
  if (gate) return gate;

  try {
    const { url } = JSON.parse(event.body || "{}");
    const u = new URL(String(url || ""));
    if (!/^https?:$/.test(u.protocol)) throw new Error("Only http/https allowed.");

    const resp = await fetch(u.toString(), {
      redirect: "follow",
      headers: { "User-Agent": "TSCA-fetch/1.0" },
    });

    if (!resp.ok) throw new Error(`Upstream ${resp.status} ${resp.statusText}`);

    const ct = String(resp.headers.get("content-type") || "");
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(ct)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ text: `(non-text content: ${ct})` }),
      };
    }

    const html = await resp.text();
    const text = stripHtml(html).slice(0, 200_000); // safety cap

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ text }),
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ error: e?.message || "fetch-url error" }),
    };
  }
};

