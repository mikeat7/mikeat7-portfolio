// src/lib/analyzeClient.ts
import { callAgentAnalyze } from "@/lib/llmClient";
import { debouncePromise, singleFlight } from "@/lib/rateLimit";
import type { VXFrame } from "@/types/VXTypes";

type Mode = "--direct" | "--careful" | "--recap";
type Stakes = "low" | "medium" | "high";
type CitePolicy = "auto" | "force" | "off";
type ReflexProfile = "default" | "strict" | "lenient";

type AnalyzeArgs = {
  text: string;
  mode?: Mode;
  stakes?: Stakes;
  min_confidence?: number;
  cite_policy?: CitePolicy;
  omission_scan?: "auto" | boolean;
  reflex_profile?: ReflexProfile;
};

// Keep original call untouched
async function rawAnalyze(params: AnalyzeArgs): Promise<VXFrame[]> {
  return callAgentAnalyze({
    text: params.text,
    mode: params.mode,
    stakes: params.stakes,
    min_confidence: params.min_confidence,
    cite_policy: params.cite_policy,
    omission_scan: params.omission_scan,
    reflex_profile: params.reflex_profile,
  });
}

// Coalesce rapid clicks + block parallel in-flight requests
export const analyze = debouncePromise(singleFlight(rawAnalyze), 800);

// Optional: direct call if you explicitly DON'T want the limiter
export const analyzeImmediate = rawAnalyze;
