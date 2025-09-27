// src/pages/analyze.tsx
import React, { useState } from 'react';
import { useVXContext } from '@/context/VXProvider';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import { callAgentAnalyze } from '@/lib/llmClient';
import CoFirePanel from '@/components/CoFirePanel';
import BackButton from '@/components/BackButton';
import '@/styles.css';

type Mode = '--direct' | '--careful' | '--recap';
type Stakes = 'low' | 'medium' | 'high';

const AnalyzePage = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
  const [input, setInput] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [mode, setMode] = useState<Mode>('' as Mode || '--careful');
  const [stakes, setStakes] = useState<Stakes>('' as Stakes || 'medium');
  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<'agent' | 'local' | null>(null);

  const hasAgent =
    !!(import.meta as any).env?.VITE_AGENT_API_BASE &&
    String((import.meta as any).env.VITE_AGENT_API_BASE).trim().length > 0;
  const [useAgent, setUseAgent] = useState<boolean>(hasAgent);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setReflexFrames([]);
    setNotice(null);
    setSource(null);

    try {
      let frames = [];
      if (useAgent && hasAgent) {
        const agentFrames = await callAgentAnalyze({ text: input, mode, stakes });
        if (Array.isArray(agentFrames) && agentFrames.length > 0) {
          frames = agentFrames as any;
          setSource('agent');
        } else {
          // Auto-fallback to local if agent returns nothing
          const localFrames = await runReflexAnalysis(input);
          frames = localFrames as any;
          setSource('local');
          setNotice('Agent returned no detections—showing local analysis instead.');
        }
      } else {
        const localFrames = await runReflexAnalysis(input);
        frames = localFrames as any;
        setSource('local');
      }

      setReflexFrames(frames);
      setAnalysisCount((n) => n + 1);
    } catch (err) {
      console.error('🚨 Analysis failed:', err);
      setReflexFrames([]);
      setSource(null);
      setNotice('Analysis failed. Please try again or switch source.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#e9eef5] py-10">
      {/* Bubble ambience */}
      <div className="bubble-bg">
        {[
          'epistemic humility',
          'source, then claim',
          'no false precision',
          'seek disconfirming evidence',
          'explain uncertainty',
          'avoid vague authority',
          'cite or qualify',
        ].map((t, i) => (
          <span key={i} className="bubble-text">
            {t}
          </span>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <BackButton />
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: '#e9eef5',
            boxShadow:
              '9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)',
          }}
        >
          <h1 className="text-3xl font-bold text-slate-900">Analyze a Statement</h1>
          <p className="mt-2 text-slate-700">
            Paste any text—or a URL—to reveal hidden assumptions, emotional manipulation,
            semantic patterns, and missing context. This page also handles
            <strong> Scientific Paper Checks</strong> and <strong> Link &amp; Article Audits</strong>.
          </p>

          {/* Controls */}
          <div className="mt-6 space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isAnalyzing}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={6}
              placeholder="Paste a paragraph, a link to an article, or a snippet from a methods section…"
            />

            <div className="flex flex-wrap items-center gap-3">
              {/* Agent toggle */}
              <label className="flex items-center gap-2 text-sm text-slate-600 mr-4">
                <input
                  type="checkbox"
                  checked={useAgent}
                  onChange={(e) => setUseAgent(e.target.checked)}
                  disabled={!hasAgent}
                />
                Use AWS Agent
                {!hasAgent && (
                  <span className="ml-2 text-xs text-slate-500">
                    (no VITE_AGENT_API_BASE set — using local engine)
                  </span>
                )}
              </label>

              {/* Mode */}
              <label className="text-sm text-slate-600">
                Mode:{' '}
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                  className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                  disabled={isAnalyzing}
                >
                  <option value="--direct">--direct</option>
                  <option value="--careful">--careful</option>
                  <option value="--recap">--recap</option>
                </select>
              </label>

              {/* Stakes */}
              <label className="text-sm text-slate-600">
                Stakes:{' '}
                <select
                  value={stakes}
                  onChange={(e) => setStakes(e.target.value as Stakes)}
                  className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                  disabled={isAnalyzing}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </label>

              <button
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing}
                className="ml-auto px-6 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing…' : 'Run Analysis'}
              </button>
            </div>

            {/* Tiny status line */}
            <div className="text-xs text-slate-600">
              {analysisCount > 0 && (
                <>
                  Runs: {analysisCount} · Source:{' '}
                  <span className="px-2 py-[2px] rounded-md"
                    style={{
                      background: '#e9eef5',
                      boxShadow: 'inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff',
                    }}
                  >
                    {source ?? '—'}
                  </span>
                </>
              )}
            </div>

            {notice && (
              <div
                className="mt-2 text-xs text-slate-700 px-3 py-2 rounded-lg"
                style={{
                  background: '#e9eef5',
                  boxShadow: 'inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff',
                }}
              >
                {notice}
              </div>
            )}
          </div>

          {/* Results */}
          {reflexFrames.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <p className="text-sm text-slate-600">Found {reflexFrames.length} detections</p>

              <div className="grid gap-4">
                {reflexFrames.map((frame, index) => (
                  <div
                    key={`${frame.reflexId}-${index}`}
                    className="p-4 rounded-2xl bg-[#e9eef5]"
                    style={{ boxShadow: 'inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff' }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{frame.reflexLabel}</h3>
                      {source && (
                        <span
                          className="text-[10px] uppercase tracking-wide px-2 py-[2px] rounded-md"
                          style={{
                            background: '#e9eef5',
                            boxShadow:
                              'inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff',
                          }}
                        >
                          {source}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-1">
                      {frame.rationale ?? (frame as any).reason}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Confidence: {Math.round(((frame.confidence ?? 0) as number) * 100)}% • Reflex ID:{' '}
                      {frame.reflexId}
                    </p>
                  </div>
                ))}
              </div>

              <CoFirePanel reflexes={reflexFrames} />
            </div>
          )}

          {analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && (
            <div
              className="mt-8 p-4 rounded-2xl bg-[#e9eef5]"
              style={{ boxShadow: 'inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff' }}
            >
              <p className="text-slate-700 text-center">
                No reflexes detected. Try text with strong certainty, unnamed authorities,
                or sweeping claims—then see how the engine responds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;

