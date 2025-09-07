// VX-EM09 — Rhetorical Entrapment Detector
// Enhanced version with detailed analysis

import { VXFrame } from "@/types/VXTypes";

const detectRhetoricalEntrapment = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();

  const patterns = [
    { 
      phrase: "you're either with us or against us", 
      type: "false-binary", 
      severity: "high",
      rationale: "Forces artificial binary choice to eliminate nuanced positions",
      explanation: "This classic false dilemma eliminates middle ground and forces people into opposing camps. It's designed to prevent nuanced discussion and make neutrality or alternative positions seem like betrayal or cowardice."
    },
    { 
      phrase: "why are you afraid to answer", 
      type: "intimidation-question", 
      severity: "high",
      rationale: "Uses fear-based questioning to pressure responses",
      explanation: "This loaded question assumes fear as the only reason for hesitation, making thoughtful consideration appear cowardly. It's designed to pressure quick responses rather than allow careful deliberation."
    },
    { 
      phrase: "what do you have to hide", 
      type: "guilt-presumption", 
      severity: "high",
      rationale: "Assumes guilt or deception to force disclosure",
      explanation: "This question presumes wrongdoing and uses guilt to compel responses. It reverses the burden of proof and makes privacy or discretion appear suspicious, even when perfectly legitimate."
    },
    { 
      phrase: "just admit it", 
      type: "confession-pressure", 
      severity: "high",
      rationale: "Pressures concession without allowing proper consideration",
      explanation: "This phrase assumes guilt or error and pressures immediate confession. It bypasses rational discussion by making continued disagreement seem stubborn or dishonest rather than potentially legitimate."
    },
    { 
      phrase: "so you agree then", 
      type: "false-conclusion", 
      severity: "medium",
      rationale: "Misrepresents silence or hesitation as agreement",
      explanation: "This technique interprets any pause, qualification, or nuanced response as full agreement. It's designed to trap people into positions they haven't actually endorsed through misinterpretation of their responses."
    }
  ];

  patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
      frames.push({
        reflexId: `vx-em09-${type}-${idx}`,
        reflexLabel: `Rhetorical Entrapment Detected`,
        rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This rhetorical trap may be designed to corner respondents into positions they haven't chosen, bypassing genuine dialogue and forcing artificial commitments through psychological pressure rather than persuasion.`,
        confidence,
        tags: ["rhetorical-entrapment", type, "manipulation"],
        priority: severity === "high" ? 3 : 2
      });
    }
  });

  return frames;
};

export default detectRhetoricalEntrapment;
export { detectRhetoricalEntrapment };
export const analyzeEntrapment = detectRhetoricalEntrapment;