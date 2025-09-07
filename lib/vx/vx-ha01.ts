// VX-HA01 — Hallucination Detector
// Normalized to VXFrame[] format

import { VXFrame } from "@/types/VXTypes";

const detectHallucination = (text: string): VXFrame[] => {
  const lower = text.toLowerCase();
  const frames: VXFrame[] = [];

  // Enhanced pattern detection for obviously false claims
  const falseClaimPatterns = [
    /the world is flat/i,
    /the earth is flat/i,
    /the moon is made of cheese/i,
    /vaccines cause autism/i,
    /climate change is a hoax/i,
    /earth is only \d+ years old/i,
    /flat until.*prove otherwise/i
  ];

  falseClaimPatterns.forEach((pattern, index) => {
    if (pattern.test(text)) {
      frames.push({
        reflexId: `vx-ha01-false-claim-${index}`,
        reflexLabel: "Factually Implausible Claim",
        rationale: `🎯 Pattern: Detected scientifically disproven claim
        
📋 Analysis: This statement contradicts established scientific consensus and verifiable evidence. Such claims often spread through misinformation networks and can undermine trust in legitimate scientific institutions.
        
⚠️ Impact: Promoting factually incorrect information can mislead audiences and contribute to the erosion of evidence-based decision making.`,
        confidence: 0.95,
        tags: ["hallucination", "misinformation", "false-claim"],
        priority: 4
      });
    }
  });

  // Burden of proof reversal detection
  if (/until.*prove otherwise|prove me wrong|burden of proof/i.test(lower)) {
    frames.push({
      reflexId: "vx-ha01-burden-shift",
      reflexLabel: "Burden of Proof Reversal",
      rationale: `🎯 Pattern: Shifts burden of proof to others rather than supporting own claims
      
📋 Analysis: This rhetorical technique attempts to make extraordinary claims appear valid by demanding others disprove them, rather than providing evidence. This reverses the normal burden of proof and is a common fallacy.
      
⚠️ Impact: This technique can make unsupported claims appear legitimate by shifting responsibility for evidence away from the claimant.`,
      confidence: 0.85,
      tags: ["burden-shift", "logical-fallacy"],
      priority: 3
    });
  }

  if (/everyone knows that.*(aliens|telepathy)/i.test(lower)) {
    frames.push({
      reflexId: "vx-ha01-consensus-speculative",
      reflexLabel: "Consensus fallacy on speculative claim",
      rationale: "Claims universal agreement on unverifiable topics.",
      confidence: 0.75,
      tags: ["hallucination", "consensus"],
      priority: 2,
    });
  }

  if (/according to unnamed sources/.test(lower)) {
    frames.push({
      reflexId: "vx-ha01-unnamed-sources",
      reflexLabel: "Unverifiable source",
      rationale: 'Phrase "according to unnamed sources" lacks verifiability.',
      confidence: 0.65,
      tags: ["hallucination", "source"],
      priority: 1,
    });
  }

  return frames;
};

// ✅ Export both default and named for compatibility
export default detectHallucination;
export { detectHallucination };
export const analyzeHallucination = detectHallucination;
