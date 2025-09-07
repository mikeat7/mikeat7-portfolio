// src/components/AdaptiveLearningDashboard.tsx
// Dashboard to monitor and manage adaptive learning

import React, { useState, useEffect } from 'react';
import { adaptiveLearning } from '@/lib/adaptive/AdaptiveLearningEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdaptiveLearningDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(adaptiveLearning.getLearningStats());
    };
    
    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const resetPattern = (reflexId: string) => {
    if (confirm(`Reset all learning for pattern ${reflexId}?`)) {
      adaptiveLearning.resetPattern(reflexId);
      setStats(adaptiveLearning.getLearningStats());
    }
  };

  if (!stats) return <div>Loading learning stats...</div>;

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">🧠 Adaptive Learning Status</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalAdjustments}</div>
            <div className="text-sm text-gray-600">Patterns Learned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalFeedback}</div>
            <div className="text-sm text-gray-600">Total Feedback</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.recentFeedback}</div>
            <div className="text-sm text-gray-600">Recent (24h)</div>
          </div>
        </div>

        {showDetails && stats.adjustmentsSummary.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Pattern Adjustments:</h4>
            {stats.adjustmentsSummary.map((adj: any) => (
              <div key={adj.reflexId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-200 px-1 rounded">{adj.reflexId}</code>
                  <Badge variant={adj.adjustment > 0 ? 'default' : 'secondary'}>
                    {adj.adjustment >= 0 ? '+' : ''}{adj.adjustment.toFixed(3)}
                  </Badge>
                  <span className="text-xs text-gray-600">
                    ({adj.feedbackCount} feedback{adj.feedbackCount !== 1 ? 's' : ''})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetPattern(adj.reflexId)}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          💡 The system learns from your feedback and automatically adjusts detection confidence in real-time.
          Adjustments are saved locally and persist across sessions.
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveLearningDashboard;