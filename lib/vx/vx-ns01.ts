// VX-NS01 — Narrative Oversimplification Detector
// Enhanced version with detailed analysis

import { VXFrame } from "@/types/VXTypes";

const detectNarrativeOversimplification = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();

  const patterns = [
    { 
      phrase: "it's just a matter of", 
      type: "reductive-framing", 
      severity: "high",
      rationale: "Reduces complex issues to overly simple explanations",
      explanation: "This phrase dismisses complexity and nuance by suggesting that multifaceted problems have simple, obvious solutions. It's often used to avoid addressing the real difficulties and trade-offs involved in complex issues."
    },
    { 
      phrase: "black and white", 
      type: "binary-thinking", 
      severity: "high",
      rationale: "Eliminates nuance by forcing binary categorization",
      explanation: "This metaphor reduces complex situations to simple either/or choices, ignoring the spectrum of possibilities and nuanced positions that usually exist. It's designed to eliminate ambiguity and force clear-cut decisions where they may not be appropriate."
    },
    { 
      phrase: "there's only one solution", 
      type: "solution-monopoly", 
      severity: "high",
      rationale: "Dismisses alternative approaches without consideration",
      explanation: "This phrase shuts down creative problem-solving by asserting that only one approach is viable. It prevents exploration of alternatives and can be used to push predetermined solutions without proper evaluation of other options."
    },
    { 
      phrase: "the real problem is", 
      type: "root-cause-fallacy", 
      severity: "medium",
      rationale: "Oversimplifies multifaceted problems to single causes",
      explanation: "This phrase suggests that complex problems have single root causes, ignoring the reality that most significant issues arise from multiple interacting factors. It can lead to ineffective solutions that address symptoms rather than systemic issues."
    },
    { 
      phrase: "all we need to do is", 
      type: "solution-minimization", 
      severity: "high",
      rationale: "Trivializes implementation challenges and complexity",
      explanation: "This phrase makes complex solutions sound simple and easy to implement, ignoring practical obstacles, resource requirements, and unintended consequences. It's often used to sell unrealistic solutions by downplaying their actual difficulty."
    }
  ];

  patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.85 : severity === "medium" ? 0.7 : 0.55;
      frames.push({
        reflexId: `vx-ns01-${type}-${idx}`,
        reflexLabel: `Narrative Oversimplification Detected`,
        rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This oversimplification may prevent proper understanding of complex issues by reducing them to misleadingly simple terms, potentially leading to ineffective solutions or misguided decisions.`,
        confidence,
        tags: ["oversimplification", type, "reductive-thinking"],
        priority: severity === "high" ? 3 : 2
      });
    }
  });

  return frames;
};

export default detectNarrativeOversimplification;
export { detectNarrativeOversimplification };
export const analyzeNarrativeOversimplification = detectNarrativeOversimplification;