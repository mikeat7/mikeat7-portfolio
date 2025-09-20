// src/components/VXReflexPreview.tsx
import React from 'react';
import { useVXContext } from '@/context/VXProvider';
import { Card, CardContent } from '@/components/ui/card';
import type { VXFrame } from '@/types/VXTypes';

const Pill: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${className ?? ''}`} >
    {children}
  </span>
);

const VXReflexPreview: React.FC = () => {
  const { reflexFrames } = useVXContext();

  if (!reflexFrames || reflexFrames.length === 0) {
    return (
      <div className="text-center text-gray-400 italic py-8">
        No reflexes triggered yet. Submit input to begin analysis.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reflexFrames.map((frame: VXFrame, idx: number) => (
        <Card key={idx} className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{frame.reflexLabel ?? frame.reflexId}</h4>
              <Pill className="border-gray-300 text-gray-700">{frame.reflexId}</Pill>
            </div>

            <p className="text-sm text-gray-700 mb-1">
              <strong>Confidence:</strong> {Math.round((frame.confidence ?? 0) * 100)}%
            </p>

            {(frame.rationale ?? frame.reason) && (
              <p className="text-sm text-gray-600 mb-1">
                <strong>Details:</strong> {frame.rationale ?? frame.reason}
              </p>
            )}

            {Array.isArray(frame.tags) && frame.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {frame.tags.map((tag: string, i: number) => (
                  <Pill key={i} className="border-blue-300 text-blue-700">{tag}</Pill>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VXReflexPreview;
