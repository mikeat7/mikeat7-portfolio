// src/components/ReflexInfoDrawer.tsx
import React from "react";
import type { ReflexFrame } from "@/lib/vx/compat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReflexUISchema from "@/data/vx-ui-schema";

type Props = {
  reflex: ReflexFrame;
  isOpen: boolean;
  onClose: () => void;
};

const ReflexInfoDrawer: React.FC<Props> = ({ reflex, isOpen, onClose }) => {
  if (!isOpen) {
    // Render a compact card version when closed (to avoid layout jumps)
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{reflex.label}</h4>
            <Badge className="text-xs px-2 py-0.5 border">{Math.round(reflex.confidence * 100)}%</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {reflex.rationale || reflex.explanation || "No rationale provided."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const schema = (ReflexUISchema as any)[reflex.id] || {};
  const color = schema.color || "gray";
  const summary = schema.summary || "No UI schema summary available.";

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex">
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{reflex.label}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="text-xs px-2 py-0.5 border">tone: {reflex.tone || "neutral"}</Badge>
          <Badge className="text-xs px-2 py-0.5 border" style={{ borderColor: color }}>
            {Math.round(reflex.confidence * 100)}%
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mt-4">
          {reflex.rationale || reflex.explanation || "No rationale provided."}
        </p>

        <div className="mt-4">
          <h4 className="font-medium mb-1">UI Schema</h4>
          <p className="text-sm text-gray-600">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default ReflexInfoDrawer;

