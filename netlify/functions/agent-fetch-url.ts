import type { Handler } from "@netlify/functions";

// ✅ allow either secret (server) or public (browser) key
const REQUIRED_KEY = process.env.TSCA_API_KEY;
const PUBLIC_KEY   = process.env.VITE_TSCA_PUBLIC_KEY;

// very conservative HTML→text
function stripHtml(html: string) {
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const noStyles = noScripts.replace(/<style[\s\S]*?<\/style>/gi, "");
  const text = noStyles.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

// Pretend to be a normal browser visit (helps avoid 403 on many sites)
const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Referer": "https://www.google.com/",
  "Upgrade-Insecure-Requests": "1",
};

export const handler: Handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type,x-tsca-key",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: "Method Not Allowed" };

  // 🔐 header key check (allow either)
  const gotKey =
    event.headers["x-tsca-key"] ||
    event.headers["X-Tsca-Key"] ||
    event.headers["X-TSCA-KEY"];

  const ok =
    (!!REQUIRED_KEY && gotKey === REQUIRED_KEY) ||
    (!!PUBLIC_KEY && gotKey === PUBLIC_KEY);

  if (!ok) {
    return { statusCode: 401, headers: cors, body: "Unauthorized" };
  }

  try {
    const { url } = JSON.parse(event.body || "{}");
    const u = new URL(String(url || ""));
    if (!/^https?:$/.test(u.protocol)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", ...cors },
        body: JSON.stringify({ error: "Only http/https allowed." }),
      };
    }

    // First attempt: browser-like headers
    const resp = await fetch(u.toString(), {
      redirect: "follow",
      headers: BROWSER_HEADERS,
    });

    if (!resp.ok) {
      const status = resp.status;
      const msg =
        status === 403
          ? "Source blocked server requests (likely bot protection)."
          : `Upstream ${status} ${resp.statusText}`;
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", ...cors },
        body: JSON.stringify({ error: msg, status }),
      };
    }

    const ct = String(resp.headers.get("content-type") || "");
    // Only text-ish content; skip binaries
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(ct)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", ...cors },
        body: JSON.stringify({ text: `(non-text content: ${ct})` }),
      };
    }

    const html = await resp.text();
    const text = stripHtml(html).slice(0, 20000); // keep token costs sane
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

