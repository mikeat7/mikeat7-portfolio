import { buildHandshake } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";

const BASE = import.meta.env.VITE_AGENT_API_BASE;

export async function agentChat(text: string, opts?: Partial<Parameters<typeof buildHandshake>[1]>) {
  if (!BASE) throw new Error("VITE_AGENT_API_BASE is not set");
  const handshake = buildHandshake(codex, { mode: "--careful", stakes: "medium", ...(opts || {}) });

  const res = await fetch(`${BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text }, handshake })
  });

  if (!res.ok) throw new Error(`Agent error ${res.status}`);
  return res.json();
}

export async function agentFetchUrl(url: string) {
  if (!BASE) throw new Error("VITE_AGENT_API_BASE is not set");
  const res = await fetch(`${BASE}/agent/fetch-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error(`fetch-url error ${res.status}`);
  return res.json();
}
