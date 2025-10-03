const BASE = (import.meta as any).env?.VITE_AGENT_API_BASE || "/agent";

export type Mode = "--direct" | "--careful" | "--recap";
export type Stakes = "low" | "medium" | "high";
export type CitePolicy = "auto" | "force" | "off";

type Handshake = {
  mode?: Mode;
  stakes?: Stakes;
  cite_policy?: CitePolicy;
  omission_scan?: "auto" | boolean;
  reflex_profile?: "default" | "strict" | "lenient";
};

export async function agentChat(
  text: string,
  overrides: Handshake = {}
) {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, ...overrides }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { message, tools }
}

export async function agentFetchUrl(url: string) {
  const res = await fetch(`${BASE}/fetch-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { text }
}

export async function agentSummarize(
  inputText: string,
  frames: any[] = [],
  handshakeOverrides: Handshake = {}
) {
  const res = await fetch(`${BASE}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputText, frames, handshakeOverrides }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { reportText }
}
