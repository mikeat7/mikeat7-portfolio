export type VXFrame = {
  reflexId: string;
  confidence: number;
  rationale: string;
  fragment?: string;
  explanation?: string;
  tags?: string[];
  priority?: number;
  tone?: string;
};

export type ReflexFrame = {
  id: string;
  label: string;
  confidence: number;
  rationale: string;
  fragment?: string;
  explanation?: string;
  tone?: string;
  linkedLesson?: string;
};

export function toReflexFrame(vx: VXFrame, i = 0): ReflexFrame {
  return {
    id: vx.reflexId || `vx-${i}`,
    label: vx.reflexId || "vx",
    confidence: vx.confidence ?? 0,
    rationale: vx.rationale ?? "",
    fragment: vx.fragment,
    explanation: vx.explanation,
    tone: vx.tone ?? "neutral"
  };
}
