// src/pages/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Beaker, Link2, Cpu, ArrowRight, Sparkles, Layers } from "lucide-react";
import { buildHandshake } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";

const HandshakeStatus: React.FC = () => {
  const hs = buildHandshake(codex, { mode: "--careful", stakes: "medium" });
  return (
    <div className="text-xs md:text-sm text-slate-600 mt-2">
      <span className="font-medium">Handshake</span> ·
      mode=<code>{hs.mode}</code> · stakes=<code>{hs.stakes}</code> ·
      min_confidence=<code>{hs.min_confidence}</code> · cite_policy=<code>{hs.cite_policy}</code> ·
      omission_scan=<code>{String(hs.omission_scan)}</code> · reflex_profile=<code>{hs.reflex_profile}</code>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#e9eef5] text-slate-800">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="relative rounded-3xl p-10 md:p-14"
          style={{
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center text-xs md:text-sm text-slate-600">
              <Cpu className="w-4 h-4 mr-2" />
              <span className="font-semibold">AWS Agent Ready</span> ·
              <span className="ml-1">Codex v0.9 Handshake</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Truth Serum + Clarity Armor
            </h1>

            <p className="text-base md:text-lg text-slate-700">
              Voice-AI powered epistemic truth detection. Analyze language, detect manipulation,
              and build clarity—with agent-grade handshakes, context decay, and failure semantics.
            </p>

            <HandshakeStatus />
          </div>

          {/* PRIMARY CTAs (prominent) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Analyze Language — BIG */}
            <Link
              to="/analyze"
              className="rounded-3xl p-7 md:p-8 bg-[#e9eef5] hover:scale-[1.02] transition block col-span-1 md:col-span-2"
              style={{
                boxShadow:
                  "inset 10px 10px 20px #cfd6e0, inset -10px -10px 20px #ffffff, 6px 6px 14px rgba(163,177,198,0.45)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-2xl md:text-3xl font-bold">Analyze Language</h3>
                </div>
                <ArrowRight className="w-5 h-5 mt-1" />
              </div>
              <p className="mt-3 text-slate-700">
                Run the VX reflex engine with semantic + cluster detection. Includes
                <span className="font-medium"> Scientific Paper Checks</span> and
                <span className="font-medium"> Link &amp; Article Audits</span>.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Layers className="w-4 h-4" />
                <span>Reflex thresholds via Codex v0.9 · context-decay &amp; failure semantics</span>
              </div>
            </Link>

            {/* Education Hub — BIG */}
            <Link
              to="/educate"
              className="rounded-3xl p-7 md:p-8 bg-[#e9eef5] hover:scale-[1.02] transition block"
              style={{
                boxShadow:
                  "inset 10px 10px 20px #cfd6e0, inset -10px -10px 20px #ffffff, 6px 6px 14px rgba(163,177,198,0.45)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Beaker className="w-6 h-6" />
                  <h3 className="text-2xl md:text-3xl font-bold">Education Hub</h3>
                </div>
                <ArrowRight className="w-5 h-5 mt-1" />
              </div>
              <p className="mt-3 text-slate-700">
                Learn critical-thinking patterns & rhetorical traps. Browse the pattern library, then
                apply them in the analyzer.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Courses · Pattern Library · Practice Drills</span>
              </div>
            </Link>
          </div>

          {/* SECONDARY CTA (visible but softer) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/wisdom"
              className="rounded-2xl p-6 bg-[#e9eef5] hover:scale-[1.01] transition block"
              style={{
                boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff",
                opacity: 0.95,
              }}
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Wisdom &amp; Training</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Curated quotes and drills for epistemic humility. Practice better questions and better answers.
              </p>
            </Link>
          </div>

          {/* CORE CAPABILITIES (brief, judge-friendly) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="rounded-2xl p-6"
              style={{ background: "#e9eef5", boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
            >
              <h4 className="font-semibold text-slate-900">VX Reflex Engine</h4>
              <p className="mt-2 text-sm text-slate-700">Semantic patterns, co-fire clusters, adaptive thresholds.</p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ background: "#e9eef5", boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
            >
              <h4 className="font-semibold text-slate-900">Scientific Paper Checks</h4>
              <p className="mt-2 text-sm text-slate-700">Methods &amp; references triage; conflict-of-interest cues.</p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ background: "#e9eef5", boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
            >
              <h4 className="font-semibold text-slate-900">Agent-grade Handshake</h4>
              <p className="mt-2 text-sm text-slate-700">mode, stakes, min_conf, cite_policy, omission_scan, profile.</p>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-10 text-sm italic text-slate-600">
            “Clarity is kindness. Truth is a team sport.” — Clarity Armor
          </p>
        </div>
      </section>
    </main>
  );
};

export default IndexPage;

