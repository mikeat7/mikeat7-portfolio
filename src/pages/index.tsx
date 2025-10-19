// src/pages/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Beaker, Cpu, ArrowRight, Bot, GraduationCap, Quote } from "lucide-react";
import { buildHandshake } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";

const HandshakeStatus: React.FC = () => {
  // Non-interactive status (read-only). Later we can add a Mode×Stakes switcher.
  const hs = buildHandshake(codex as any, { mode: "--careful", stakes: "medium" });
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
              <Cpu className="w-4 h-4 mr-2" style={{ color: '#ffd700' }} />
              <span className="font-semibold">AWS Agent Ready</span> ·
              <span className="ml-1">Codex v0.9 Handshake</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Truth Serum + Clarity Armor
            </h1>

            <p className="text-base md:text-lg text-slate-700">
              AI-powered epistemic truth detection. Analyze language, detect manipulation,
              and build clarity—with agent-grade handshakes, context decay, and failure semantics.
            </p>
          </div>

          {/* CTA GRID */}
          {/* Row 1: Analyze (largest, spans 2 cols) + Education (medium) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ANALYZE — largest */}
            <Link
              to="/analyze"
              className="group md:col-span-2 block rounded-2xl p-8 md:p-10 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 10px 10px 20px #cfd6e0, inset -10px -10px 20px #ffffff",
              }}
              aria-label="Open analyzer"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6" style={{ color: '#ffd700' }} />
                <h3 className="text-2xl font-semibold">Analyze Language</h3>
              </div>
              <p className="mt-3 text-sm md:text-base text-slate-700">
                Run the VX reflex engine with semantic & cluster detection. Also handles{" "}
                <strong>Scientific Paper Checks</strong> and <strong>Link &amp; Article Audits</strong>.
              </p>
              <div className="mt-5 inline-flex items-center text-sm font-medium text-slate-900">
                Open analyzer
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* EDUCATION — medium (half of Analyze) */}
            <Link
              to="/educate"
              className="group block rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 8px 8px 16px #cfd6e0, inset -8px -8px 16px #ffffff",
              }}
              aria-label="Open education hub"
            >
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5" style={{ color: '#ffd700' }} />
                <h3 className="text-xl font-semibold">Education Hub</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Learn critical-thinking patterns & rhetorical traps. Browse the pattern library,
                then apply them in the analyzer.
              </p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-slate-900">
                Explore lessons
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Row 2 (reordered & resized by importance): Train (bigger) → Quotes (smallest) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TRAIN — second from last; larger than Quotes, smaller than Education */}
            <Link
              to="/train"
              className="group block rounded-2xl p-6 md:p-7 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 7px 7px 14px #cfd6e0, inset -7px -7px 14px #ffffff",
              }}
              aria-label="Open tools"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5" style={{ color: '#ffd700' }} />
                <h3 className="text-xl font-semibold">How to Guide your AI towards greater Honesty</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Copy the codex &amp; handshakes to govern AIs epistemic humility (v0.8 &amp; v0.9).
              </p>
              <div className="mt-3 inline-flex items-center text-sm font-medium text-slate-900">
                Open tools
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* QUOTES — least important; last & smallest */}
            <Link
              to="/wisdom"
              className="group block rounded-2xl p-4 md:p-5 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 5px 5px 10px #cfd6e0, inset -5px -5px 10px #ffffff",
              }}
              aria-label="Visit quotes of wisdom"
            >
              <div className="flex items-center gap-3">
                <Quote className="w-5 h-5" style={{ color: '#ffd700' }} />
                <h3 className="text-lg font-semibold">Quotes of Wisdom</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">Curated quotes from great thinkers</p>
              <div className="mt-3 inline-flex items-center text-sm font-medium text-slate-900">
                Visit quotes and add your own
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-10 text-sm italic text-slate-600">
            “Clarity is kindness. Truth is a team sport.” — Clarity Armor
          </p>
        </div>

        {/* Static feature blurbs */}
        <div className="mt-12 max-w-6xl mx-auto px-2 md:px-0">
          <div className="grid md:grid-cols-3 gap-6 text-slate-700">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4" style={{ color: '#ffd700' }} /> VX Reflex Engine
              </h4>
              <p className="text-sm mt-1">Semantic patterns, co-fire clusters, adaptive thresholds.</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Beaker className="w-4 h-4" style={{ color: '#ffd700' }} /> Scientific Paper Checks
              </h4>
              <p className="text-sm mt-1">Methods &amp; references triage; conflict-of-interest cues.</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Cpu className="w-4 h-4" style={{ color: '#ffd700' }} /> Agent-grade Handshake
              </h4>
              <p className="text-sm mt-1">mode, stakes, min_conf, cite_policy, omission_scan, profile.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default IndexPage;


