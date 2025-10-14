// src/lib/analyzeClient.ts
import { callAgentAnalyze } from "@/lib/llmClient";
import { debouncePromise, singleFlight } from "@/lib/rateLimit";
import type { VXFrame } from "@/types/VXTypes";

// Mirror the original call’s input shape
type AnalyzeArgs = { text: string } & Partial<{
  mode: "--direct" | "--careful" | "--recap";
  stakes: "low" | "medium" | "high";
  min_confidence: number;
  cite_policy: "auto" | "force" | "off";
  omission_scan: "auto" | boolean;
  reflex_profile: "default" | "strict" | "lenient";
}>;

// The real call (unchanged)
async function rawAnalyze(params: AnalyzeArgs): Promise<VXFrame[]> {
  return callAgentAnalyze(params);
}

// Prevent parallel calls + coalesce rapid clicks (800ms)
export const analyze = debouncePromise(
  singleFlight(rawAnalyze),
  800
);

// Optional: a direct (unlimited) export for rare places where you truly need it
export const analyzeImmediate = rawAnalyze;
