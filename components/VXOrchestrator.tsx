// src/components/VXOrchestrator.tsx
// Clarity Armor Reflex Runtime — Context & Analyzer Export

import React, { useEffect, useContext } from 'react';
import { VXContext } from '@/context/VXContext';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';

interface Props {
  input: string;
  children?: React.ReactNode;
}

const VXOrchestrator: React.FC<Props> = ({ input, children }) => {
  const { setLatestInput, setReflexFrames } = useContext(VXContext);

  useEffect(() => {
    if (!input) return;

    // Update context with new input
    setLatestInput(input);

    // Run analysis and set frames
    const run = async () => {
      const frames = await runReflexAnalysis(input);
      setReflexFrames(frames);
    };

    run();
  }, [input, setLatestInput, setReflexFrames]);

  return <>{children}</>; // ✅ Allows child render with loaded context
};

export default VXOrchestrator;
