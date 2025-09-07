// VX-VG01 — Vagueness Detector
// Enhanced version with detailed analysis

import { VXFrame } from "@/types/VXTypes";

const detectVagueness = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();

  const patterns = [
    { 
      phrase: "some people say", 
      type: "anonymous-authority", 
      severity: "high",
      rationale: "Uses vague attribution to avoid accountability for claims",
      explanation: "This phrase presents opinions or claims without identifying sources, making verification impossible. It allows speakers to present controversial or unsupported ideas while avoiding responsibility by attributing them to unnamed others."
    },
    { 
      phrase: "it's complicated", 
      type: "complexity-avoidance", 
      severity: "medium",
      rationale: "Uses complexity as excuse to avoid clear explanation",
      explanation: "While some issues are genuinely complex, this phrase is often used to avoid providing clear explanations or to make simple concepts seem more sophisticated than they are. It can be a way to deflect questions or hide weak reasoning."
    },
    { 
      phrase: "hard to explain", 
      type: "explanation-avoidance", 
      severity: "medium",
      rationale: "Avoids providing clear explanations by claiming difficulty",
      explanation: "This phrase suggests that concepts are too complex for explanation, often when clearer communication is possible. It can be used to avoid scrutiny or to make speakers appear to have deeper knowledge than they actually possess."
    },
    { 
      phrase: "always", 
      type: "absolute-generalization", 
      severity: "medium",
      rationale: "Uses absolute terms that ignore exceptions and nuance",
      explanation: "This absolute term eliminates exceptions and edge cases, creating oversimplified rules that rarely reflect reality. It's often used to make arguments sound stronger by ignoring counterexamples or special circumstances."
    },
    { 
      phrase: "never", 
      type: "absolute-generalization", 
      severity: "medium",
      rationale: "Uses absolute negation that ignores potential exceptions",
      explanation: "Like 'always,' this absolute term creates oversimplified rules by eliminating all exceptions. It's often used to make categorical statements that sound authoritative but ignore the complexity of real-world situations."
    }
  ];

  patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.8 : severity === "medium" ? 0.65 : 0.5;
      frames.push({
        reflexId: `vx-vg01-${type}-${idx}`,
        reflexLabel: `Vagueness Detected`,
        rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This vague language may obscure meaning or avoid accountability, potentially preventing clear communication and making it difficult to evaluate the validity of claims or arguments.`,
        confidence,
        tags: ["vagueness", type, "unclear-communication"],
        priority: severity === "high" ? 3 : 2
      });
    }
  });

  return frames;
};

export default detectVagueness;
export { detectVagueness };
export const analyzeVagueness = detectVagueness;