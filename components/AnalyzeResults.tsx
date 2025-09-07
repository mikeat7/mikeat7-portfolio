// src/components/AnalyzeResults.tsx

import React, { useState } from "react";
import { useVXContext } from "@/context/VXContext";
import { VXFrame } from "@/types/VXTypes";
import ReflexInfoDrawer from "@/components/ReflexInfoDrawer";
import CoFirePanel from "@/components/CoFirePanel";


const getColor = (confidence: number) => {
  if (confidence >= 0.75) return "bg-red-100 border-red-500 text-red-700";
  if (confidence >= 0.5) return "bg-yellow-100 border-yellow-500 text-yellow-700";
  return "bg-green-100 border-green-500 text-green-700";
};

const AnalyzeResults: React.FC = () => {
  const { reflexFrames } = useVXContext();
  const [selectedFrame, setSelectedFrame] = useState<VXFrame | null>(null);

  if (!reflexFrames || reflexFrames.length === 0) {
    return (
      <div className="mt-4 p-4 text-gray-600 italic border border-dashed rounded">
        No reflexes triggered. Please enter a statement to analyze.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
   
      <CoFirePanel />
      <div className="grid gap-4">
        {reflexFrames.map((frame, index) => (
          <div
            key={`${frame.reflexId}-${index}`}
            className={`p-4 rounded border ${getColor(frame.confidence)} cursor-pointer`}
            onClick={() => setSelectedFrame(frame)}
          >
            <h3 className="text-lg font-semibold">{frame.reflexLabel}</h3>
            <p className="text-sm mt-1">{frame.rationale}</p>
            <p className="text-xs mt-2 font-mono">
              Confidence: {(frame.confidence * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      {selectedFrame && (
        <ReflexInfoDrawer
          frame={selectedFrame}
          onClose={() => setSelectedFrame(null)}
        />
      )}
    </div>
  );
};

export default AnalyzeResults;
