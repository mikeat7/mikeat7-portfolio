// src/lib/reflex-core.ts

import { analyzeSpeculation } from "@/lib/vx/vx-so01";
import { analyzeEmotion } from "@/lib/vx/vx-em08";
import { analyzeOmission } from "@/lib/vx/vx-os01";
import { analyzeHallucination } from "@/lib/vx/vx-ha01";
import { analyzeFalsePrecision } from "@/lib/vx/vx-fp01";
import { analyzeDataLessClaim } from "@/lib/vx/vx-da01";
import { analyzeConsensusOverreach } from "@/lib/vx/vx-co01";
import { analyzeEthicalDrift } from "@/lib/vx/vx-ed01";
import { analyzeToneUrgency } from "@/lib/vx/vx-tu01";
import { analyzeJargonOverload } from "@/lib/vx/vx-ju01";
import { analyzeRepetition } from "@/lib/vx/vx-ri01";
import type { VXFrame } from "@/types/VXTypes";

// ⚙️ Runtime detection across all available vx-* reflexes (standardized to VXFrame)
export function detectAllReflexes(input: string): VXFrame[] {
  const frames: VXFrame[] = [];

  frames.push(...analyzeSpeculation(input));
  frames.push(...analyzeEmotion(input));
  frames.push(...analyzeOmission(input));
  frames.push(...analyzeHallucination(input));
  frames.push(...analyzeFalsePrecision(input));
  frames.push(...analyzeDataLessClaim(input));
  frames.push(...analyzeConsensusOverreach(input));
  frames.push(...analyzeEthicalDrift(input));
  frames.push(...analyzeToneUrgency(input));
  frames.push(...analyzeJargonOverload(input));
  frames.push(...analyzeRepetition(input));

  return frames;
}
