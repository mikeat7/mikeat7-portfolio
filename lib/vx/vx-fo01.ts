// VX-FO01 — False Urgency Detector
// Enhanced version with detailed analysis

import { VXFrame } from "@/types/VXTypes";

const detectFalseUrgency = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();

  const patterns = [
    { 
      phrase: "act now", 
      type: "immediate-action", 
      severity: "high",
      rationale: "Creates artificial urgency to bypass deliberation and critical thinking",
      explanation: "This phrase manufactures time pressure to prevent careful consideration of decisions. It's designed to trigger impulsive responses rather than allow rational evaluation of options, risks, and alternatives."
    },
    { 
      phrase: "last chance", 
      type: "scarcity-pressure", 
      severity: "high",
      rationale: "Uses false scarcity to create panic and force quick decisions",
      explanation: "This creates artificial scarcity by suggesting opportunities will disappear forever. It's often used when the 'last chance' claim is false, designed to prevent comparison shopping or careful consideration."
    },
    { 
      phrase: "before it's too late", 
      type: "deadline-pressure", 
      severity: "high",
      rationale: "Implies dire consequences to manufacture urgency",
      explanation: "This phrase suggests catastrophic outcomes from delay without specifying what makes the timing critical. It's designed to create anxiety that overwhelms rational decision-making processes."
    },
    { 
      phrase: "time is running out", 
      type: "countdown-pressure", 
      severity: "high",
      rationale: "Creates temporal pressure to limit deliberation time",
      explanation: "This countdown language creates artificial time constraints that may not reflect actual deadlines. It's used to prevent thorough analysis and push for immediate commitment."
    },
    { 
      phrase: "limited time only", 
      type: "temporal-scarcity", 
      severity: "medium",
      rationale: "Suggests temporary availability to encourage hasty decisions",
      explanation: "This marketing phrase creates artificial time limits that may be extended or repeated. It's designed to prevent price comparison and careful consideration by suggesting the opportunity is fleeting."
    }
  ];

  patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
      frames.push({
        reflexId: `vx-fo01-${type}-${idx}`,
        reflexLabel: `False Urgency Detected`,
        rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This urgency manipulation may be designed to prevent careful consideration and force hasty decisions by creating artificial time pressure that overwhelms rational decision-making processes.`,
        confidence,
        tags: ["false-urgency", type, "pressure-tactics"],
        priority: severity === "high" ? 3 : 2
      });
    }
  });

  return frames;
};

export default detectFalseUrgency;
export { detectFalseUrgency };
export const analyzeFalseUrgency = detectFalseUrgency;