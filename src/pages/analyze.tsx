// src/pages/analyze.tsx
import React, { useState } from "react";
import { useVXContext } from "@/context/VXProvider";
import runReflexAnalysis from "@/lib/analysis/runReflexAnalysis";
import AnalysisReport from "@/components/AnalysisReport";
import { callAgentAnalyze } from "@/lib/llmClient";
import {
  buildHandshake,
  type Mode,
  type Stakes,
  type CitePolicy,
} from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";
import "@/styles.css"; // bubbles

// Simple hover-tooltips (native title=)
const TOOLTIPS = {
  useAgent:
    "Run on our AWS Agent (server) or locally in your browser. Agent adds server-side checks; local is instant/private.",
  mode:
    "--direct: fast & concise • --careful: guardrails & checks • --recap: summarize task/assumptions first.",
  stakes:
    "How serious the outcome is. Higher stakes raise confidence/citation requirements and trigger stricter behavior.",
  min_confidence:
    "Minimum confidence before we hedge, ask for clarification, or refuse. Slide right = stricter.",
  cite_policy:
    "auto: cite when needed • force: always require citations • off: don’t require citations.",
  omission_scan:
    "auto: run at medium/high stakes • true: always run • false: skip unless critical.",
  reflex_profile:
    "default: balanced • strict: blockier (contradictions/hallucinations first) • lenient: softer checks.",
};

const AnalyzePage = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
  const [input, setInput] = useState("");
  const [analysisCount, setAnalysisCount] = useState(0);

  // Handshake state (full set)
  const [mode, setMode] = useState<Mode>("--careful");
  const [stakes, setStakes] = useState<Stakes>("medium");
  const [minConfidence, setMinConfidence] = useState<number>(0.6);
  const [citePolicy, setCitePolicy] = useState<CitePolicy>("auto");

  // UI-friendly tri-state, converted on submit
  const [omissionUI, setOmissionUI] = useState<"auto" | "true" | "false">("auto");
  const omission_scan: "auto" | boolean =
    omissionUI === "auto" ? "auto" : omissionUI === "true";

  const [reflexProfile, setReflexProfile] =
    useState<"default" | "strict" | "lenient">("default");

  const envBase = (import.meta as any).env?.VITE_AGENT_API_BASE;
  const hasAgent = !!envBase && String(envBase).trim().length > 0;
  const [useAgent, setUseAgent] = useState<boolean>(hasAgent);

  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<"agent" | "local" | null>(null);

  // Live handshake preview (Codex will clamp floors)
  const previewHandshake = buildHandshake(codex as any, {
    mode,
    stakes,
    min_confidence: minConfidence,
    cite_policy: citePolicy,
    omission_scan,
    reflex_profile: reflexProfile,
  });

  // Presets
  function applyPreset(kind: "fast" | "balanced" | "audit") {
    if (kind === "fast") {
      setMode("--direct");
      setStakes("low");
      setMinConfidence(0.55);
      setCitePolicy("off");
      setOmissionUI("false");
      setReflexProfile("lenient");
    } else if (kind === "balanced") {
      setMode("--careful");
      setStakes("medium");
      setMinConfidence(0.65);
      setCitePolicy("auto");
      setOmissionUI("auto");
      setReflexProfile("default");
    } else {
      // audit
      setMode("--careful");
      setStakes("high");
      setMinConfidence(0.75);
      setCitePolicy("force");
      setOmissionUI("true");
      setReflexProfile("strict");
    }
  }

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setReflexFrames([]);
    setNotice(null);
    setSource(null);

    try {
      let frames: any[] = [];

      if (useAgent && hasAgent) {
        const agentFrames = await callAgentAnalyze({
          text: input,
          mode,
          stakes,
          min_confidence: minConfidence,
          cite_policy: citePolicy,
          omission_scan,
          reflex_profile: reflexProfile,
        } as any);

        if (Array.isArray(agentFrames) && agentFrames.length > 0) {
          frames = agentFrames;
          setSource("agent");
        } else {
          const localFrames = await runReflexAnalysis(input);
          frames = localFrames;
          setSource("local");
          setNotice("Agent returned no detections—showing local analysis instead.");
        }
      } else {
        const localFrames = await runReflexAnalysis(input);
        frames = localFrames;
        setSource("local");
      }

      setReflexFrames(frames);
      setAnalysisCount((n) => n + 1);
    } catch (err) {
      console.error("🚨 Analysis failed:", err);
      setReflexFrames([]);
      setSource(null);
      setNotice("Analysis failed. Please try again or switch source.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#e9eef5] py-10">
      {/* Bubble ambience */}
      <div className="bubble-bg">
        {[
          "epistemic humility",
          "source, then claim",
          "no false precision",
          "seek disconfirming evidence",
          "explain uncertainty",
          "avoid vague authority",
          "cite or qualify",
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
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <h1 className="text-3xl font-bold text-slate-900">Analyze a Statement</h1>
          <p className="mt-2 text-slate-700">
            Paste any text—or a URL—to reveal hidden assumptions, emotional manipulation,
            semantic patterns, and missing context. This also handles <strong>Scientific Paper Checks</strong> and{" "}
            <strong>Link &amp; Article Audits</strong>.
          </p>

          {/* INPUT */}
          <div className="mt-6 space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isAnalyzing}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={6}
              placeholder="Paste a paragraph, a link to an article, or a snippet from a methods section…"
            />

            {/* PRESETS */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-600">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset("fast")}
                className="px-3 py-1 rounded-lg"
                title="--direct · low · min_conf≈0.55 · cite=off · omission=false · lenient"
                style={{
                  background: "#e9eef5",
                  boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff",
                }}
                disabled={isAnalyzing}
              >
                Fast skim
              </button>
              <button
                type="button"
                onClick={() => applyPreset("balanced")}
                className="px-3 py-1 rounded-lg"
                title="--careful · medium · min_conf≈0.65 · cite=auto · omission=auto · default"
                style={{
                  background: "#e9eef5",
                  boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff",
                }}
                disabled={isAnalyzing}
              >
                Balanced review
              </button>
              <button
                type="button"
                onClick={() => applyPreset("audit")}
                className="px-3 py-1 rounded-lg"
                title="--careful · high · min_conf≥0.75 · cite=force · omission=true · strict"
                style={{
                  background: "#e9eef5",
                  boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff",
                }}
                disabled={isAnalyzing}
              >
                Audit-grade
              </button>
            </div>

            {/* CONTROLS */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Left: source + basics */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "#e9eef5",
                  boxShadow:
                    "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff",
                }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 text-sm text-slate-600" title={TOOLTIPS.useAgent}>
                    <input
                      type="checkbox"
                      checked={useAgent}
                      onChange={(e) => setUseAgent(e.target.checked)}
                      disabled={!hasAgent || isAnalyzing}
                    />
                    Use AWS Agent
                    {!hasAgent && (
                      <span className="ml-1 text-xs text-slate-500">
                        (no VITE_AGENT_API_BASE — using local engine)
                      </span>
                    )}
                  </label>

                  <label className="text-sm text-slate-600" title={TOOLTIPS.mode}>
                    Mode{" "}
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

                  <label className="text-sm text-slate-600" title={TOOLTIPS.stakes}>
                    Stakes{" "}
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
                </div>

                <div className="mt-3" title={TOOLTIPS.min_confidence}>
                  <label className="block text-sm text-slate-600">
                    Min confidence: <strong>{minConfidence.toFixed(2)}</strong>
                  </label>
                  <input
                    type="range"
                    min="0.45"
                    max="0.95"
                    step="0.05"
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(Number(e.target.value))}
                    className="w-full"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              {/* Right: policy */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "#e9eef5",
                  boxShadow:
                    "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff",
                }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-sm text-slate-600" title={TOOLTIPS.cite_policy}>
                    Cite policy{" "}
                    <select
                      value={citePolicy}
                      onChange={(e) => setCitePolicy(e.target.value as CitePolicy)}
                      className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                      disabled={isAnalyzing}
                    >
                      <option value="auto">auto</option>
                      <option value="force">force</option>
                      <option value="off">off</option>
                    </select>
                  </label>

                  <label className="text-sm text-slate-600" title={TOOLTIPS.omission_scan}>
                    Omission scan{" "}
                    <select
                      value={omissionUI}
                      onChange={(e) =>
                        setOmissionUI(e.target.value as "auto" | "true" | "false")
                      }
                      className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                      disabled={isAnalyzing}
                    >
                      <option value="auto">auto</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </label>

                  <label className="text-sm text-slate-600" title={TOOLTIPS.reflex_profile}>
                    Reflex profile{" "}
                    <select
                      value={reflexProfile}
                      onChange={(e) =>
                        setReflexProfile(e.target.value as "default" | "strict" | "lenient")
                      }
                      className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                      disabled={isAnalyzing}
                    >
                      <option value="default">default</option>
                      <option value="strict">strict</option>
                      <option value="lenient">lenient</option>
                    </select>
                  </label>

                  <button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || isAnalyzing}
                    className="ml-auto px-6 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isAnalyzing ? "Analyzing…" : "Run Analysis"}
                  </button>
                </div>
              </div>
            </div>

            {/* Handshake summary line */}
            <div className="text-xs text-slate-700 mt-2">
              <span className="font-medium">Handshake</span> · mode=
              <code>{previewHandshake.mode}</code> · stakes=
              <code>{previewHandshake.stakes}</code> · min_confidence=
              <code>{previewHandshake.min_confidence}</code> · cite_policy=
              <code>{previewHandshake.cite_policy}</code> · omission_scan=
              <code>{String(previewHandshake.omission_scan)}</code> · reflex_profile=
              <code>{previewHandshake.reflex_profile}</code>
            </div>

            {/* Status + notices */}
            <div className="text-xs text-slate-600">
              {analysisCount > 0 && (
                <>
                  Runs: {analysisCount} · Source:{" "}
                  <span
                    className="px-2 py-[2px] rounded-md"
                    style={{
                      background: "#e9eef5",
                      boxShadow:
                        "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff",
                    }}
                  >
                    {source ?? "—"}
                  </span>
                </>
              )}
            </div>
            {notice && (
              <div
                className="mt-2 text-xs text-slate-700 px-3 py-2 rounded-lg"
                style={{
                  background: "#e9eef5",
                  boxShadow:
                    "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff",
                }}
              >
                {notice}
              </div>
            )}
          </div>

          {/* RESULTS */}
          {reflexFrames.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <p className="text-sm text-slate-600">Found {reflexFrames.length} detections</p>

              <div className="grid gap-4">
                {reflexFrames.map((frame, index) => (
                  <div
                    key={`${frame.reflexId}-${index}`}
                    className="p-4 rounded-2xl bg-[#e9eef5]"
                    style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{frame.reflexLabel}</h3>
                      {source && (
                        <span
                          className="text-[10px] uppercase tracking-wide px-2 py-[2px] rounded-md"
                          style={{
                            background: "#e9eef5",
                            boxShadow:
                              "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff",
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
                      Confidence: {Math.round(((frame.confidence ?? 0) as number) * 100)}% • Reflex ID: {frame.reflexId}
                    </p>
                  </div>
                ))}
              </div>
<AnalysisReport
  frames={reflexFrames}
  inputSample={input}
  handshakeLine={`Handshake · mode=${previewHandshake.mode} · stakes=${previewHandshake.stakes} · min_conf=${previewHandshake.min_confidence} · cite_policy=${previewHandshake.cite_policy} · omission_scan=${String(previewHandshake.omission_scan)} · profile=${previewHandshake.reflex_profile}`}
/>
              <CoFirePanel reflexes={reflexFrames} />
            </div>
          )}

          {analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && (
            <div
              className="mt-8 p-4 rounded-2xl bg-[#e9eef5]"
              style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
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


