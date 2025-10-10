// src/lib/llmClient.ts
import codex from "@/data/front-end-codex.v0.9.json";
import { buildHandshake, type Mode, type Stakes, type CitePolicy } from "@/lib/codex-runtime";
import type { VXFrame } from "@/types/VXTypes";

const BASE =
  (import.meta as any).env?.VITE_AGENT_API_BASE?.replace(/\/$/, "") || "";

type ReflexProfile = "default" | "strict" | "lenient";
type OmissionScan = "auto" | boolean;

type HandshakeOverrides = Partial<{
  mode: Mode;
  stakes: Stakes;
  min_confidence: number;
  cite_policy: CitePolicy;
  omission_scan: OmissionScan;
  reflex_profile: ReflexProfile;
}>;

function makeHandshake(overrides: HandshakeOverrides = {}) {
  return buildHandshake(codex as any, overrides);
}

export async function callAgentAnalyze(
  params: { text: string } & HandshakeOverrides
): Promise<VXFrame[]> {
  if (!BASE) throw new Error("VITE_AGENT_API_BASE is not set");

  const handshake = makeHandshake({
    mode: params.mode,
    stakes: params.stakes,
    min_confidence: params.min_confidence,
    cite_policy: params.cite_policy,
    omission_scan: params.omission_scan,
    reflex_profile: params.reflex_profile,
  });

  const res = await fetch(`${BASE}/agent/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text: params.text }, handshake }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Agent analyze failed: ${res.status} ${msg}`);
  }

  const data = await res.json();
  return Array.isArray(data?.frames) ? (data.frames as VXFrame[]) : [];
}

export async function callAgentSummarize(args: {
  inputText: string;
  frames: VXFrame[];
  handshakeOverrides?: HandshakeOverrides;
}): Promise<{ reportText: string }> {
  if (!BASE) throw new Error("VITE_AGENT_API_BASE is not set");

  const handshake = makeHandshake(args.handshakeOverrides ?? {});
  const res = await fetch(`${BASE}/agent/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputText: args.inputText,
      frames: args.frames,
      handshake,
    }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Agent summarize failed: ${res.status} ${msg}`);
  }

  const data = await res.json();
  return { reportText: String(data?.reportText ?? "") };
}

export async function callAgentChat(args: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  handshakeOverrides?: HandshakeOverrides;
  sessionId?: string;
}): Promise<{ reply: string; sessionId?: string }> {
  if (!BASE) throw new Error("VITE_AGENT_API_BASE is not set");

  const handshake = makeHandshake(args.handshakeOverrides ?? {});
  const res = await fetch(`${BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: args.messages,
      handshake,
      sessionId: args.sessionId
    }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Agent chat failed: ${res.status} ${msg}`);
  }

  const data = await res.json();
  return {
    reply: String(data?.reply ?? data?.message ?? ""),
    sessionId: data?.sessionId
  };
}
