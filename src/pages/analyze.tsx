// src/pages/analyze.tsx
import React, { useState } from 'react';
import { useVXContext } from '@/context/VXProvider';
import type { VXFrame } from '@/types/VXTypes';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import CoFirePanel from '@/components/CoFirePanel';
import BackButton from '@/components/BackButton';
import codex from '@/data/front-end-codex.v0.9.json';
import { shouldTriggerReflex } from '@/lib/codex-runtime';
import { FailureBanner } from '@/components/FailureBanner';

const reflexKey = (id: string): string | undefined => {
  const low = id.toLowerCase();
  if (low.startsWith('vx-da')) return 'data_less_claim';
  if (low.startsWith('vx-fp')) return 'false_precision';
  if (low.startsWith('vx-ha')) return 'hallucination';
  if (low.startsWith('vx-os')) return 'omission';
  if (low.startsWith('vx-pc')) return 'perceived_consensus';
  if (low.startsWith('vx-tu')) return 'tone_urgency';
  if (low.startsWith('vx-ed')) return 'ethical_drift';
  if (low.startsWith('vx-em')) return 'emotional_manipulation';
  if (low.startsWith('vx-so')) return 'speculative_authority';
  // others (e.g., rhetorical interruption) flow through ungated
  return undefined;
};

const AnalyzePage: React.FC = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
  const [input, setInput] = useState<string>('');
  const [analysisCount, setAnalysisCount] = useState<number>(0);
  const [blockedBy, setBlockedBy] = useState<string | null>(null);

  // You can later surface these from a UI selector
  const stakes: 'low' | 'medium' | 'high' = 'medium';
  const mode: '--direct' | '--careful' | '--recap' = '--careful';

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    console.log(`🎯 Analysis #${analysisCount + 1} started, input length:`, input.length);
    setIsAnalyzing(true);
    setBlockedBy(null);
    setReflexFrames([]); // clear previous

    try {
      const analysis: VXFrame[] = await runReflexAnalysis(input);

      // Gate via codex thresholds
      const gated: VXFrame[] = [];
      let localBlocked: string | null = null;

      for (const f of analysis) {
        const key = reflexKey(f.reflexId);
        if (!key) { gated.push(f); continue; }

        const { trigger, block } = shouldTriggerReflex(
          codex as any,
          key,
          f.confidence ?? 0,
          stakes
        );

        if (block) {
          localBlocked = key;
          break; // honor hard block
        }
        if (trigger) gated.push(f);
      }

      setBlockedBy(localBlocked);
      setReflexFrames(gated);
      setAnalysisCount(prev => prev + 1);

      console.log(`🎯 Analysis #${analysisCount + 1} completed, results:`, { total: analysis.length, gated: gated.length, blockedBy: localBlocked });

    } catch (error) {
      console.error('🚨 Analysis failed:', error);
      setReflexFrames([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (reflexFrames.length > 0) setReflexFrames([]);
    if (blockedBy) setBlockedBy(null);
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

          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
            <span className="text-xs text-gray-500">
              Mode: <b>{mode}</b> • Stakes: <b>{stakes}</b>
            </span>
          </div>

          {analysisCount > 0 && (
            <p className="text-xs text-gray-500">
              Analysis runs completed: {analysisCount}
            </p>
          )}
        </div>

        {blockedBy && (
          <div className="mt-6">
            <FailureBanner kind="hedge" />
            <p className="text-xs text-gray-500 mt-2">
              Block reason (codex threshold tripped): <code>{blockedBy}</code>
            </p>
          </div>
        )}

        {reflexFrames.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p className="text-sm text-gray-600">Found {reflexFrames.length} reflex detections</p>
            <div className="grid gap-4">
              {reflexFrames.map((frame: VXFrame, index: number) => (
                <div key={`${frame.reflexId}-${index}`} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg">{frame.reflexLabel ?? frame.reflexId}</h3>
                  {frame.rationale && (
                    <p className="text-sm text-gray-700 mt-1">{frame.rationale}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Confidence: {Math.round((frame.confidence ?? 0) * 100)}%
                    {' '}• Reflex ID: {frame.reflexId}
                  </p>
                </div>
              ))}
            </div>
            <CoFirePanel reflexes={reflexFrames} />
          </div>
        )}

        {analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && !blockedBy && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-center">
              No reflexes detected. Try text with emotional language, absolute claims, or vague authority.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;
