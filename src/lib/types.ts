// src/lib/types.ts

export type ReflexFrame = {
  id: string;               // e.g., "vx-em08"
  label: string;            // e.g., "Emotional Manipulation"
  fragment: string;         // Portion of input text flagged
  confidence: number;       // 0–1
  priority: number;         // 1–5
  explanation: string;      // Human-readable explanation
  mitigation?: string;      // Optional suggestion
  quoteAnchorId?: string;   // For lesson linking
  tags?: string[];          // e.g., ["bias", "fallacy"]
};
