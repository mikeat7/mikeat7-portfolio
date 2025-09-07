// VX-TU01 — Tone Escalation Detector
// Enhanced version with detailed analysis

import { VXFrame } from "@/types/VXTypes";

const detectToneEscalation = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();

  const patterns = [
    { 
      phrase: "crisis", 
      type: "urgency-escalation", 
      severity: "high",
      rationale: "Uses crisis language to manufacture urgency and bypass deliberation",
      explanation: "The word 'crisis' immediately elevates emotional stakes and suggests immediate action is required. This can be used to short-circuit normal decision-making processes by creating artificial time pressure and emotional intensity."
    },
    { 
      phrase: "unacceptable", 
      type: "moral-escalation", 
      severity: "high",
      rationale: "Declares situations intolerable to shut down discussion",
      explanation: "This term presents a subjective judgment as objective fact, implying that no reasonable person could disagree. It escalates emotional tone while potentially closing off legitimate debate or alternative perspectives."
    },
    { 
      phrase: "we must fight", 
      type: "combat-framing", 
      severity: "high",
      rationale: "Uses warfare metaphors to escalate conflict and polarize positions",
      explanation: "Military language transforms disagreements into battles, making compromise seem like surrender and opponents into enemies. This framing escalates emotional intensity and can justify increasingly extreme responses."
    },
    { 
      phrase: "catastrophe", 
      type: "disaster-framing", 
      severity: "high",
      rationale: "Employs catastrophic language to amplify fear and urgency",
      explanation: "This term maximizes emotional impact by suggesting total disaster. It can be used to justify extreme measures or create panic that overwhelms rational assessment of actual risks and appropriate responses."
    }
  ];

  patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
      frames.push({
        reflexId: `vx-tu01-${type}-${idx}`,
        reflexLabel: `Tone Escalation Detected`,
        rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This escalated language may be designed to overwhelm rational discussion with emotional intensity, potentially leading to hasty decisions or polarized positions that prevent constructive dialogue.`,
        confidence,
        tags: ["tone-escalation", type, "emotional-manipulation"],
        priority: severity === "high" ? 3 : 2
      });
    }
  });

  return frames;
};

export default detectToneEscalation;
export { detectToneEscalation };
export const analyzeToneUrgency = detectToneEscalation;