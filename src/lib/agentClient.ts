// src/lib/agentClient.ts

/**
 * Agent client for calling your Netlify functions under /agent/*
 * - Supports both signatures:
 *     agentChat("text", history?, opts?)
 *     agentChat({ text, history?, ...opts })
 * - Exports ChatMessage type with 'tool' role to support tool traces in UI
 */

export type Role = "user" | "assistant" | "tool";

export type ChatMessage = {
  role: Role;
  text: string;
};

export type Mode = "--direct" | "--careful" | "--recap";
export type Stakes = "low" | "medium" | "high";
export type CitePolicy = "auto" | "force" | "off";

type AgentChatOptions = {
  mode?: Mode;
  stakes?: Stakes;
  min_confidence?: number;
  cite_policy?: CitePolicy;
  omission_scan?: "auto" | boolean;
  reflex_profile?: "default" | "strict" | "lenient";
  codex_version?: string | number;
};

type AgentChatArgs = {
  text: string;
  history?: ChatMessage[];
} & AgentChatOptions;

export type ToolTrace = {
  name: string;
  args?: Record<string, unknown>;
  duration_ms?: number;
  [k: string]: unknown;
};

export type AgentChatResponse = {
  message: string;
  tools?: ToolTrace[];
  [k: string]: unknown;
};

// Resolve base once; default to "/agent"
const AGENT_BASE: string = String(
  (import.meta as any)?.env?.VITE_AGENT_API_BASE ?? "/agent"
).replace(/\/$/, "");

// Generic JSON POST with friendly errors
async function jsonPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${AGENT_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  const txt = await res.text();
  if (!res.ok) {
    // Surface server error bodies to help debugging
    const msg = txt || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  try {
    return JSON.parse(txt) as T;
  } catch {
    // If function returns plain text, coerce to { message }
    return { message: txt } as unknown as T;
  }
}

/**
 * agentChat — OVERLOADED
 * 1) agentChat("text", history?, opts?)
 * 2) agentChat({ text, history?, ...opts })
 */
export async function agentChat(
  text: string,
  history?: ChatMessage[],
  opts?: AgentChatOptions
): Promise<AgentChatResponse>;
export async function agentChat(args: AgentChatArgs): Promise<AgentChatResponse>;
export async function agentChat(
  a: string | AgentChatArgs,
  b?: ChatMessage[],
  c?: AgentChatOptions
): Promise<AgentChatResponse> {
  const args: AgentChatArgs =
    typeof a === "string" ? { text: a, history: b ?? [], ...(c ?? {}) } : a;

  // Shape expected by the Netlify function /agent/chat
  const payload = {
    text: args.text,
    history: args.history ?? [],
    mode: args.mode,
    stakes: args.stakes,
    min_confidence: args.min_confidence,
    cite_policy: args.cite_policy,
    omission_scan: args.omission_scan,
    reflex_profile: args.reflex_profile,
    codex_version: args.codex_version,
  };

  return jsonPost<AgentChatResponse>("/chat", payload);
}

/**
 * Back-compat alias: some older code imported agentChatTurn.
 * Keep it pointing to agentChat so nothing breaks.
 */
export const agentChatTurn = agentChat;

/**
 * Fetch and clean text content from a URL via your function.
 * Returns: { text: string }
 */
export async function agentFetchUrl(url: string): Promise<{ text: string }> {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error("Please provide a valid http(s) URL.");
  }
  return jsonPost<{ text: string }>("/fetch-url", { url });
}
