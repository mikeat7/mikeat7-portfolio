// VX-EM08 — Emotional Manipulation Detector
// Flags emotionally manipulative language (fear, urgency, guilt, flattery)

import { VXFrame } from "@/types/VXTypes";

const EMOTION_MAP: Record<string, { phrase: string; type: string; severity: string }> = {
  "act now": { phrase: "act now", type: "urgency", severity: "high" },
  "acting now": { phrase: "acting now", type: "urgency", severity: "high" },
  "limited time": { phrase: "limited time", type: "urgency", severity: "medium" },
  "as much as we want": { phrase: "as much as we want", type: "false-consensus", severity: "high" },
  "put it behind us": { phrase: "put it behind us", type: "emotional-framing", severity: "medium" },
  "isn't going away": { phrase: "isn't going away", type: "permanence-framing", severity: "medium" },
  "currently rising": { phrase: "currently rising", type: "trend-amplification", severity: "medium" },
  "summer surge": { phrase: "summer surge", type: "crisis-language", severity: "high" },
  "you’ll regret": { phrase: "you’ll regret", type: "guilt", severity: "high" },
  "you will regret": { phrase: "you will regret", type: "guilt", severity: "high" },
  "regret not": { phrase: "regret not", type: "guilt", severity: "high" },
  "don’t miss": { phrase: "don’t miss", type: "urgency", severity: "medium" },
  "only chance": { phrase: "only chance", type: "urgency", severity: "high" },
  "think of the children": { phrase: "think of the children", type: "guilt", severity: "high" },
  "you deserve": { phrase: "you deserve", type: "flattery", severity: "medium" },
  "clever minds like yours": { phrase: "clever minds like yours", type: "flattery", severity: "low" },
  "danger is imminent": { phrase: "danger is imminent", type: "fear", severity: "high" },
  "catastrophic consequences": { phrase: "catastrophic consequences", type: "fear", severity: "high" },
  "before it's too late": { phrase: "before it's too late", type: "urgency", severity: "high" },
  "time is running out": { phrase: "time is running out", type: "urgency", severity: "high" },
  "stepped in": { phrase: "stepped in", type: "authority-framing", severity: "medium" },
  "disaster": { phrase: "disaster", type: "crisis-amplification", severity: "medium" },
  "scientists claim": { phrase: "scientists claim", type: "vague-authority", severity: "medium" },
};

const detectEmotionalManipulation = (text: string): VXFrame[] => {
  const lowered = text.toLowerCase();
  const frames: VXFrame[] = [];

  Object.values(EMOTION_MAP).forEach(({ phrase, type, severity }, idx) => {
    if (lowered.includes(phrase)) {
      const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
      frames.push({
        reflexId: `vx-em08-${type}-${idx}`,
        reflexLabel: `Detected ${type} trigger`,
        rationale: `The phrase "${phrase}" may indicate ${type}-based emotional manipulation.`,
        confidence,
        tags: ["emotional", type],
        priority: 2,
      });
    }
  });

  return frames;
};

// ✅ Export both default and named for compatibility
export default detectEmotionalManipulation;
export { detectEmotionalManipulation };
export const analyzeEmotion = detectEmotionalManipulation;
