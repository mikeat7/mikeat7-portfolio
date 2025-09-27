// src/lib/llmClient.ts
import codex from "@/data/front-end-codex.v0.9.json";
import {
  buildHandshake,
  type Mode,
  type Stakes,
  type CitePolicy,
} from "@/lib/codex-runtime";
import type { VXFrame } from "@/types/VXTypes";

const BASE =
  (import.meta as any).env?.VITE_AGENT_API_BASE?.replace(/\/$/, "") || "";

export async function callAgentAnalyze(input: {
  text: string;
  mode?: Mode;
  stakes?: Stakes;
  min_confidence?: number;
  cite_policy?: CitePolicy;
  omission_scan?: "auto" | boolean;
  reflex_profile?: "default" | "strict" | "lenient";
}): Promise<VXFrame[]> {
  if (!BASE) {
    throw new Error("VITE_AGENT_API_BASE is not set");
  }

  // Build handshake with any provided overrides (Codex enforces floors/defaults)
  const handshake = buildHandshake(codex as any, {
    mode: input.mode,
    stakes: input.stakes,
    min_confidence: input.min_confidence,
    cite_policy: input.cite_policy,
    omission_scan: input.omission_scan,
    reflex_profile: input.reflex_profile,
  });

  const res = await fetch(`${BASE}/agent/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: input.text },
      handshake,
    }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Agent analyze failed: ${res.status} ${msg}`);
  }

  const data = await res.json();
  return Array.isArray(data?.frames) ? (data.frames as VXFrame[]) : [];
}

