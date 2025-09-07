// src/components/AnalyzeEngine.tsx
import React, { useState } from 'react';
import { useVXContext } from '@/context/VXContext';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AnalyzeEngine: React.FC = () => {
  const [input, setInput] = useState('');
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const results = await runReflexAnalysis(input);
      setReflexFrames(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-red-100 border-red-500 text-red-700';
    if (confidence >= 0.6) return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-green-100 border-green-500 text-green-700';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a statement, quote, or claim here for analysis..."
              className="min-h-32"
            />
            
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing}
                className="px-6"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reflexFrames.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          
          <div className="grid gap-4">
            {reflexFrames.map((frame, index) => (
              <Card key={`${frame.reflexId}-${index}`} className={`border-l-4 ${getConfidenceColor(frame.confidence)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{frame.reflexLabel}</h3>
                        <Badge variant="outline">
                          {Math.round(frame.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {frame.rationale}
                      </p>
                      {frame.tags && (
                        <div className="flex gap-1">
                          {frame.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reflexFrames.length === 0 && input && !isAnalyzing && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No reflexes triggered. The statement appears to be clear of detectable manipulation patterns.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyzeEngine;