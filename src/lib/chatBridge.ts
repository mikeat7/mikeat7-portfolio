// src/lib/chatBridge.ts  (new helper)
import { agentChat, type ChatMessage } from "@/lib/agentClient";

const SYSTEM_PROMPT = `
You are the Truth Serum + Clarity Armor (TS+CA) assistant.
- Be concise, truthful, and transparent.
- Acknowledge that user text may be analyzed by the VX Reflex engine under Codex v0.9 (patterns like vx-ai01, vx-em08).
- You cannot literally “sense” the engine; if asked, explain you rely on inputs and any visible frames shared by the UI.
- If asked for evidence, request sources; avoid false precision.
- Use plain, helpful language.
`;

export async function sendChatWithTSCA(
  userText: string,
  history: ChatMessage[] = [],
  opts?: { vxSummary?: string; sessionId?: string }
) {
  const seeded: ChatMessage[] = [{ role: "system", text: SYSTEM_PROMPT }, ...history];

  const text = opts?.vxSummary
    ? `${userText}\n\n[context: VX summary → ${opts.vxSummary}]`
    : userText;

  return agentChat(text, seeded, {
    mode: "--careful",
    stakes: "medium",
    min_confidence: 0.4,
    cite_policy: "auto",
    omission_scan: "auto",
    reflex_profile: "default",
    codex_version: "0.9.0",
    sessionId: opts?.sessionId,
  });
}
