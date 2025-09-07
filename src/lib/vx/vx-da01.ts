// VX-DA01 — Data-Less Claim Detector
// Enhanced version with detailed analysis

import { VXFrame } from "@/types/VXTypes";

const detectDataLessClaims = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();

  const patterns = [
    { 
      phrase: "scientists claim", 
      type: "vague-attribution", 
      severity: "high",
      rationale: "Uses scientific authority without naming specific studies or researchers",
      explanation: "This phrase invokes scientific credibility without providing verifiable sources. 'Scientists claim' could refer to any number of researchers with varying levels of expertise and credibility, making verification impossible."
    },
    { 
      phrase: "cdc reports", 
      type: "authority-without-context", 
      severity: "medium",
      rationale: "Uses institutional authority without providing context for data quality",
      explanation: "While CDC is a legitimate authority, the statement doesn't acknowledge the limitations in their data collection methods that are mentioned elsewhere in the text."
    },
    { 
      phrase: "is caused by", 
      type: "causal-claim-without-evidence", 
      severity: "high",
      rationale: "Makes definitive causal claims without providing supporting evidence or sources",
      explanation: "This phrase asserts direct causation as fact without citing studies, data, or evidence. Causal claims require substantial proof, and presenting them as simple facts bypasses the need for verification."
    },
    { 
      phrase: "are caused by", 
      type: "causal-claim-without-evidence", 
      severity: "high",
      rationale: "Makes definitive causal claims without providing supporting evidence or sources",
      explanation: "This phrase asserts direct causation as fact without citing studies, data, or evidence. Causal claims require substantial proof, and presenting them as simple facts bypasses the need for verification."
    },
    { 
      phrase: "trends are estimates", 
      type: "buried-uncertainty", 
      severity: "high",
      rationale: "Uses scientific authority without naming specific studies or researchers",
      explanation: "This phrase invokes scientific credibility without providing verifiable sources. 'Scientists claim' could refer to any number of researchers with varying levels of expertise and credibility, making verification impossible."
    },
    { 
      phrase: "it's widely accepted", 
      type: "vague-consensus", 
      severity: "high",
      rationale: "Claims broad acceptance without providing evidence or sources",
      explanation: "This phrase suggests widespread agreement without citing any actual studies, polls, or evidence of such consensus. It's an appeal to imaginary authority that bypasses the need for real data or verification."
    },
    { 
      phrase: "nobody disputes", 
      type: "false-unanimity", 
      severity: "high",
      rationale: "Asserts complete agreement while ignoring existing disagreement",
      explanation: "This claim of universal consensus is almost always false and is used to shut down legitimate debate. It ignores dissenting voices and presents contested issues as settled matters."
    },
    { 
      phrase: "clearly", 
      type: "self-evident-claim", 
      severity: "medium",
      rationale: "Presents subjective opinions as obviously true without support",
      explanation: "This word suggests that something is so obvious it needs no explanation or evidence. It's often used to mask weak arguments by implying that disagreement indicates stupidity or ignorance."
    },
    { 
      phrase: "obviously", 
      type: "self-evident-claim", 
      severity: "medium",
      rationale: "Implies claims are self-evident when they may require justification",
      explanation: "Similar to 'clearly,' this term attempts to make contested or complex issues appear simple and unquestionable, avoiding the need to provide actual reasoning or evidence."
    },
    { 
      phrase: "everyone knows", 
      type: "universal-knowledge", 
      severity: "high",
      rationale: "Claims universal awareness without any supporting evidence",
      explanation: "This phrase asserts that information is common knowledge when it may be disputed, unknown, or false. It's a form of social pressure that makes disagreement seem ignorant or contrarian."
    }
  ];

  patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.85 : severity === "medium" ? 0.7 : 0.55;
      frames.push({
        reflexId: `vx-da01-${type}-${idx}`,
        reflexLabel: `Data-Less Claim Detected`,
        rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This unsupported claim may mislead audiences by presenting opinions or contested information as established facts, bypassing the need for evidence, sources, or logical reasoning.`,
        confidence,
        tags: ["data-less", type, "unsupported"],
        priority: severity === "high" ? 3 : 2
      });
    }
  });

  return frames;
};

export default detectDataLessClaims;
export { detectDataLessClaims };
export const analyzeDataLessClaim = detectDataLessClaims;