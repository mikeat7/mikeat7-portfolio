// src/components/VXReflexPreview.tsx
import React from 'react';
import { useVXContext } from '@/context/VXProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      {reflexFrames.map((frame, idx) => (
        <Card key={idx} className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{frame.reflexLabel ?? frame.reflexId}</h4>
              <Badge variant="outline">{frame.reflexId}</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Confidence:</strong> {Math.round((frame.confidence ?? 0) * 100)}%
            </p>
            {frame.rationale && (
              <p className="text-sm text-gray-600 mb-1">
                <strong>Details:</strong> {frame.rationale}
              </p>
            )}
            {frame.tags && frame.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {frame.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
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
