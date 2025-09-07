// src/components/ReflexInfoDrawer.tsx

import React from "react";
import { ReflexUISchema } from "@/data/vx-ui-schema"; // Adjust path if needed

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reflex: {
    id: string;
    label: string;
    confidence: number;
    rationale: string;
    tone: string;
    linkedLesson?: string;
  };
};

const ReflexInfoDrawer: React.FC<Props> = ({ isOpen, onClose, reflex }) => {
  if (!isOpen) return null;

  const severityColor =
    reflex.confidence >= 0.85 ? "bg-red-100 text-red-700" :
    reflex.confidence >= 0.6 ? "bg-yellow-100 text-yellow-800" :
    "bg-green-100 text-green-800";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-end">
      <div className="w-full sm:w-96 bg-white shadow-xl p-6 rounded-l-xl overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reflex Insight</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">✕</button>
        </div>
        <div className={`p-3 rounded ${severityColor}`}>
          <p className="font-bold">{reflex.label}</p>
          <p className="text-sm">Confidence: {(reflex.confidence * 100).toFixed(0)}%</p>
          <p className="text-sm mt-2">{reflex.rationale}</p>
        </div>
        {reflex.linkedLesson && (
          <div className="mt-4">
            <a
              href={`/educate#${reflex.linkedLesson}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Learn more: {reflex.linkedLesson}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflexInfoDrawer;