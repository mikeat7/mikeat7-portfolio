// src/components/AdaptiveLearningDashboard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdaptiveLearningDashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Adaptive Learning</h3>
            <Badge className="text-xs px-2 py-0.5 border">beta</Badge>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            The engine tunes detector confidence based on user feedback and session history.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="text-xs px-2 py-0.5 bg-gray-100">vx-co01</Badge>
            <Badge className="text-xs px-2 py-0.5 bg-gray-100">vx-da01</Badge>
            <Badge className="text-xs px-2 py-0.5 bg-gray-100">vx-ju01</Badge>
            <Badge className="text-xs px-2 py-0.5 bg-gray-100">vx-nf01</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveLearningDashboard;
