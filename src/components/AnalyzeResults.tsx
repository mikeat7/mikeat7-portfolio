// src/components/AnalyzeResults.tsx
import React from "react";
import type { VXFrame } from "@/types/VXTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  frame: VXFrame;
  onClose: () => void;
};

const AnalyzeResults: React.FC<Props> = ({ frame, onClose }) => {
  const label = frame.reflexLabel ?? frame.reflexId;
  const confidencePct = Math.round((frame.confidence ?? 0) * 100);

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-lg">{label}</h4>
          <Badge className="px-2 py-0.5 text-xs border">{frame.reflexId}</Badge>
        </div>

        <p className="text-sm text-gray-700 mb-1">
          <strong>Confidence:</strong> {confidencePct}%
        </p>
        <p className="text-sm text-gray-600">
          <strong>Details:</strong> {frame.rationale ?? "—"}
        </p>

        <div className="mt-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Close
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzeResults;

