export type Mode = "--direct" | "--careful" | "--recap";
export type Stakes = "low" | "medium" | "high";
export type CitePolicy = "auto" | "force" | "off";

export interface Handshake {
  mode: Mode;
  stakes: Stakes;
  min_confidence: number;
  cite_policy: CitePolicy;
  omission_scan: "auto" | boolean;
  reflex_profile: "default" | "strict" | "lenient";
  codex_version: string;
}

export interface ChatRequestBody {
  input: { text?: string; query?: string };
  handshake: Handshake;
}

export interface ChatResponse {
  ok: boolean;
  message: string;
  frames: Array<{
    reflexId: string;
    confidence: number;
    rationale: string;
    tags?: string[];
  }>;
  tools?: Array<{ name: string; args: unknown; duration_ms?: number }>;
  handshake?: Handshake;
}
