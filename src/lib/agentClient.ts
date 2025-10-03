// src/lib/agentClient.ts

export type Role = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  role: Role;
  text: string;
}

type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";
type ReflexProfile = "default" | "strict" | "lenient";
type Mode = "--direct" | "--careful" | "--recap";

type HandshakeOpts = {
  mode?: Mode;
  stakes?: Stakes;
  cite_policy?: CitePolicy;
  omission_scan?: "auto" | boolean;
  reflex_profile?: ReflexProfile;
  min_confidence?: number;
  codex_version?: string;
};

const BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_AGENT_API_BASE) ||
  "";

function join(base: string, path: string): string {
  if (!base) return path;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

const PRETTY = {
  chat: "/agent/chat",
  fetch: "/agent/fetch-url",
  summarize: "/agent/summarize",
};

const RAW = {
  chat: "/.netlify/functions/agent-chat",
  fetch: "/.netlify/functions/agent-fetch-url",
  summarize: "/.netlify/functions/agent-summarize",
};

async function parseJsonOrThrow(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  // Try to read text for diagnostics
  const text = await res.text().catch(() => "");
  // If it *looks* like JSON, try to parse
  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try {
      return JSON.parse(text);
    } catch {
      /* ignore */
    }
  }
  throw new Error(
    `Expected JSON but got ${res.status} ${res.statusText}. First 300 chars:\n` +
      text.slice(0, 300)
  );
}

async function postJson(prettyPath: string, rawPath: string, body: any): Promise<any> {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };

  // 1) Pretty route (works when redirects are correct)
  let res = await fetch(join(BASE, prettyPath), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // If pretty route failed (404 to HTML, draft deploy quirks, etc), try RAW
  if (!res.ok) {
    res = await fetch(join(BASE, rawPath), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Agent HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  return parseJsonOrThrow(res);
}

/** History-aware chat.
 * Usage:
 *   const out = await agentChat("hello", [], { mode: "--careful", stakes: "medium" });
 */
export async function agentChat(
  text: string,
  history: ChatMessage[] = [],
  opts?: HandshakeOpts
): Promise<any> {
  const payload = { text, history, ...(opts || {}) };
  return postJson(PRETTY.chat, RAW.chat, payload);
}

/** Simple fetch-url helper. */
export async function agentFetchUrl(url: string): Promise<{ text: string }> {
  return postJson(PRETTY.fetch, RAW.fetch, { url });
}

/** Summarize frames + input into a report (your /agent/summarize function). */
export async function callAgentSummarize(payload: {
  inputText: string;
  frames: any[];
  handshakeOverrides?: HandshakeOpts;
}): Promise<{ reportText: string }> {
  return postJson(PRETTY.summarize, RAW.summarize, payload);
}
