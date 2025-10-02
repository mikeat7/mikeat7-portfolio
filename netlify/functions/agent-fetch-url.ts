// netlify/functions/agent-fetch-url.ts
import type { Handler } from "@netlify/functions";

function stripHtml(html: string) {
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const noStyles = noScripts.replace(/<style[\s\S]*?<\/style>/gi, "");
  const text = noStyles.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

export const handler: Handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: "Method Not Allowed" };

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
    // Only attempt HTML/text; skip binaries
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(ct)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", ...cors },
        body: JSON.stringify({ text: `(non-text content: ${ct})` }),
      };
    }

    const html = await resp.text();
    const text = stripHtml(html).slice(0, 200_000); // safety cap
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ text }),
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ error: e?.message || "fetch-url error" }),
    };
  }
};
