// src/types/VXTypes.ts
export interface VXFrame {
  reflexId: string;            // Unique identifier for the reflex
  reflexLabel?: string;        // Human-readable label (optional)
  confidence: number;          // 0.0–1.0 range score
  rationale?: string;          // Optional explanation (used by some modules)
  reason?: string;             // Alternate explanation (fallback key)
  tags?: string[];             // Used for co-fire clustering
  priority?: number;           // Optional ordering
  fatigue?: number;            // Optional fatigue modifier
}