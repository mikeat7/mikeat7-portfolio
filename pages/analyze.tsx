import React, { useState } from 'react';
import { useVXContext } from '@/context/VXProvider';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import CoFirePanel from '@/components/CoFirePanel';
import BackButton from '@/components/BackButton';

const AnalyzePage = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
  const [input, setInput] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    console.log(`🎯 Analysis #${analysisCount + 1} started, input length:`, input.length);
    setIsAnalyzing(true);
    
    // Clear previous results before new analysis
    setReflexFrames([]);
    
    try {
      const analysis = await runReflexAnalysis(input);
      console.log(`🎯 Analysis #${analysisCount + 1} completed, results:`, analysis);
      setReflexFrames(analysis);
      setAnalysisCount(prev => prev + 1);
      
    } catch (error) {
      console.error('🚨 Analysis failed:', error);
      setReflexFrames([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Clear results when input changes to avoid confusion
    if (reflexFrames.length > 0) {
      setReflexFrames([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <BackButton />
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Analyze a Statement</h1>
        <p className="text-gray-600 mb-6">
          Paste any text to reveal hidden assumptions, emotional manipulation, and rhetorical tactics using our comprehensive VX detection engine.
        </p>
        
        <div className="space-y-4">
          <textarea
            value={input}
            onChange={handleInputChange}
            disabled={isAnalyzing}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={6}
            placeholder="Paste any text here for comprehensive manipulation pattern analysis..."
          />
          
          <button
            onClick={handleAnalyze}
            disabled={!input.trim() || isAnalyzing}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>
          
          {analysisCount > 0 && (
            <p className="text-xs text-gray-500">
              Analysis runs completed: {analysisCount}
            </p>
          )}
        </div>

        {reflexFrames.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p className="text-sm text-gray-600">Found {reflexFrames.length} reflex detections</p>
            <div className="grid gap-4">
              {reflexFrames.map((frame, index) => (
                <div key={`${frame.reflexId}-${index}`} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg">{frame.reflexLabel}</h3>
                  <p className="text-sm text-gray-700 mt-1">{frame.rationale}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Confidence: {Math.round(frame.confidence * 100)}%
                    • Reflex ID: {frame.reflexId}
                  </p>
                </div>
              ))}
            </div>
            <CoFirePanel reflexes={reflexFrames} />
          </div>
        )}
        
        {analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-center">
              No reflexes detected in current input. Try phrases with emotional language, 
              absolute claims, or manipulative patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;