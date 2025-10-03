// src/lib/agentClient.ts
export type Role = "system" | "user" | "assistant" | "tool";
export interface ChatMessage { role: Role; text: string }

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

async function postJsonWithFallback<T>(prettyUrl: string, rawUrl: string, body: any): Promise<T> {
  const headers = { "Content-Type": "application/json" };

  // 1) Try pretty route
  let res = await fetch(prettyUrl, { method: "POST", headers, body: JSON.stringify(body) });
  // If Netlify didn’t rewrite it, you’ll get a 404 HTML page here
  if (!res.ok) {
    // 2) Try raw function path
    res = await fetch(rawUrl, { method: "POST", headers, body: JSON.stringify(body) });
  }
  // Throw if still bad
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Agent HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

export async function agentChat(
  text: string,
  history: ChatMessage[] = [],
  opts?: {
    mode?: string; stakes?: "low" | "medium" | "high";
    cite_policy?: "auto" | "force" | "off";
    omission_scan?: "auto" | boolean;
    reflex_profile?: "default" | "strict" | "lenient";
    min_confidence?: number; codex_version?: string;
  }
) {
  const body = { text, history, ...(opts ?? {}) };
  return postJsonWithFallback(PRETTY.chat, RAW.chat, body);
}

export async function agentFetchUrl(url: string) {
  return postJsonWithFallback(PRETTY.fetch, RAW.fetch, { url });
}

export async function callAgentSummarize(payload: any) {
  return postJsonWithFallback(PRETTY.summarize, RAW.summarize, payload);
}
