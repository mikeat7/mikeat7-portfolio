import type { Handler } from "@netlify/functions";
import { isRateLimited } from "./_rateLimit";

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
    "Access-Control-Allow-Origin": "https://clarityarmor.com",
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

  const clientIp = event.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  const { limited, retryAfterMs } = isRateLimited(clientIp, 20, 60_000);
  if (limited) {
    return {
      statusCode: 429,
      headers: { ...cors, "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      body: JSON.stringify({ error: "Too many requests. Try again shortly." }),
    };
  }

  // Convert GitHub blob URLs to raw URLs
  function normalizeGitHubUrl(inputUrl: string): string {
    const match = inputUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
    if (match) {
      const [, user, repo, rest] = match;
      return `https://raw.githubusercontent.com/${user}/${repo}/${rest}`;
    }
    return inputUrl;
  }

  try {
    const { url } = JSON.parse(event.body || "{}");
    // Normalize GitHub URLs to raw format
    const normalizedUrl = normalizeGitHubUrl(String(url || "").trim());
    const u = new URL(normalizedUrl);
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
    if (!/text\/|application\/json|application\/xml|application\/xhtml\+xml/i.test(ct)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", ...cors },
        body: JSON.stringify({ text: `(non-text content: ${ct})` }),
      };
    }

    const rawText = await resp.text();

    // Only strip HTML if content-type indicates HTML
    const isHtml = /text\/html|application\/xhtml\+xml/i.test(ct);
    const text = isHtml ? stripHtml(rawText).slice(0, 20000) : rawText.slice(0, 20000);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ text, contentType: ct, normalized: normalizedUrl !== String(url || "").trim() }),
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({ error: e?.message || "fetch-url error" }),
    };
  }
};

