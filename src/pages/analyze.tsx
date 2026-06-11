// src/pages/analyze.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useVXContext } from "@/context/VXProvider";
import runReflexAnalysis from "@/lib/analysis/runReflexAnalysis";
import { callAgentSummarize } from "@/lib/llmClient";
import { agentChat, agentFetchUrl, type ChatMessage } from "@/lib/agentClient";
import { buildHandshake, type Mode, type Stakes, type CitePolicy } from "@/lib/codex-runtime";
import { useConversationSession } from "@/hooks/useConversationSession";
import codex from "@/data/front-end-codex.v0.9.json";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";
import AnalysisReport from "@/components/AnalysisReport";
import { isLikelyUrl } from "@/utils/urlContext"; // still handy

// --- tiny retry helper for throttles (429/500) ---
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let delay = 300;
  for (let i = 0; i < 2; i++) {
    try {
      return await fn();
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (!/\b(429|500)\b/.test(msg)) throw e;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  return fn(); // final attempt
}

// Small help chip (kept for tooltips in Chat tab)
const Help = ({ text }: { text: string }) => (
  <span
    title={text}
    aria-label={text}
    className="ml-1 inline-flex items-center justify-center rounded-full border border-ins-soft bg-ins-deep text-[10px] leading-none text-ins-dim px-1.5 py-[1px] cursor-help align-middle"
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
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", activeTab);
        return next;
      },
      { replace: true }
    );
  }, [activeTab, setSearchParams]);

  // ANALYZE tab state
  const [input, setInput] = useState("");
  const [analysisCount, setAnalysisCount] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [reportText, setReportText] = useState<string>("");
  const [processedInput, setProcessedInput] = useState<string>(""); // remember fetched/clipped text
  const [isFetching, setIsFetching] = useState(false); // guard against double-fire

  // runAnalyze accepts override text and avoids re-reading state
  async function runAnalyze(inputOverride?: string) {
    if (isAnalyzing) return; // simple client-side rate limit
    setIsAnalyzing(true);
    setReflexFrames([]);
    setNotice(null);
    try {
      const textForModel = (inputOverride ?? input ?? "").slice(0, 20000);
      if (!textForModel.trim()) {
        setNotice("Nothing to analyze.");
        return;
      }
      setProcessedInput(textForModel); // used by "Generate Report"
      const frames = await runReflexAnalysis(textForModel);
      setReflexFrames(frames);
      if (!frames || frames.length === 0) {
        setNotice(
          "No detections found. Try stronger certainty claims, unnamed authorities, or sweeping generalizations."
        );
      }
      setAnalysisCount((n) => n + 1);
    } catch (e: any) {
      console.error("Analysis failed:", e);
      setReflexFrames([]);
      setNotice(`Analysis failed: ${e?.message || String(e)}. Check console for details.`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleAnalyze() {
    const raw = input.trim();
    if (!raw) return;

    // If a URL is pasted, fetch it first, drop into the box, then run exactly once.
    if (isLikelyUrl(raw)) {
      if (isFetching || isAnalyzing) return;
      setIsFetching(true);
      setNotice(null);
      try {
        const { text } = await withRetry(() => agentFetchUrl(raw));
        if (text && text.length) {
          setInput(text);
          // run analysis just once on the fetched text
          await runAnalyze(text);
        } else {
          setNotice("Fetched page didn’t contain readable text.");
        }
      } catch (e: any) {
        const msg = String(e?.message || e);
        if (/403|blocked server requests/i.test(msg)) {
          setNotice("That site blocks server fetches. Try copy/paste the article text.");
        } else {
          setNotice(`Fetch failed: ${msg}`);
        }
      } finally {
        setIsFetching(false);
      }
      return;
    }

    // Otherwise, analyze the typed text
    await runAnalyze(raw);
  }

  async function handleGenerateReport() {
    try {
      const basis = processedInput || input;
      const { reportText } = await callAgentSummarize({
        inputText: basis,
        frames: reflexFrames,
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
    <div className="ins-page relative py-10">
      <div className="relative max-w-6xl mx-auto px-4">
        <BackButton fallback="/" className="!text-ins-teal hover:!text-ins-goldbright" />

        {/* Header + Tabs */}
        <div className="ins-panel p-8 md:p-10 mt-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="ins-sec">Detection · VX Reflex Engine</div>
              <h1 className="ins-heading text-3xl mt-3">Analyze a Statement</h1>
              <p className="mt-2 text-ins-dim leading-relaxed">
                Paste text under <strong className="text-ins-text">Analyze</strong> to reveal logical fallacies such as assumptions, emotional
                manipulation, and troubling semantic patterns — including false precision and data-less
                claims in scientific writing. Or paste a URL under <strong className="text-ins-text">Chat</strong> for
                an <strong className="text-ins-text">Article Audit</strong> by our AI agent under strict citation policy.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded bg-ins-deep border border-ins-line">
              {(["analyze", "chat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded ins-mono text-sm tracking-wide transition-colors ${
                    activeTab === tab
                      ? "bg-ins-panel text-ins-goldbright border border-ins-gold"
                      : "text-ins-dim hover:text-ins-text"
                  }`}
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
                  disabled={isAnalyzing || isFetching}
                  className="ins-input !p-4"
                  rows={6}
                  placeholder="Paste a paragraph, a link to an article, or a snippet from a methods section…"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || isAnalyzing || isFetching}
                    className="ins-btn ins-btn-gold disabled:opacity-50"
                    title="Run local analysis with stringent fallacy/reflex detection."
                  >
                    {isAnalyzing || isFetching ? "Working…" : "Run Analysis"}
                  </button>
                </div>

                {/* Status + notice */}
                <div className="ins-mono text-xs text-ins-dim">{analysisCount > 0 && <>Runs: {analysisCount}</>}</div>
                {notice && (
                  <div className="mt-2 text-xs text-ins-text px-3 py-2 rounded bg-ins-deep border border-ins-line">
                    {notice}
                  </div>
                )}
              </div>

              {/* RESULTS */}
              {reflexFrames.length > 0 && (
                <>
                  <div className="mt-8 space-y-4">
                    <h2 className="ins-subheading text-xl">Results</h2>
                    <p className="ins-mono text-sm text-ins-teal">Found {reflexFrames.length} detections</p>

                    <div className="grid gap-4">
                      {reflexFrames.map((frame, index) => (
                        <div
                          key={`${frame.reflexId}-${index}`}
                          className="p-4 rounded bg-ins-deep border border-ins-line"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-ins-text">{frame.reflexLabel ?? frame.reflexId}</h3>
                            <span className="ins-chip" title="Frames from local analysis engine">
                              local
                            </span>
                          </div>
                          <p className="text-sm text-ins-dim mt-1 leading-relaxed">{frame.rationale ?? (frame as any).reason}</p>
                          <p className="ins-mono text-xs text-ins-teal mt-2">
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
                      className="ins-btn ins-btn-gold"
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

              {analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && !isFetching && (
                <div className="mt-8 p-4 rounded bg-ins-deep border border-ins-line">
                  <p className="text-ins-dim text-center">
                    No reflexes detected. Try text with strong certainty, unnamed authorities, or sweeping claims—then
                    see how the engine responds.
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

/** Chat panel with strict defaults + URL auto-fetch + clearer errors + Supabase persistence */
const ChatPanel: React.FC = () => {
  type RolePlus = ChatMessage["role"] | "tool";
  type ChatMsg = { role: RolePlus; text: string; frames?: any[]; tools?: any[] };

  // Supabase session persistence with cross-session memory
  const {
    sessionId,
    userId,
    messages: supabaseMessages,
    isLoading: sessionLoading,
    crossSessionContext,
    createNewSession,
    addMessage: addSupabaseMessage,
    clearSession,
  } = useConversationSession();

  // Convert Supabase messages to local format for display
  const history: ChatMsg[] = supabaseMessages.map((m) => ({
    role: m.role as RolePlus,
    text: m.content,
    frames: m.vx_frames as any[] || [],
    tools: (m.metadata as any)?.tools || [],
  }));

  // Robust/strict defaults per your request
  const [mode, setMode] = useState<Mode>("--careful");
  const [stakes, setStakes] = useState<Stakes>("high");
  const [minConfidence, setMinConfidence] = useState<number>(0.75);
  const [citePolicy, setCitePolicy] = useState<CitePolicy>("force");
  const [omissionUI, setOmissionUI] = useState<"auto" | "true" | "false">("true");
  const omission_scan: "auto" | boolean = omissionUI === "auto" ? "auto" : omissionUI === "true";
  const [reflexProfile, setReflexProfile] = useState<"default" | "strict" | "lenient">("strict");

  const [text, setText] = useState(""); // start empty, use placeholder
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: active article context for follow-ups
  const [activeDoc, setActiveDoc] = useState<null | { url: string; textBlock: string; charCount: number }>(null);
  function clearDocContext() {
    setActiveDoc(null);
  }

  // NEW: autoscroll to latest message
  const threadRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history]);

  function formatError(e: any) {
    const msg = e?.message || e?.toString?.() || "Unknown error";
    if (/Failed to fetch|NetworkError|TypeError/i.test(msg)) {
      return `${msg}. Tip: open the app on http://localhost:8888 (Netlify Dev) or your live Netlify URL so the /agent/* functions work.`;
    }
    const status = e?.response?.status ? ` (${e.response.status} ${e.response.statusText || ""})` : "";
    return `${msg}${status}`;
  }

  // Convert GitHub blob URLs to raw URLs for direct content access
  function normalizeGitHubUrl(inputUrl: string): string {
    const match = inputUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
    if (match) {
      const [, user, repo, rest] = match;
      return `https://raw.githubusercontent.com/${user}/${repo}/${rest}`;
    }
    return inputUrl;
  }

  async function fetchUrlToHistory(url: string) {
    setBusy(true);
    setError(null);
    try {
      // Normalize GitHub URLs to raw format
      const fetchUrl = normalizeGitHubUrl(url.trim());
      console.log('[analyze] Fetching URL:', { original: url, normalized: fetchUrl });

      // Create session if none exists
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createNewSession(`URL fetch: ${fetchUrl}`, {
          mode,
          stakes,
          min_confidence: minConfidence,
          cite_policy: citePolicy,
          omission_scan: omission_scan,
          reflex_profile: reflexProfile,
          codex_version: "0.9.0",
        });
      }

      const data = await withRetry(() => agentFetchUrl(fetchUrl));
      const plain = String(data?.text ?? "").slice(0, 16000); // Increased limit
      console.log('[analyze] Fetch response:', { textLength: plain.length });

      // Add as "user" message (Claude API only accepts user/assistant in history)
      const urlNote = fetchUrl !== url.trim() ? `\n(Auto-converted from: ${url.trim()})` : '';
      await addSupabaseMessage("user", `I've fetched this webpage for you to analyze:\n\nURL: ${fetchUrl}${urlNote}\n\n--- BEGIN PAGE CONTENT ---\n${plain}\n--- END PAGE CONTENT ---`, {
        metadata: { source: "url_fetch", url: fetchUrl }
      }, currentSessionId);

      // Add assistant acknowledgment for proper message alternation
      await addSupabaseMessage("assistant", `I've received the content from ${fetchUrl} (${plain.length} characters). I'm ready to analyze it - what would you like to know?`, {
        metadata: { source: "url_fetch_ack" }
      }, currentSessionId);
    } catch (e: any) {
      const msg = e?.message || e?.toString?.() || "Unknown error";
      if (/403|blocked server requests/i.test(msg)) {
        setError("That site blocks server fetches. Try copy/paste the article text.");
      } else {
        setError(formatError(e));
      }
    } finally {
      setBusy(false);
      setText("");
    }
  }

  // NEW: reset chat thread + Supabase session
  function resetChat() {
    clearSession();
    setError(null);
    clearDocContext();
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
      <div className="rounded p-4 bg-ins-deep border border-ins-line">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-ins-dim">
            Presets
            <Help text="Quick = low stakes, permissive; Careful = balanced defaults; Audit = strict, high-stakes guardrails." />
            :
          </span>
          <button onClick={() => applyPreset("quick")} className="ins-btn !px-2 !py-1 !text-xs">
            Quick
          </button>
          <button onClick={() => applyPreset("careful")} className="ins-btn !px-2 !py-1 !text-xs">
            Careful
          </button>
          <button onClick={() => applyPreset("audit")} className="ins-btn !px-2 !py-1 !text-xs">
            Audit
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 flex-wrap text-sm text-ins-dim">
          <label>
            Mode{" "}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="ml-1 rounded border border-ins-soft px-2 py-[2px] bg-ins-deep text-ins-text"
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
              className="ml-1 rounded border border-ins-soft px-2 py-[2px] bg-ins-deep text-ins-text"
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
              className="ml-1 rounded border border-ins-soft px-2 py-[2px] bg-ins-deep text-ins-text"
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
              className="ml-1 rounded border border-ins-soft px-2 py-[2px] bg-ins-deep text-ins-text"
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
              className="ml-1 rounded border border-ins-soft px-2 py-[2px] bg-ins-deep text-ins-text"
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
          className="ins-btn"
          title="Invoke /agent/fetch-url and append the cleaned text as a tool message."
          disabled={busy}
        >
          fetch-url
        </button>

        {/* NEW: Reset chat */}
        <button
          onClick={resetChat}
          className="ins-btn"
          title="Clear the chat thread and local storage."
          disabled={busy || history.length === 0}
        >
          reset chat
        </button>
      </div>

      {/* Conversation (above divider so its shadow can't act like a divider) */}
      <div className="rounded p-3 bg-ins-deep border border-ins-line">
        <div ref={threadRef} className="max-h-[50vh] overflow-auto space-y-3">
          {history.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded border ${
                m.role === "user"
                  ? "bg-ins-panel border-ins-soft"
                  : m.role === "assistant"
                  ? "bg-ins-panel border-ins-line"
                  : "bg-[#2a2316] border-[#4a3e26]"
              }`}
            >
              <div className={`ins-mono text-xs uppercase tracking-wide mb-1 ${m.role === "user" ? "text-ins-teal" : "text-ins-gold"}`}>{m.role}</div>
              <pre className="whitespace-pre-wrap text-sm text-ins-text font-sans">{m.text}</pre>

              {m.role === "assistant" && m.tools && m.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.tools.map((t: any, idx: number) => (
                    <span key={idx} className="ins-chip">
                      {t.name}
                      {t.args?.url ? `: ${t.args.url}` : ""}
                      {typeof t.duration_ms === "number" ? ` · ${t.duration_ms}ms` : ""}
                    </span>
                  ))}
                </div>
              )}

              {m.frames && m.frames.length > 0 && (
                <div className="mt-2 ins-mono text-xs text-ins-dim">Frames: {m.frames.length}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simple straight line */}
      <hr className="my-3 border-ins-line" />

      {/* Send button ABOVE the textarea, left-aligned */}
      <div className="flex gap-2 items-center">
        <button
          onClick={async () => {
            const content = text.trim();
            if (!content || busy) return;

            setBusy(true);
            setError(null);

            try {
              // Create session if none exists
              let currentSessionId = sessionId;
              if (!currentSessionId) {
                currentSessionId = await createNewSession(content, {
                  mode,
                  stakes,
                  min_confidence: minConfidence,
                  cite_policy: citePolicy,
                  omission_scan: omission_scan,
                  reflex_profile: reflexProfile,
                  codex_version: "0.9.0",
                });
              }

              // Local reflex analysis on user's input
              const userFrames = await runReflexAnalysis(content);

              // Save user message to Supabase
              await addSupabaseMessage("user", content, {
                vx_frames: userFrames,
              }, currentSessionId);

              // Prior convo history (user/assistant only) for agent context
              const priorHistory = history
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map(({ role, text }) => ({ role: role as ChatMessage["role"], text }));

              // DEBUG: Log history being sent to agent
              console.log('[analyze] History being sent to agent:', {
                totalMessages: history.length,
                filteredCount: priorHistory.length,
                roles: priorHistory.map(h => h.role),
                preview: priorHistory.map(h => ({ role: h.role, textLength: h.text?.length, textPreview: h.text?.slice(0, 100) }))
              });

              let textToSend = content;

              if (isLikelyUrl(content)) {
                // Fetch the page and include the content inline for this turn
                const { text: fetched } = await withRetry(() => agentFetchUrl(content));
                if (fetched?.length) {
                  const clipped = fetched.slice(0, 20000);
                  textToSend =
`Analyze the following page content (truncated if long). Answer follow-ups with this context in mind.

[URL] ${content}
[CONTENT START]
${clipped}
[CONTENT END]`;

                  // Keep the article context active for follow-ups
                  setActiveDoc({
                    url: content,
                    textBlock: `[URL] ${content}\n[CONTENT START]\n${clipped}\n[CONTENT END]`,
                    charCount: clipped.length,
                  });
                } else {
                  setError("Fetched page had no readable text; sending URL as-is.");
                  setActiveDoc(null);
                }
              } else if (activeDoc) {
                // Include active article context for follow-ups
                textToSend =
`Context: You are still discussing the article below. Use it to answer concisely.

${activeDoc.textBlock}

User: ${content}`;
              }

              // Inject cross-session context for returning users (first message of new session)
              if (crossSessionContext && priorHistory.length === 0) {
                textToSend = crossSessionContext + textToSend;
              }

              const hs = buildHandshake(codex as any, {
                mode,
                stakes,
                min_confidence: minConfidence,
                cite_policy: citePolicy,
                omission_scan: omission_scan,
                reflex_profile: reflexProfile,
              });

              const resp = await withRetry(() =>
                agentChat(textToSend, priorHistory, {
                  mode: hs.mode,
                  stakes: hs.stakes,
                  min_confidence: hs.min_confidence,
                  cite_policy: hs.cite_policy,
                  omission_scan: hs.omission_scan,
                  reflex_profile: hs.reflex_profile,
                  codex_version: hs.codex_version,
                })
              );

              const assistantText = String(resp?.message ?? "").trim() || "(no reply)";
              const assistantFrames = await runReflexAnalysis(assistantText);

              // Save assistant message to Supabase
              await addSupabaseMessage("assistant", assistantText, {
                vx_frames: assistantFrames,
                metadata: { tools: resp?.tools ?? [] },
              }, currentSessionId);

            } catch (e: any) {
              const msg = e?.message || e?.toString?.() || "Unknown error";
              if (/403|blocked server requests/i.test(msg)) {
                setError("That site blocks server fetches. Try copy/paste the article text.");
              } else if (/Failed to fetch|NetworkError|TypeError/i.test(msg)) {
                setError(
                  `${msg}. Tip: open the app on http://localhost:8888 (Netlify Dev) or your live Netlify URL so the /agent/* functions work.`
                );
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
          className="ins-btn ins-btn-gold disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send"}
        </button>
        {sessionId && (
          <span className="ins-mono text-xs text-ins-dim">
            Session: {sessionId.slice(0, 8)}...
          </span>
        )}
      </div>

      {/* Optional second straight line */}
      <hr className="my-3 border-ins-line" />

      {/* Textarea ONLY */}
      <div className="mt-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="ins-input resize-none max-h-40 overflow-auto whitespace-pre-wrap break-words break-all md:break-words"
          placeholder="Paste a URL or ask a question. (Typing a URL here will auto-fetch and include the page.)"
          rows={3}
          disabled={busy}
        />
      </div>

      {activeDoc && (
        <div className="text-xs text-ins-dim mt-2">
          Article context active: {activeDoc.url} ({activeDoc.charCount.toLocaleString()} chars){" "}
          <button onClick={clearDocContext} className="underline text-ins-teal">
            Reset
          </button>
        </div>
      )}

      {error && <div className="rounded border p-3 text-sm" style={{ borderColor: "#e08030", background: "rgba(224,128,48,0.1)", color: "#e0a060" }}>{error}</div>}
    </div>
  );
};

export default AnalyzePage;


