// src/context/VXProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VXFrame } from '@/types/VXTypes';

interface VXContextType {
  reflexFrames: VXFrame[];
  setReflexFrames: (frames: VXFrame[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  latestInput: string;
  setLatestInput: (input: string) => void;
}

const VXContext = createContext<VXContextType | undefined>(undefined);

export const useVXContext = () => {
  const context = useContext(VXContext);
  if (!context) {
    throw new Error('useVXContext must be used within a VXProvider');
  }
  return context;
};

interface VXProviderProps {
  children: ReactNode;
}

export const VXProvider: React.FC<VXProviderProps> = ({ children }) => {
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

export { VXContext };