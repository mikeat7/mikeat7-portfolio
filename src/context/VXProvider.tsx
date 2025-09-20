// src/context/VXProvider.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { VXFrame } from '@/types/VXTypes';

export type VXContextType = {
  reflexFrames: VXFrame[];
  setReflexFrames: (frames: VXFrame[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  latestInput: string;
  setLatestInput: (input: string) => void;
};

export const VXContext = createContext<VXContextType | undefined>(undefined);

export function useVXContext(): VXContextType {
  const ctx = useContext(VXContext);
  if (!ctx) throw new Error('useVXContext must be used within a VXProvider');
  return ctx;
}

export const VXProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reflexFrames, setReflexFrames] = useState<VXFrame[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestInput, setLatestInput] = useState('');

  return (
    <VXContext.Provider
      value={{
        reflexFrames,
        setReflexFrames,
        isAnalyzing,
        setIsAnalyzing,
        latestInput,
        setLatestInput,
      }}
    >
      {children}
    </VXContext.Provider>
  );
};
