// src/pages/analyze.tsx
import React, { useMemo, useState } from "react";
import { useVXContext } from "@/context/VXProvider";
import runReflexAnalysis from "@/lib/analysis/runReflexAnalysis";
import { callAgentSummarize, callAgentAnalyze } from "@/lib/llmClient";
import { agentChat, agentFetchUrl, type ChatMessage } from "@/lib/agentClient"; // ← use agentChat
import { buildHandshake, type Mode, type Stakes, type CitePolicy } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";
import AnalysisReport from "@/components/AnalysisReport";
import { chunkByHeadings, chunkByWindow, aggregateFrames, type DocChunk } from "@/lib/longdoc";
// NOTE: bubbles removed from Analyze page (moved to Education Hub)
// import "@/styles.css";

const Help = ({ text }: { text: string }) => (
  <span
    title={text}
    aria-label={text}
    className="ml-1 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 text-[10px] leading-none text-slate-600 px-1.5 py-[1px] cursor-help align-middle"
    style={{ transform: "translateY(-1px)" }}
  >
    ?
  </span>
);

type SourceKind = "agent" | "local" | null;

const AnalyzePage = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
  const [input, setInput] = useState("");
  const [analysisCount, setAnalysisCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"analyze" | "chat">("analyze");

  // Handshake state
  const [mode, setMode] = useState<Mode>("--careful");
  const [stakes, setStakes] = useState<Stakes>("medium");
  const [minConfidence, setMinConfidence] = useState<number>(0.6);
  const [citePolicy, setCitePolicy] = useState<CitePolicy>("auto");
  const [omissionUI, setOmissionUI] = useState<"auto" | "true" | "false">("auto");
  const omission_scan: "auto" | boolean = omissionUI === "auto" ? "auto" : omissionUI === "true";
  const [reflexProfile, setReflexProfile] = useState<"default" | "strict" | "lenient">("default");

  const hasAgent =
    !!(import.meta as any).env?.VITE_AGENT_API_BASE &&
    String((import.meta as any).env.VITE_AGENT_API_BASE).trim().length > 0;
  const [useAgent, setUseAgent] = useState<boolean>(hasAgent);

  // Long-Doc Mode
  const [longDoc, setLongDoc] = useState(false);
  const [chunkStrategy, setChunkStrategy] = useState<"headings" | "window">("headings");
  const [sectionScores, setSectionScores] = useState<Array<{ label: string; count: number }>>([]);

  const [reportText, setReportText] = useState<string>("");

  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<SourceKind>(null);

  const previewHandshake = useMemo(
    () =>
      buildHandshake(codex as any, {
        mode,
        stakes,
        min_confidence: minConfidence,
        cite_policy: citePolicy,
        omission_scan,
        reflex_profile: reflexProfile,
      }),
    [mode, stakes, minConfidence, citePolicy, omission_scan, reflexProfile]
  );

  const applyPreset = (p: "quick" | "careful" | "audit") => {
    if (p === "quick") {
      setMode("--direct");
      setStakes("low");
      setMinConfidence(0.55);
      setCitePolicy("off");
      setOmissionUI("false");
      setReflexProfile("lenient");
    } else if (p === "careful") {
      setMode("--careful");
      setStakes("medium");
      setMinConfidence(0.6);
      setCitePolicy("auto");
      setOmissionUI("auto");
      setReflexProfile("default");
    } else {
      setMode("--careful");
      setStakes("high");
      setMinConfidence(0.75);
      setCitePolicy("force");
      setOmissionUI("true");
      setReflexProfile("strict");
    }
  };

  const analyzeChunk = async (text: string) => {
    if (useAgent && hasAgent) {
      try {
        const agentFrames = await callAgentAnalyze({
          text,
          mode,
          stakes,
          min_confidence: minConfidence,
          cite_policy: citePolicy,
          omission_scan,
          reflex_profile: reflexProfile,
        });
        return agentFrames;
      } catch {
        return await runReflexAnalysis(text);
      }
    }
    return await runReflexAnalysis(text);
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setReflexFrames([]);
    setSectionScores([]);
    setReportText("");
    setNotice(null);
    setSource(null);

    try {
      let frames: any[] = [];

      if (longDoc) {
        const chunks: DocChunk[] =
          chunkStrategy === "headings"
            ? chunkByHeadings(input)
            : chunkByWindow(input, { windowSize: 1800, overlap: 200 });

        const perSection: Array<{ label: string; frames: any[]; chunkId: string }> = [];
        for (const c of chunks) {
          const f = await analyzeChunk(c.text);
          const labeled = f.map((fr) => ({ ...fr, chunkId: c.id }));
          perSection.push({
            label: c.title ?? `Section ${perSection.length + 1}`,
            frames: labeled,
            chunkId: c.id,
          });
        }

        const allFrames = perSection.flatMap((s) => s.frames);
        const _agg = aggregateFrames(allFrames);
        const scoreboard = perSection.map((s) => ({ label: s.label, count: s.frames.length }));

        frames = allFrames;
        setSectionScores(scoreboard);
        setSource(useAgent && hasAgent ? "agent" : "local");
      } else {
        const f = await analyzeChunk(input);
        frames = f;
        setSource(useAgent && hasAgent ? "agent" : "local");
      }

      if ((!frames || frames.length === 0) && useAgent) {
        const local = await runReflexAnalysis(input);
        frames = local;
        setSource("local");
        setNotice("Agent returned no detections—showing local analysis instead.");
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

  const handleGenerateReport = async () => {
    try {
      const { reportText } = await callAgentSummarize({
        inputText: input,
        frames: reflexFrames,
        handshakeOverrides: {
          mode,
          stakes,
          min_confidence: minConfidence,
          cite_policy: citePolicy,
          omission_scan,
          reflex_profile: reflexProfile,
        },
      });
      setReportText(reportText);
    } catch (e) {
      console.error("summarize failed:", e);
      setReportText(
        "Report service unavailable. (Tip: you can still export frames and use the on-page summary.)"
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#e9eef5] py-10">
      <div className="relative max-w-6xl mx-auto px-4">
        <BackButton />

        {/* Top header + tabs */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "#e9eef5",
            boxShadow: "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analyze a Statement</h1>
              <p className="mt-2 text-slate-700">
                Paste text—or a URL—to reveal assumptions, emotional manipulation, semantic patterns, and missing context.
                This also handles <strong>Scientific Paper Checks</strong> and <strong>Link &amp; Article Audits</strong>.
              </p>
            </div>

            {/* Tabs */}
            <div
              className="flex items-center gap-1 p-1 rounded-2xl"
              style={{ background: "#e9eef5", boxShadow: "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff" }}
            >
              {(["analyze", "chat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    activeTab === tab ? "bg-slate-900 text-white" : "text-slate-700"
                  }`}
                  style={
                    activeTab !== tab
                      ? { boxShadow: "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff" }
                      : {}
                  }
                >
                  {tab === "analyze" ? "Analyze" : "Chat"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "analyze" && (
            <>
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
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-700">
                    Presets<Help text="Quick = low stakes, permissive; Careful = balanced defaults; Audit = strict, high-stakes guardrails." />:
                  </span>
                  <button
                    onClick={() => applyPreset("quick")}
                    className="px-2 py-1 rounded-md"
                    style={{ background: "#e9eef5", boxShadow: "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff" }}
                  >
                    Quick
                  </button>
                  <button
                    onClick={() => applyPreset("careful")}
                    className="px-2 py-1 rounded-md"
                    style={{ background: "#e9eef5", boxShadow: "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff" }}
                  >
                    Careful
                  </button>
                  <button
                    onClick={() => applyPreset("audit")}
                    className="px-2 py-1 rounded-md"
                    style={{ background: "#e9eef5", boxShadow: "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff" }}
                  >
                    Audit
                  </button>
                </div>

                {/* CONTROLS */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left: source + basics */}
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "#e9eef5", boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={useAgent}
                          onChange={(e) => setUseAgent(e.target.checked)}
                          disabled={!hasAgent || isAnalyzing}
                        />
                        Use AWS Agent
                        {!hasAgent && <span className="ml-1 text-xs text-slate-500">(no VITE_AGENT_API_BASE — using local engine)</span>}
                      </label>

                      <label className="text-sm text-slate-600">
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

                      <label className="text-sm text-slate-600">
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

                    <div className="mt-3">
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

                    {/* Long-Doc */}
                    <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={longDoc}
                          onChange={(e) => setLongDoc(e.target.checked)}
                          disabled={isAnalyzing}
                        />
                        Long-Doc Mode
                      </label>
                      {longDoc && (
                        <label>
                          Strategy{" "}
                          <select
                            value={chunkStrategy}
                            onChange={(e) => setChunkStrategy(e.target.value as any)}
                            className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                            disabled={isAnalyzing}
                          >
                            <option value="headings">by headings (##)</option>
                            <option value="window">by window (≈1800/200)</option>
                          </select>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Right: policy */}
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "#e9eef5", boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="text-sm text-slate-600">
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

                      <label className="text-sm text-slate-600">
                        Omission scan{" "}
                        <select
                          value={omissionUI}
                          onChange={(e) => setOmissionUI(e.target.value as "auto" | "true" | "false")}
                          className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
                          disabled={isAnalyzing}
                        >
                          <option value="auto">auto</option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      </label>

                      <label className="text-sm text-slate-600">
                        Reflex profile{" "}
                        <select
                          value={reflexProfile}
                          onChange={(e) => setReflexProfile(e.target.value as "default" | "strict" | "lenient")}
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
                        title="Run the selected source (Agent or Local) using the current handshake settings."
                      >
                        {isAnalyzing ? "Analyzing…" : "Run Analysis"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Handshake summary */}
                <div className="text-xs text-slate-700 mt-2">
                  <span className="font-medium">Handshake</span> · mode=<code>{previewHandshake.mode}</code> · stakes=
                  <code>{previewHandshake.stakes}</code> · min_confidence=
                  <code>{previewHandshake.min_confidence}</code> · cite_policy=
                  <code>{previewHandshake.cite_policy}</code> · omission_scan=
                  <code>{String(previewHandshake.omission_scan)}</code> · profile=
                  <code>{previewHandshake.reflex_profile}</code>
                </div>

                {/* Status + notices */}
                <div className="text-xs text-slate-600">
                  {analysisCount > 0 && (
                    <>
                      Runs: {analysisCount} · Source:{" "}
                      <span
                        className="px-2 py-[2px] rounded-md"
                        style={{ background: "#e9eef5", boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff" }}
                      >
                        {source ?? "—"}
                      </span>
                    </>
                  )}
                </div>
                {notice && (
                  <div
                    className="mt-2 text-xs text-slate-700 px-3 py-2 rounded-lg"
                    style={{ background: "#e9eef5", boxShadow: "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff" }}
                  >
                    {notice}
                  </div>
                )}
              </div>

              {/* RESULTS */}
              {reflexFrames.length > 0 && (
                <>
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
                            <h3 className="font-semibold text-lg">{frame.reflexLabel ?? frame.reflexId}</h3>
                            {source && (
                              <span
                                className="text-[10px] uppercase tracking-wide px-2 py-[2px] rounded-md"
                                style={{ background: "#e9eef5", boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff" }}
                                title={`Frames from ${source} engine`}
                              >
                                {source}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 mt-1">{frame.rationale ?? (frame as any).reason}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Confidence: {Math.round(((frame.confidence ?? 0) as number) * 100)}% • Reflex ID: {frame.reflexId}
                          </p>
                        </div>
                      ))}
                    </div>

                    <CoFirePanel reflexes={reflexFrames} />
                  </div>

                  {/* REPORT */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleGenerateReport}
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition"
                    >
                      Generate Report
                    </button>
                  </div>

                  <AnalysisReport
                    frames={reflexFrames}
                    inputSample={input}
                    sectionScores={sectionScores}
                    reportText={reportText}
                    handshakeLine={`Handshake · mode=${previewHandshake.mode} · stakes=${previewHandshake.stakes} · min_conf=${previewHandshake.min_confidence} · cite_policy=${previewHandshake.cite_policy} · omission_scan=${String(
                      previewHandshake.omission_scan
                    )} · profile=${previewHandshake.reflex_profile}`}
                  />
                </>
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
            </>
          )}

          {activeTab === "chat" && <ChatPanel buildHandshake={() => previewHandshake} />}
        </div>
      </div>
    </div>
  );
};

const ChatPanel: React.FC<{ buildHandshake: () => any }> = ({ buildHandshake }) => {
  type RolePlus = ChatMessage["role"] | "tool"; // allow local tool messages
  type ChatMsg = { role: RolePlus; text: string; frames?: any[]; tools?: any[] };

  const [history, setHistory] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("Paste a URL or ask a question. The agent may call fetch-url.");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);

    const priorHistory = history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map(({ role, text }) => ({ role: role as ChatMessage["role"], text }));

    const userMsg: ChatMsg = { role: "user", text };
    const nextHist: ChatMsg[] = [...history, userMsg];
    setHistory(nextHist);

    try {
      const userFrames = await runReflexAnalysis(text);
      nextHist[nextHist.length - 1] = { ...userMsg, frames: userFrames };
      setHistory([...nextHist]);

      const hs = buildHandshake();
      const resp = await agentChat({
        text,
        history: priorHistory,
        mode: hs.mode,
        stakes: hs.stakes,
        min_confidence: hs.min_confidence,
        cite_policy: hs.cite_policy,
        omission_scan: hs.omission_scan,
        reflex_profile: hs.reflex_profile,
        codex_version: hs.codex_version,
      });

      const assistantText = String(resp?.message ?? "").trim() || "(no reply)";
      const assistantMsg: ChatMsg = { role: "assistant", text: assistantText, tools: resp?.tools ?? [] };
      const asFrames = await runReflexAnalysis(assistantText);
      assistantMsg.frames = asFrames;

      setHistory((h) => [...h, assistantMsg]);
    } catch (e: any) {
      setError(e?.message || "Agent error");
    } finally {
      setBusy(false);
      setText("");
    }
  }

  async function fetchUrlFromBox() {
    const url = prompt("Enter a URL to fetch via /agent/fetch-url:");
    if (!url) return;
    setBusy(true);
    try {
      const data = await agentFetchUrl(url);
      const plain = String(data?.text ?? "").slice(0, 4000);
      setHistory((h) => [...h, { role: "tool", text: `fetch_url(${url}) →\n\n${plain}` }]);
    } catch (e: any) {
      setError(e?.message || "fetch-url error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 grid gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={fetchUrlFromBox}
          className="px-3 py-2 rounded-xl border hover:bg-gray-50"
          title="Invoke /agent/fetch-url and append the cleaned text as a tool message."
        >
          fetch-url
        </button>
      </div>

      <div
        className="border rounded-2xl bg-[#e9eef5] p-3"
        style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
      >
        <div className="max-h-[50vh] overflow-auto space-y-3">
          {history.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{ background: m.role === "user" ? "#f4f6fb" : m.role === "assistant" ? "#eef2f8" : "#fff7ed" }}
            >
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{m.role}</div>
              <pre className="whitespace-pre-wrap text-sm text-slate-800">{m.text}</pre>

              {m.role === "assistant" && m.tools && m.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.tools.map((t: any, idx: number) => (
                    <span key={idx} className="text-[10px] px-2 py-1 rounded-md border bg-white/70">
                      {t.name}
                      {t.args?.url ? `: ${t.args.url}` : ""}
                      {typeof t.duration_ms === "number" ? ` · ${t.duration_ms}ms` : ""}
                    </span>
                  ))}
                </div>
              )}

              {m.frames && m.frames.length > 0 && (
                <div className="mt-2 text-xs text-slate-600">Frames: {m.frames.length}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-xl p-3 text-sm"
          placeholder="Say something… (URLs will trigger fetch-url)"
          rows={3}
          disabled={busy}
        />
        <button
          onClick={send}
          disabled={busy || !text.trim()}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send"}
        </button>
      </div>

      {error && <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">{error}</div>}
    </div>
  );
};

export default AnalyzePage;

