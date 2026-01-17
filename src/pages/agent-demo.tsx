// src/pages/agent-demo.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { agentChat, agentFetchUrl, type ChatMessage } from "@/lib/agentClient";
import { buildHandshake, type Mode, type Stakes, type CitePolicy, type Codex } from "@/lib/codex-runtime";
import { useConversationSession } from "@/hooks/useConversationSession";
import codexJson from "@/data/front-end-codex.v0.9.json";
import "@/styles.css";

// Narrow JSON to the Codex interface (compile-time only)
const codex: Codex = codexJson as unknown as Codex;

const AgentDemo: React.FC = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("https://example.com");
  const [mode, setMode] = useState<Mode>("--careful");
  const [stakes, setStakes] = useState<Stakes>("medium");
  const [cite, setCite] = useState<CitePolicy>("auto");
  const [omit, setOmit] = useState<"auto" | boolean>("auto");
  const [profile, setProfile] = useState<"default" | "strict" | "lenient">("default");
  const [fetchResp, setFetchResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Supabase session persistence with cross-session memory
  const {
    sessionId,
    userId,
    messages,
    isLoading: sessionLoading,
    crossSessionContext,
    createNewSession,
    addMessage,
    clearSession,
  } = useConversationSession();

  // refs for auto-scroll
  const chatRef = useRef<HTMLDivElement | null>(null);
  const fetchRef = useRef<HTMLPreElement | null>(null);

  // auto-scroll when new messages land
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (fetchRef.current) fetchRef.current.scrollTo({ top: fetchRef.current.scrollHeight, behavior: "smooth" });
  }, [fetchResp]);

  const handshake = useMemo(
    () =>
      buildHandshake(codex, {
        mode,
        stakes,
        cite_policy: cite,
        omission_scan: omit,
        reflex_profile: profile,
      }),
    [mode, stakes, cite, omit, profile]
  );

  // Convert Supabase messages to agent API format
  const getHistoryForAgent = (): ChatMessage[] => {
    return messages.map((m) => ({
      role: m.role as ChatMessage["role"],
      text: m.content,
    }));
  };

  async function onChat() {
    if (!text.trim()) return;

    setErr(null);
    setBusy(true);

    try {
      // Create session on first message if none exists
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createNewSession(text, {
          mode,
          stakes,
          min_confidence: handshake.min_confidence,
          cite_policy: cite,
          omission_scan: omit,
          reflex_profile: profile,
          codex_version: "0.9.0",
        });
      }

      // Save user message to Supabase (pass session ID explicitly for new sessions)
      await addMessage("user", text, {}, currentSessionId);

      // Get conversation history for context
      const history = getHistoryForAgent();

      // Prepend cross-session context if available (returning user)
      let textWithContext = text;
      if (crossSessionContext && history.length === 0) {
        // Only inject on first message of new session
        textWithContext = crossSessionContext + text;
      }

      // Call agent with full history
      const out = await agentChat(textWithContext, history, {
        mode,
        stakes,
        cite_policy: cite,
        omission_scan: omit,
        reflex_profile: profile,
        sessionId: currentSessionId,
      });

      // Extract assistant response and save to Supabase
      // Backend returns { message, tools } - check 'message' first
      const assistantText = out?.message || out?.response || out?.text || out?.completion || JSON.stringify(out);
      await addMessage("assistant", assistantText, {
        vx_frames: out?.vx_frames || out?.frames || [],
        metadata: { raw_response: out },
      }, currentSessionId);

      // Clear input after successful send
      setText("");
    } catch (e: any) {
      setErr(e?.message || "Agent error");
    } finally {
      setBusy(false);
    }
  }

  async function onNewSession() {
    clearSession();
    setText("");
    setErr(null);
  }

  // Truncate content to ~4000 tokens (roughly 16000 chars) to control costs
  function truncateContent(text: string, maxChars = 16000): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "\n\n[Content truncated to limit token usage]";
  }

  async function onFetch() {
    if (!url.trim()) return;

    setErr(null);
    setBusy(true);
    setFetchResp(null);

    try {
      const out = await agentFetchUrl(url);
      setFetchResp(out);

      // Extract text content from response
      const fetchedText = out?.text || JSON.stringify(out);
      const truncatedContent = truncateContent(fetchedText);

      // Create session if none exists
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createNewSession(`Fetched: ${url}`, {
          mode,
          stakes,
          min_confidence: handshake.min_confidence,
          cite_policy: cite,
          omission_scan: omit,
          reflex_profile: profile,
          codex_version: "0.9.0",
        });
      }

      // Add fetched content as a user message so agent definitely sees it
      // Using "user" role because some backends may filter/ignore "system" in history
      const contextMessage = `I've fetched this webpage for you to analyze:\n\nURL: ${url}\n\n--- BEGIN PAGE CONTENT ---\n${truncatedContent}\n--- END PAGE CONTENT ---\n\nPlease acknowledge that you can see this content.`;
      await addMessage("user", contextMessage, {
        metadata: { source: "url_fetch", url, original_length: fetchedText.length }
      }, currentSessionId);

    } catch (e: any) {
      setErr(e?.message || "fetch-url error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agent Demo</h1>
        <div className="flex items-center gap-2">
          {sessionId && (
            <span className="text-xs text-gray-500 font-mono">
              Session: {sessionId.slice(0, 8)}...
            </span>
          )}
          <button
            onClick={onNewSession}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            New Session
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Conversations are now saved to Supabase and persist across page refreshes.
      </p>

      {/* Conversation History */}
      <section className="border rounded-lg p-3 space-y-2">
        <h2 className="font-medium flex items-center gap-2">
          Conversation
          {sessionLoading && <span className="text-xs text-gray-400">(loading...)</span>}
          {messages.length > 0 && (
            <span className="text-xs text-gray-400">({messages.length} messages)</span>
          )}
        </h2>
        <div
          ref={chatRef}
          className="border rounded bg-gray-50 p-3 min-h-48 max-h-96 overflow-y-auto space-y-3"
        >
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No messages yet. Start a conversation below.</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`p-2 rounded text-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-900 ml-8"
                    : msg.role === "assistant"
                    ? "bg-white border mr-8"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <div className="text-xs font-medium text-gray-500 mb-1">{msg.role}</div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Chat Input */}
      <section className="border rounded-lg p-3 space-y-2">
        <label className="text-sm font-medium">Your Message</label>
        <textarea
          className="w-full min-h-24 border rounded p-2"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onChat();
            }
          }}
        />
        <button
          onClick={onChat}
          disabled={busy || !text.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "Sending..." : "Send"}
        </button>
      </section>

      {/* Handshake Config */}
      <section className="border rounded-lg p-3 space-y-2">
        <h2 className="font-medium">Handshake</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="border rounded px-2 py-1">
            <option value="--direct">--direct</option>
            <option value="--careful">--careful</option>
            <option value="--recap">--recap</option>
          </select>
          <select value={stakes} onChange={(e) => setStakes(e.target.value as Stakes)} className="border rounded px-2 py-1">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <select value={cite} onChange={(e) => setCite(e.target.value as CitePolicy)} className="border rounded px-2 py-1">
            <option value="auto">cite:auto</option>
            <option value="force">cite:force</option>
            <option value="off">cite:off</option>
          </select>
          <select
            value={String(omit)}
            onChange={(e) => setOmit(e.target.value === "auto" ? "auto" : e.target.value === "true")}
            className="border rounded px-2 py-1"
          >
            <option value="auto">omission:auto</option>
            <option value="true">omission:true</option>
            <option value="false">omission:false</option>
          </select>
          <select value={profile} onChange={(e) => setProfile(e.target.value as any)} className="border rounded px-2 py-1">
            <option value="default">profile:default</option>
            <option value="strict">profile:strict</option>
            <option value="lenient">profile:lenient</option>
          </select>
          <input className="border rounded px-2 py-1" value={handshake.min_confidence} readOnly />
        </div>
        <p className="text-xs text-gray-500">Effective handshake computed by <code>buildHandshake()</code>.</p>
      </section>

      {err && <div className="border border-amber-300 bg-amber-50 text-amber-900 rounded p-3 text-sm">{err}</div>}

      {/* URL Fetch Tool */}
      <section className="border rounded-lg p-3 space-y-2">
        <h2 className="font-medium">Fetch URL into Conversation</h2>
        <p className="text-xs text-gray-500">
          Fetch a webpage and add its content to the conversation. The agent will be able to read and discuss it.
        </p>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onFetch();
              }
            }}
          />
          <button
            onClick={onFetch}
            disabled={busy || !url.trim()}
            className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {busy ? "Fetching..." : "Fetch & Add"}
          </button>
        </div>
        {fetchResp && (
          <div className="space-y-2">
            <div className="text-xs text-green-600 font-medium">
              Content fetched and added to conversation. You can now ask the agent about it.
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                View raw response ({fetchResp?.text?.length || 0} chars)
              </summary>
              <pre
                ref={fetchRef}
                className="border rounded p-3 overflow-y-auto bg-gray-50 max-h-48 mt-2"
              >
                {fetchResp?.text?.slice(0, 2000) || JSON.stringify(fetchResp, null, 2)}
                {fetchResp?.text?.length > 2000 && "\n\n[Preview truncated...]"}
              </pre>
            </details>
          </div>
        )}
      </section>
    </div>
  );
};

export default AgentDemo;
