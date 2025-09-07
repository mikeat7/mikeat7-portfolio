// src/components/CoFirePanel.tsx

import React from "react";

import { VXFrame } from '@/types/VXTypes';

type Props = {
  reflexes?: VXFrame[]; // Optional with fallback
};

const CoFirePanel: React.FC<Props> = ({ reflexes = [] }) => {
  const highPriorityReflexes = reflexes.filter(r => r.confidence > 0.7);
  
  if (highPriorityReflexes.length < 2) return null;

  const avgConfidence =
    highPriorityReflexes.reduce((acc, r) => acc + r.confidence, 0) / highPriorityReflexes.length;

  const color =
    avgConfidence >= 0.85
      ? "bg-red-100 border-red-400 text-red-700"
      : avgConfidence >= 0.6
      ? "bg-yellow-100 border-yellow-400 text-yellow-800"
      : "bg-green-100 border-green-400 text-green-800";

  return (
    <div className={`border-l-4 p-4 my-4 rounded-md ${color}`}>
      <p className="font-semibold">
        ⚠️ Cluster Alert: {highPriorityReflexes.length} reflexes triggered
      </p>
      <ul className="ml-4 list-disc text-sm mt-2">
        {highPriorityReflexes.map((reflex) => (
          <li key={reflex.reflexId}>
            <strong>{reflex.reflexLabel}</strong> ({(reflex.confidence * 100).toFixed(1)}% confidence)
          </li>
        ))}
      </ul>
      <p className="text-xs mt-3">
        📌 Consider reviewing your input for stacked assumptions or rhetorical escalation.
      </p>
    </div>
  );
};

export default CoFirePanel;