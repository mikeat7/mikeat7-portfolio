// src/pages/agent-demo.tsx
import React, { useMemo, useState } from "react";
import { agentChat, agentFetchUrl } from "@/lib/agentClient";
import { buildHandshake, type Mode, type Stakes, type CitePolicy, type Codex } from "@/lib/codex-runtime";
import codexJson from "@/data/front-end-codex.v0.9.json";
import "@/styles.css";

// Narrow JSON to the Codex interface (compile-time only)
const codex: Codex = codexJson as unknown as Codex;

const AgentDemo: React.FC = () => {
  const [text, setText] = useState("Experts say we must act now or never.");
  const [url, setUrl] = useState("https://example.com");
  const [mode, setMode] = useState<Mode>("--careful");
  const [stakes, setStakes] = useState<Stakes>("medium");
  const [cite, setCite] = useState<CitePolicy>("auto");
  const [omit, setOmit] = useState<"auto" | boolean>("auto");
  const [profile, setProfile] = useState<"default" | "strict" | "lenient">("default");
  const [resp, setResp] = useState<any>(null);
  const [fetchResp, setFetchResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  async function onChat() {
    setErr(null);
    setBusy(true);
    setResp(null);
    try {
      // IMPORTANT: 3-argument form => (text, history[], options)
      const out = await agentChat(
        text,
        [], // no prior history in this demo
        {
          mode,
          stakes,
          cite_policy: cite,
          omission_scan: omit,
          reflex_profile: profile,
        }
      );
      setResp(out);
    } catch (e: any) {
      setErr(e?.message || "Agent error");
    } finally {
      setBusy(false);
    }
  }

  async function onFetch() {
    setErr(null);
    setBusy(true);
    setFetchResp(null);
    try {
      const out = await agentFetchUrl(url);
      setFetchResp(out);
    } catch (e: any) {
      setErr(e?.message || "fetch-url error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Agent Demo</h1>
      <p className="text-sm text-gray-600">
        This page hits <code>/agent/chat</code> and <code>/agent/fetch-url</code> using your codex v0.9 handshake.
        Use it to confirm your AWS Agent Core.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-3 space-y-2">
          <label className="text-sm font-medium">Text</label>
          <textarea
            className="w-full min-h-32 border rounded p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={onChat} disabled={busy} className="px-3 py-2 border rounded hover:bg-gray-50">
            {busy ? "Running…" : "Agent Chat"}
          </button>
        </div>

        <div className="border rounded-lg p-3 space-y-2">
          <label className="text-sm font-medium">URL</label>
          <input
            className="w-full border rounded p-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={onFetch} disabled={busy} className="px-3 py-2 border rounded hover:bg-gray-50">
            {busy ? "Fetching…" : "fetch-url"}
          </button>
        </div>
      </section>

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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <pre className="border rounded p-3 overflow-auto text-xs bg-gray-50">
{JSON.stringify(resp, null, 2)}
        </pre>
        <pre className="border rounded p-3 overflow-auto text-xs bg-gray-50">
{JSON.stringify(fetchResp, null, 2)}
        </pre>
      </section>
    </div>
  );
};

export default AgentDemo;

