// src/lib/llmClient.ts
import codexJson from "@/data/front-end-codex.v0.9.json";
import { buildHandshake, type Mode, type Stakes, type Codex } from "@/lib/codex-runtime";
import type { VXFrame } from "@/types/VXTypes";

const codex = codexJson as unknown as Codex; // ✅ satisfy TS; we validate at boot

const BASE =
  (import.meta as any).env?.VITE_AGENT_API_BASE?.replace(/\/$/, "") || "";

export async function callAgentAnalyze(input: {
  text: string;
  mode?: Mode;
  stakes?: Stakes;
}): Promise<VXFrame[]> {
  if (!BASE) throw new Error("VITE_AGENT_API_BASE is not set");

  const handshake = buildHandshake(codex, {
    mode: input.mode ?? "--careful",
    stakes: input.stakes ?? "medium",
  });

  const res = await fetch(`${BASE}/agent/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text: input.text }, handshake }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Agent analyze failed: ${res.status} ${msg}`);
  }

  const data = await res.json();
  return Array.isArray(data?.frames) ? (data.frames as VXFrame[]) : [];
}
