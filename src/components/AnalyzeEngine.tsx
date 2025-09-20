// src/components/AnalyzeEngine.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  total?: number;
  highConfidence?: number;
  clusters?: number;
};

const AnalyzeEngine: React.FC<Props> = ({ total = 0, highConfidence = 0, clusters = 0 }) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analyze Engine</h3>
          <Badge className="text-xs px-2 py-0.5 border">runtime</Badge>
        </div>

        <div className="mt-3 flex gap-2 text-sm">
          <Badge className="px-2 py-0.5 bg-gray-100">Detections: {total}</Badge>
          <Badge className="px-2 py-0.5 bg-gray-100">High-conf: {highConfidence}</Badge>
          <Badge className="px-2 py-0.5 bg-gray-100">Clusters: {clusters}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzeEngine;
