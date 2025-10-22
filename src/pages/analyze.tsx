// src/pages/analyze.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useVXContext } from "@/context/VXProvider";
import runReflexAnalysis from "@/lib/analysis/runReflexAnalysis";
import { callAgentSummarize } from "@/lib/llmClient";
import { agentChat, agentFetchUrl, type ChatMessage } from "@/lib/agentClient";
import { buildHandshake, type Mode, type Stakes, type CitePolicy } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";
import AnalysisReport from "@/components/AnalysisReport";

// Small help chip (kept for tooltips in Chat tab)
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

const AnalyzePage: React.FC = () => {
  const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();

  // Keep active tab in the URL so F5 preserves it
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "analyze" | "chat") ?? "analyze";
  const [activeTab, setActiveTab] = useState<"analyze" | "chat">(initialTab);

  useEffect(() => {
    // use replace:true so this update doesn't create a new history entry
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", activeTab);
      return next;
    }, { replace: true });
  }, [activeTab, setSearchParams]);

  // ANALYZE tab state
  const [input, setInput] = useState("");
  const [analysisCount, setAnalysisCount] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [reportText, setReportText] = useState<string>("");

  async function handleAnalyze() {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setReflexFrames([]);
    setReportText("");
    setNotice(null);

    try {
      const frames = await runReflexAnalysis(input);
      setReflexFrames(frames);
      if (!frames || frames.length === 0) {
        setNotice("No detections found. Try stronger certainty claims, unnamed authorities, or sweeping generalizations.");
      }
      setAnalysisCount((n) => n + 1);
    } catch (e) {
      console.error("Analysis failed:", e);
      setReflexFrames([]);
      setNotice(`Analysis failed: ${(e as Error).message}. Check console for details.`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleGenerateReport() {
    // Optional: agent summary from frames; will show a friendly message if unavailable
    try {
      const { reportText } = await callAgentSummarize({
        inputText: input,
        frames: reflexFrames,
        // Use a careful/strict handshake by default for summaries
        handshakeOverrides: {
          mode: "--careful",
          stakes: "high",
          min_confidence: 0.75,
          cite_policy: "force",
          omission_scan: true,
          reflex_profile: "strict",
        },
      });
      setReportText(reportText);
    } catch (e) {
      console.error("summarize failed:", e);
      setReportText("Report service unavailable. (Tip: you can still export frames and use the on-page summary.)");
    }
  }

  return (
    <div className="relative min-h-screen bg-[#e9eef5] py-10">
      <div className="relative max-w-6xl mx-auto px-4">
        <BackButton fallback="/" />

        {/* Header + Tabs */}
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
                Paste text under <strong>Analyze</strong> to reveal logical fallacies such as assumptions, emotional
                manipulation, and troubling semantic patterns. Our <strong>AI agent</strong> also, independently,
                dissects <strong>Scientific Papers</strong> for invalid methods and faulty conclusions — or paste a URL —
                for <strong>Article Audits</strong>.
              </p>
            </div>

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
                  {tab === "analyze" ? "Analyze" : "Chat with Our Agent"}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: Analyze (simple: textarea + run) */}
          {activeTab === "analyze" && (
            <>
              <div className="mt-6 space-y-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isAnalyzing}
                  className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={6}
                  placeholder="Paste a paragraph, a link to an article, or a snippet from a methods section…"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || isAnalyzing}
                    className="px-6 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
                    title="Run local analysis with stringent fallacy/reflex detection."
                  >
                    {isAnalyzing ? "Analyzing…" : "Run Analysis"}
                  </button>
                </div>

                {/* Status + notice */}
                <div className="text-xs text-slate-600">
                  {analysisCount > 0 && <>Runs: {analysisCount}</>}
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
                            <span
                              className="text-[10px] uppercase tracking-wide px-2 py-[2px] rounded-md"
                              style={{ background: "#e9eef5", boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff" }}
                              title="Frames from local analysis engine"
                            >
                              local
                            </span>
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

                  {/* REPORT (optional agent summarize) */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleGenerateReport}
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition"
                      title="Ask the agent to compose a narrative summary from detected frames."
                    >
                      Generate Report
                    </button>
                  </div>

                  <AnalysisReport
                    frames={reflexFrames}
                    inputSample={input}
                    sectionScores={[]} // minimal Analyze tab
                    reportText={reportText}
                    handshakeLine={`(Summary uses careful/strict defaults)`}
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

          {/* TAB: Chat with Our Agent (handshake controls live here) */}
          {activeTab === "chat" && <ChatPanel />}
        </div>
      </div>
    </div>
  );
};

/** Chat panel with strict defaults + URL auto-fetch + clearer errors */
const ChatPanel: React.FC = () => {
  type RolePlus = ChatMessage["role"] | "tool";
  type ChatMsg = { role: RolePlus; text: string; frames?: any[]; tools?: any[] };
  const STORAGE_KEY = "tsca_chat_history_v1";

  // Robust/strict defaults per your request
  const [mode, setMode] = useState<Mode>("--careful");
  const [stakes, setStakes] = useState<Stakes>("high");
  const [minConfidence, setMinConfidence] = useState<number>(0.75);
  const [citePolicy, setCitePolicy] = useState<CitePolicy>("force");
  const [omissionUI, setOmissionUI] = useState<"auto" | "true" | "false">("true");
  const omission_scan: "auto" | boolean = omissionUI === "auto" ? "auto" : omissionUI === "true";
  const [reflexProfile, setReflexProfile] = useState<"default" | "strict" | "lenient">("strict");

  const [history, setHistory] = useState<ChatMsg[]>([]);
  const [text, setText] = useState(""); // start empty, use placeholder
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted chat on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setHistory(parsed as ChatMsg[]);
      }
    } catch {/* ignore */}
  }, []);

  // Persist chat after each change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {/* ignore */}
  }, [history]);

  // NEW: autoscroll to latest message
  const threadRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history]);

  const looksLikeUrl = (s: string) => /^https?:\/\/\S+/i.test(s.trim());

  function formatError(e: any) {
    const msg = e?.message || e?.toString?.() || "Unknown error";
    if (/Failed to fetch|NetworkError|TypeError/i.test(msg)) {
      return `${msg}. Tip: open the app on http://localhost:8888 (Netlify Dev) or your live Netlify URL so the /agent/* functions work.`;
    }
    const status = e?.response?.status ? ` (${e.response.status} ${e.response.statusText || ""})` : "";
    return `${msg}${status}`;
  }

  async function fetchUrlToHistory(url: string) {
    setBusy(true);
    setError(null);
    try {
      const data = await agentFetchUrl(url);
      const plain = String(data?.text ?? "").slice(0, 4000);
      setHistory((h) => [...h, { role: "tool", text: `fetch_url(${url}) →\n\n${plain}` }]);
    } catch (e: any) {
      setError(formatError(e));
    } finally {
      setBusy(false);
      setText("");
    }
  }

  // NEW: reset chat thread + localStorage
  function resetChat() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {/* ignore */}
    setHistory([]);
    setError(null);
    // optional: scroll to top
    if (threadRef.current) threadRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Presets for the Chat tab only
  function applyPreset(p: "quick" | "careful" | "audit") {
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
  }

  return (
    <div className="mt-6 grid gap-4">
      {/* Controls live here (not in Analyze) */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#e9eef5", boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
      >
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-slate-700">
            Presets
            <Help text="Quick = low stakes, permissive; Careful = balanced defaults; Audit = strict, high-stakes guardrails." />
            :
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

        <div className="mt-3 flex items-center gap-3 flex-wrap text-sm text-slate-600">
          <label>
            Mode{" "}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
              disabled={busy}
            >
              <option value="--direct">--direct</option>
              <option value="--careful">--careful</option>
              <option value="--recap">--recap</option>
            </select>
          </label>

          <label>
            Stakes{" "}
            <select
              value={stakes}
              onChange={(e) => setStakes(e.target.value as Stakes)}
              className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
              disabled={busy}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            Min conf: <strong>{minConfidence.toFixed(2)}</strong>
            <input
              type="range"
              min="0.45"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="align-middle"
              disabled={busy}
            />
          </label>

          <label>
            Cite{" "}
            <select
              value={citePolicy}
              onChange={(e) => setCitePolicy(e.target.value as CitePolicy)}
              className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
              disabled={busy}
            >
              <option value="auto">auto</option>
              <option value="force">force</option>
              <option value="off">off</option>
            </select>
          </label>

          <label>
            Omission{" "}
            <select
              value={omissionUI}
              onChange={(e) => setOmissionUI(e.target.value as "auto" | "true" | "false")}
              className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
              disabled={busy}
            >
              <option value="auto">auto</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>

          <label>
            Profile{" "}
            <select
              value={reflexProfile}
              onChange={(e) => setReflexProfile(e.target.value as "default" | "strict" | "lenient")}
              className="ml-1 rounded-md border border-slate-300 px-2 py-[2px] bg-white"
              disabled={busy}
            >
              <option value="default">default</option>
              <option value="strict">strict</option>
              <option value="lenient">lenient</option>
            </select>
          </label>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={async () => {
            const url = prompt("Enter a URL to fetch via /agent/fetch-url:");
            if (url) await fetchUrlToHistory(url);
          }}
          className="px-3 py-2 rounded-xl border hover:bg-gray-50"
          title="Invoke /agent/fetch-url and append the cleaned text as a tool message."
          disabled={busy}
        >
        fetch-url
        </button>

        {/* NEW: Reset chat */}
        <button
          onClick={resetChat}
          className="px-3 py-2 rounded-xl border hover:bg-gray-50"
          title="Clear the chat thread and local storage."
          disabled={busy || history.length === 0}
        >
          reset chat
        </button>
      </div>

      {/* Conversation (moved ABOVE the lines/button/textarea so its border/shadow can't act like a divider) */}
      <div
        className="border rounded-2xl bg-[#e9eef5] p-3"
        style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
      >
        <div
          ref={threadRef}
          className="max-h-[50vh] overflow-auto space-y-3"
        >
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

      {/* Simple straight line */}
      <hr className="my-3 border-black" />

      {/* Send button ABOVE the textarea, left-aligned */}
      <div className="flex">
        <button
          onClick={async () => {
            const content = text.trim();
            if (!content) return;
            // If it looks like a URL, run fetch-url shortcut
            if (/^https?:\/\/\S+/i.test(content)) {
              await fetchUrlToHistory(content);
              return;
            }
            // Else send normally
            const priorHistory = history
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map(({ role, text }) => ({ role: role as ChatMessage["role"], text }));

            setBusy(true);
            setError(null);

            try {
              const userMsg = { role: "user" as const, text: content };
              const nextHist = [...history, userMsg];
              setHistory(nextHist);

              const userFrames = await runReflexAnalysis(content);
              nextHist[nextHist.length - 1] = { ...userMsg, frames: userFrames };
              setHistory([...nextHist]);

              // strict defaults
              const hs = buildHandshake(codex as any, {
                mode,
                stakes,
                min_confidence: minConfidence,
                cite_policy: citePolicy,
                omission_scan,
                reflex_profile: reflexProfile,
              });

              const resp = await agentChat(content, priorHistory, {
                mode: hs.mode,
                stakes: hs.stakes,
                min_confidence: hs.min_confidence,
                cite_policy: hs.cite_policy,
                omission_scan: hs.omission_scan,
                reflex_profile: hs.reflex_profile,
                codex_version: hs.codex_version,
              });

              const assistantText = String(resp?.message ?? "").trim() || "(no reply)";
              const assistantMsg = { role: "assistant" as const, text: assistantText, tools: resp?.tools ?? [] };
              (assistantMsg as any).frames = await runReflexAnalysis(assistantText);
              setHistory((h) => [...h, assistantMsg]);
            } catch (e: any) {
              const msg = e?.message || e?.toString?.() || "Unknown error";
              if (/Failed to fetch|NetworkError|TypeError/i.test(msg)) {
                setError(`${msg}. Tip: open the app on http://localhost:8888 (Netlify Dev) or your live Netlify URL so the /agent/* functions work.`);
              } else {
                const status = e?.response?.status ? ` (${e.response.status} ${e.response.statusText || ""})` : "";
                setError(`${msg}${status}`);
              }
            } finally {
              setBusy(false);
              setText("");
            }
          }}
          disabled={busy || !text.trim()}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send"}
        </button>
      </div>

      {/* Optional second straight line */}
      <hr className="my-3 border-black" />

      {/* Textarea ONLY */}
      <div className="mt-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm resize-none max-h-40 overflow-auto whitespace-pre-wrap break-words break-all md:break-words"
          placeholder="Paste a URL or ask a question. (Typing a URL here will auto-run fetch-url.)"
          rows={3}
          disabled={busy}
        />
      </div>

      {error && <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">{error}</div>}
    </div>
  );
};

export default AnalyzePage;


