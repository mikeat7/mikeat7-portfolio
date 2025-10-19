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
  /** Optional chat session affinity */
  sessionId?: string;
};

// Read once at module load
const RAW_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_AGENT_API_BASE) ||
  "";

const BASE = (RAW_BASE as string).trim().replace(/\/+$/, "");

// Public value that the browser is allowed to read & send
const TSCA_KEY =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_TSCA_PUBLIC_KEY) || "";

// Resolve endpoints: API Gateway if BASE set; otherwise Netlify Functions
export const ENDPOINTS = BASE
  ? {
      chat: `${BASE}/agent/chat`,
      analyze: `${BASE}/agent/analyze`,
      fetch: `${BASE}/agent/fetch-url`,
      summarize: `${BASE}/agent/summarize`,
    }
  : {
      chat: `/.netlify/functions/agent-chat`,
      analyze: `/.netlify/functions/agent-analyze`,
      fetch: `/.netlify/functions/agent-fetch-url`,
      summarize: `/.netlify/functions/agent-summarize`,
    };

// eslint-disable-next-line no-console
console.log("[TSCA] VITE_AGENT_API_BASE =", BASE || "(missing → using Netlify Functions)");

async function parseJsonOrThrow(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();

  const text = await res.text().catch(() => "");
  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try {
      return JSON.parse(text);
    } catch {
      /* noop */
    }
  }
  throw new Error(
    `Expected JSON but got ${res.status} ${res.statusText}. First 300 chars:\n${text.slice(0, 300)}`
  );
}

async function postJson(url: string, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // ✅ required by secured Netlify functions / API Gateway
      "x-tsca-key": TSCA_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Agent HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return parseJsonOrThrow(res);
}

/** History-aware chat — sends the shape that our Netlify function expects */
export async function agentChat(
  text: string,
  history: ChatMessage[] = [],
  opts?: HandshakeOpts
): Promise<any> {
  // Safe handshake defaults aligned with Codex v0.9
  const handshake = {
    mode: opts?.mode ?? "--careful",
    stakes: opts?.stakes ?? "medium",
    min_confidence: opts?.min_confidence ?? 0.4,
    cite_policy: opts?.cite_policy ?? "auto",
    omission_scan: typeof opts?.omission_scan === "undefined" ? "auto" : opts.omission_scan,
    reflex_profile: opts?.reflex_profile ?? "default",
    codex_version: opts?.codex_version ?? "0.9.0",
  };

  // ✅ send the shape the server expects
  const payload: any = {
    text,
    history,
    mode: handshake.mode,
    stakes: handshake.stakes,
    min_confidence: handshake.min_confidence,
    cite_policy: handshake.cite_policy,
    omission_scan: handshake.omission_scan,
    reflex_profile: handshake.reflex_profile,
    codex_version: handshake.codex_version,
  };

  if (opts?.sessionId) payload.sessionId = opts.sessionId;

  return postJson(ENDPOINTS.chat, payload);
}

/** Analyze (bedrock-enhanced). Prefer using callAgentAnalyze in llmClient for handshake building. */
export async function agentAnalyze(payload: {
  input: { text: string };
  handshake: {
    mode: Mode;
    stakes: Stakes;
    cite_policy: CitePolicy;
    omission_scan: "auto" | boolean;
    reflex_profile: ReflexProfile;
    min_confidence: number;
    codex_version: string;
  };
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
