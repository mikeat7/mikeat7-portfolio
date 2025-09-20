// src/lib/scanLogic.ts

/**
 * scanLogic.ts
 * Modular parser to support claim detection and URL summarization.
 */

import type { VXFrame } from "@/types/VXTypes";

/**
 * Checks if input is a URL and returns placeholder summary logic.
 * Future versions can integrate live server-side parsing.
 */
export const parseInput = async (
  input: string
): Promise<{ cleanedText: string; sourceSummary?: string }> => {
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  if (urlRegex.test(input.trim())) {
    // Stubbed: Replace with server-side fetch later
    return {
      cleanedText:
        "Placeholder summary of linked content: 'The article discusses the ethics of AI in journalism...'",
      sourceSummary: input.trim(),
    };
  }

  return { cleanedText: input };
};

/**
 * Basic entry stub for future scan analysis.
 */
export const scanForVX = (text: string): VXFrame[] => {
  // Stubbed: Placeholder detector logic for simple static output
  return [
    {
      reflexId: "vx-dummy",
      reflexLabel: "Placeholder Reflex",
      rationale: "This is a simulated detection output for demo purposes.",
      confidence: 0.42,
    },
  ];
};

/**
 * Analyze input using the comprehensive VX reflex pipeline.
 * Uses a dynamic import and supports both named and default exports.
 */
export const analyzeInput = async (
  input: string,
  _context?: any
): Promise<VXFrame[]> => {
  try {
    const mod = await import("@/lib/analysis/runReflexAnalysis");
    const runner =
      // prefer named export if present
      (mod as any).runReflexAnalysis ??
      // fall back to default export
      (mod as any).default;

    if (typeof runner !== "function") {
      console.error(
        "Analysis failed: runReflexAnalysis export not found or not a function."
      );
      return [];
    }

    const results: VXFrame[] = await runner(input);
    return results ?? [];
  } catch (error) {
    console.error("Analysis failed:", error);
    return [];
  }
};
