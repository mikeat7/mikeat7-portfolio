// src/pages/analyze.tsx
import React, { useState } from 'react';
import { useVXContext } from '@/context/VXProvider';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import { callAgentAnalyze } from '@/lib/llmClient'; // ✅ NEW
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import CoFirePanel from '@/components/CoFirePanel';
import BackButton from '@/components/BackButton';
import '@/styles.css'; // ✅ bubbles

const AnalyzePage = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
  const [input, setInput] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);

  // ✅ Detect if an agent base URL is configured; default toggle to true only if present
  const hasAgent =
    !!(import.meta as any).env?.VITE_AGENT_API_BASE &&
    String((import.meta as any).env.VITE_AGENT_API_BASE).trim().length > 0;
  const [useAgent, setUseAgent] = useState<boolean>(hasAgent);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setReflexFrames([]);

    try {
      let analysis;
      if (useAgent && hasAgent) {
        // ✅ Call AWS agent
        analysis = await callAgentAnalyze({
          text: input,
          mode: '--careful',
          stakes: 'medium',
        });
        console.log('🛰️ Agent frames:', analysis);
      } else {
        // ✅ Local fallback
        analysis = await runReflexAnalysis(input);
        console.log('🧪 Local frames:', analysis);
      }

      setReflexFrames(analysis || []);
      setAnalysisCount(prev => prev + 1);
    } catch (error) {
      console.error('🚨 Analysis failed:', error);
      setReflexFrames([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#e9eef5] py-10">
      {/* Bubble ambience */}
      <div className="bubble-bg">
        {[
          "epistemic humility","source, then claim","no false precision",
          "seek disconfirming evidence","explain uncertainty","avoid vague authority",
          "cite or qualify"
        ].map((t, i) => (
          <span key={i} className="bubble-text">{t}</span>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <BackButton />
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <h1 className="text-3xl font-bold text-slate-900">Analyze a Statement</h1>
          <p className="mt-2 text-slate-700">
            Paste any text—or a URL—to reveal hidden assumptions, emotional manipulation,
            semantic patterns, and missing context. This page also handles
            <strong> Scientific Paper Checks</strong> (triage methods & references) and
            <strong> Link &amp; Article Audits</strong>.
          </p>

          <div className="mt-6 space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isAnalyzing}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={6}
              placeholder="Paste a paragraph, a link to an article, or a snippet from a methods section…"
            />

            {/* ✅ Small control row: toggle + run button */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-slate-600">
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

              <button
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing…' : 'Run Analysis'}
              </button>
            </div>

            {analysisCount > 0 && (
              <p className="text-xs text-slate-600">
                Runs completed: {analysisCount} · Mode: {useAgent && hasAgent ? 'AWS Agent' : 'Local'}
              </p>
            )}
          </div>

          {/* Results */}
          {reflexFrames.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <p className="text-sm text-slate-600">
                Found {reflexFrames.length} detections
              </p>
              <div className="grid gap-4">
                {reflexFrames.map((frame, index) => (
                  <div key={`${frame.reflexId}-${index}`} className="p-4 rounded-2xl bg-[#e9eef5]"
                    style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
                  >
                    <h3 className="font-semibold text-lg">{frame.reflexLabel}</h3>
                    <p className="text-sm text-slate-700 mt-1">{frame.rationale ?? frame.reason}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Confidence: {Math.round((frame.confidence ?? 0) * 100)}% • Reflex ID: {frame.reflexId}
                    </p>
                  </div>
                ))}
              </div>
              <CoFirePanel reflexes={reflexFrames} />
            </div>
          )}

          {analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && (
            <div className="mt-8 p-4 rounded-2xl bg-[#e9eef5]"
                 style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}>
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


