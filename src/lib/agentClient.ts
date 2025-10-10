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

// Normalize base from Vite env once at module load
const RAW_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_AGENT_API_BASE) ||
  "";

const BASE = (RAW_BASE as string).trim().replace(/\/+$/, "");

// If BASE is set → use AWS API Gateway paths.
// If BASE is empty → use Netlify Functions paths.
export const ENDPOINTS = BASE
  ? {
      chat:    `${BASE}/agent/chat`,
      analyze: `${BASE}/agent/analyze`,
      fetch:   `${BASE}/agent/fetch-url`,
      summarize: `${BASE}/agent/summarize`,
    }
  : {
      chat:    `/.netlify/functions/agent-chat`,
      analyze: `/.netlify/functions/agent-analyze`,
      fetch:   `/.netlify/functions/agent-fetch-url`,
      summarize: `/.netlify/functions/agent-summarize`,
    };

// Helpful console breadcrumb during debugging
// eslint-disable-next-line no-console
console.log("[TSCA] VITE_AGENT_API_BASE =", BASE || "(missing → using Netlify Functions)");

async function parseJsonOrThrow(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();

  const text = await res.text().catch(() => "");
  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try { return JSON.parse(text); } catch { /* noop */ }
  }
  throw new Error(
    `Expected JSON but got ${res.status} ${res.statusText}. First 300 chars:\n${text.slice(0, 300)}`
  );
}

async function postJson(url: string, body: any): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Agent HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return parseJsonOrThrow(res);
}

/** History-aware chat. */
export async function agentChat(
  text: string,
  history: ChatMessage[] = [],
  opts?: HandshakeOpts
): Promise<any> {
  const payload = { text, history, ...(opts || {}) };
  return postJson(ENDPOINTS.chat, payload);
}

/** Analyze (bedrock-enhanced). Prefer using callAgentAnalyze in llmClient for handshake building. */
export async function agentAnalyze(payload: {
  input: { text: string };
  handshake: Required<HandshakeOpts> & { mode: Mode; stakes: Stakes; cite_policy: CitePolicy; reflex_profile: ReflexProfile };
}): Promise<any> {
  return postJson(ENDPOINTS.analyze, payload);
}

/** Simple fetch-url helper. */
export async function agentFetchUrl(url: string): Promise<{ text: string }> {
  return postJson(ENDPOINTS.fetch, { url });
}

/** Summarize frames + input into a report. */
export async function callAgentSummarize(payload: {
  inputText: string;
  frames: any[];
  handshakeOverrides?: HandshakeOpts;
}): Promise<{ reportText: string }> {
  return postJson(ENDPOINTS.summarize, payload);
}
