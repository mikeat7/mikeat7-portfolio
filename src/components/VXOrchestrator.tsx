// src/components/VXOrchestrator.tsx
// Clarity Armor Reflex Runtime — Context & Analyzer Orchestrator

import React, { useEffect, useContext } from "react";
import { VXContext } from "@/context/VXContext";
import { runReflexAnalysis } from "@/lib/analysis/runReflexAnalysis";
import type { VXFrame } from "@/types/VXTypes";

interface Props {
  input: string;
  children?: React.ReactNode;
}

const VXOrchestrator: React.FC<Props> = ({ input, children }) => {
  // Context may be undefined or not include setters yet; keep this resilient.
  const ctx = useContext(VXContext) as
    | (Partial<{
        setLatestInput: (s: string) => void;
        setReflexFrames: (f: VXFrame[]) => void;
      }>)
    | undefined;

  useEffect(() => {
    if (!input || input.trim().length < 1) return;

    // Update context if available
    ctx?.setLatestInput?.(input);

    // Run analysis and publish frames into context if setter exists
    const run = async () => {
      try {
        const frames = await runReflexAnalysis(input);
        ctx?.setReflexFrames?.(frames);
      } catch (e) {
        console.error("VXOrchestrator: analysis failed", e);
      }
    };

    run();
  }, [input, ctx]);

  // Orchestrator doesn’t render UI itself; it just coordinates
  return <>{children}</>;
};

export default VXOrchestrator;
