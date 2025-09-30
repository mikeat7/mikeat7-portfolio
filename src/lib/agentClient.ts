// src/lib/agentClient.ts
export type Mode = "--direct" | "--careful" | "--recap";
export type Stakes = "low" | "medium" | "high";
export type CitePolicy = "auto" | "force" | "off";
export type HandshakeOverrides = {
  mode: Mode;
  stakes: Stakes;
  min_confidence?: number;
  cite_policy: CitePolicy;
  omission_scan: "auto" | boolean;
  reflex_profile: "default" | "strict" | "lenient";
  codex_version?: string;
};

export type ChatMessage = { role: "user" | "assistant" | "tool"; text: string };

function base() {
  const b = (import.meta as any).env?.VITE_AGENT_API_BASE;
  if (!b) throw new Error("VITE_AGENT_API_BASE is not set");
  return String(b).replace(/\/+$/, "");
}

export async function agentFetchUrl(url: string) {
  const res = await fetch(`${base()}/agent/fetch-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(`/agent/fetch-url ${res.status}`);
  return res.json();
}

/** Simple one-off chat (no history). */
export async function agentChat(
  text: string,
  overrides: Partial<HandshakeOverrides> = {}
) {
  const body = {
    input: { text },
    handshake: {
      mode: overrides.mode ?? "--careful",
      stakes: overrides.stakes ?? "medium",
      min_confidence: overrides.min_confidence ?? 0.7,
      cite_policy: overrides.cite_policy ?? "auto",
      omission_scan: overrides.omission_scan ?? "auto",
      reflex_profile: overrides.reflex_profile ?? "default",
      codex_version: overrides.codex_version ?? "0.9.0",
    },
  };
  const res = await fetch(`${base()}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`/agent/chat ${res.status}`);
  return res.json();
}

/** Multi-turn chat: send prior messages for context; returns tools array. */
export async function agentChatTurn(
  history: ChatMessage[],
  text: string,
  overrides: Partial<HandshakeOverrides> = {}
) {
  const body = {
    input: { text },
    handshake: {
      mode: overrides.mode ?? "--careful",
      stakes: overrides.stakes ?? "medium",
      min_confidence: overrides.min_confidence ?? 0.7,
      cite_policy: overrides.cite_policy ?? "auto",
      omission_scan: overrides.omission_scan ?? "auto",
      reflex_profile: overrides.reflex_profile ?? "default",
      codex_version: overrides.codex_version ?? "0.9.0",
    },
    history,
  };
  const res = await fetch(`${base()}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`/agent/chat ${res.status}`);
  return res.json();
}
