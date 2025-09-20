// src/lib/vx/compat.ts
import type { VXFrame as CoreVXFrame } from "@/types/VXTypes";

// Re-export so other files can import from here if they want
export type VXFrame = CoreVXFrame;

export type ReflexFrame = {
  id: string;
  label: string;
  confidence: number;
  rationale: string;   // required for older UI components
  fragment?: string;
  explanation?: string;
  tone: string;        // required (no undefined) for older UI components
  linkedLesson?: string;
};

export function toReflexFrame(vx: CoreVXFrame, i: number = 0): ReflexFrame {
  const anyVX = vx as any;
  return {
    id: vx.reflexId || `vx-${i}`,
    label: vx.reflexLabel || vx.reflexId || "vx",
    confidence: vx.confidence ?? 0,
    rationale: vx.rationale ?? "",
    fragment: anyVX.fragment,
    explanation: anyVX.explanation,
    tone: anyVX.tone ?? "neutral"
  };
}

