// src/lib/agentClient.ts
type Role = "user" | "assistant";

export type ChatMessage = {
  role: Role;
  text: string;
};

export type Mode = "--direct" | "--careful" | "--recap";
export type Stakes = "low" | "medium" | "high";
export type CitePolicy = "auto" | "force" | "off";
export type OmissionScan = "auto" | boolean;
export type ReflexProfile = "default" | "strict" | "lenient";

export type ChatOptions = {
  mode?: Mode;
  stakes?: Stakes;
  cite_policy?: CitePolicy;
  omission_scan?: OmissionScan;
  reflex_profile?: ReflexProfile;
  history?: ChatMessage[];
};

// Choose the API base: Netlify Functions path by default
const RAW_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AGENT_API_BASE) ||
  (typeof process !== "undefined" && (process as any).env?.VITE_AGENT_API_BASE) ||
  "/.netlify/functions";

const API_BASE = String(RAW_BASE).replace(/\/+$/, "");

async function fetchJSON(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);
  const text = await res.text();
  if (!res.ok) {
    // surface server error text to caller
    throw new Error(text || `HTTP ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Non-JSON response from server");
  }
}

/** Chat with the Clarity Armor function */
export async function agentChat(
  text: string,
  opts: ChatOptions = {}
): Promise<{ message: string; tools?: any[] }> {
  const body = {
    text,
    // pass-through optional handshake + history
    ...(opts.history ? { history: opts.history } : {}),
    ...(opts.mode ? { mode: opts.mode } : {}),
    ...(opts.stakes ? { stakes: opts.stakes } : {}),
    ...(opts.cite_policy ? { cite_policy: opts.cite_policy } : {}),
    ...(typeof opts.omission_scan !== "undefined" ? { omission_scan: opts.omission_scan } : {}),
    ...(opts.reflex_profile ? { reflex_profile: opts.reflex_profile } : {}),
  };

  return fetchJSON(`${API_BASE}/agent-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Fetch a URL and return plain text (server strips HTML) */
export async function agentFetchUrl(url: string): Promise<{ text: string }> {
  return fetchJSON(`${API_BASE}/agent-fetch-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

/** Summarize/assess frames + input text with the same model */
export async function agentSummarize(
  inputText: string,
  frames: any[] = [],
  handshakeOverrides: Partial<ChatOptions> = {}
): Promise<{ reportText: string }> {
  return fetchJSON(`${API_BASE}/agent-summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputText, frames, handshakeOverrides }),
  });
}

export default { agentChat, agentFetchUrl, agentSummarize };
