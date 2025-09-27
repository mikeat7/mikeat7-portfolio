// src/lib/llmClient.ts
import codexJson from "@/data/front-end-codex.v0.9.json";
import { buildHandshake } from "@/lib/codex-runtime";
const codex = codexJson; // ✅ satisfy TS; we validate at boot
const BASE = import.meta.env?.VITE_AGENT_API_BASE?.replace(/\/$/, "") || "";
export async function callAgentAnalyze(input) {
    if (!BASE)
        throw new Error("VITE_AGENT_API_BASE is not set");
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
    return Array.isArray(data?.frames) ? data.frames : [];
}
