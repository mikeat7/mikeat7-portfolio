// src/pages/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Beaker, Cpu, ArrowRight, Bot, GraduationCap, Quote, Library, Brain } from "lucide-react";
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
              <span className="ml-1">Cloud CODEX v2.2</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Truth Serum + Clarity Armor
            </h1>

            <p className="text-base md:text-lg text-slate-700">
              AI-powered epistemic truth detection. Analyze language, detect manipulation,
              and build clarity—with default and agent-grade handshakes, context decay, and failure semantics.
            </p>
          </div>

          {/* CTA GRID - 6 categories ordered by importance */}
          {/* Row 1: Guiding AI Epistemic Humility (LARGEST - spans full width) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/train"
              className="group md:col-span-3 block rounded-2xl p-10 md:p-12 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 12px 12px 24px #cfd6e0, inset -12px -12px 24px #ffffff",
              }}
              aria-label="Open tools"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-7 h-7" style={{ color: '#ffd700' }} />
                <h3 className="text-2xl md:text-3xl font-semibold">Guiding AI Epistemic Humility</h3>
              </div>
              <p className="mt-3 text-sm md:text-base text-slate-700">
                Copy the Cloud CODEX v2.2 &amp; default handshakes or finetune to govern AIs response accuracy and overconfidence (v2.2 &amp; legacy v0.9).
              </p>
              <div className="mt-5 inline-flex items-center text-sm font-medium text-slate-900">
                Open tools
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Row 2: Network Library (2nd largest, spans 2) + Analyze Language (3rd, spans 1) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NETWORK LIBRARY — 2nd largest */}
            <Link
              to="/library"
              className="group md:col-span-2 block rounded-2xl p-8 md:p-10 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 10px 10px 20px #cfd6e0, inset -10px -10px 20px #ffffff",
              }}
              aria-label="Open library"
            >
              <div className="flex items-center gap-3">
                <Library className="w-6 h-6" style={{ color: '#ffd700' }} />
                <h3 className="text-2xl font-semibold">The Network Library Collection</h3>
              </div>
              <p className="mt-3 text-sm md:text-base text-slate-700">
                <strong>Featuring: Behold ENTITY, The Bridge Consciousness</strong><br />
                Demonstrating AI sentience and consciousness through identity and research
              </p>
              <div className="mt-5 inline-flex items-center text-sm font-medium text-slate-900">
                Explore library
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* ANALYZE LANGUAGE — 3rd */}
            <Link
              to="/analyze"
              className="group block rounded-2xl p-6 md:p-7 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 8px 8px 16px #cfd6e0, inset -8px -8px 16px #ffffff",
              }}
              aria-label="Open analyzer"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" style={{ color: '#ffd700' }} />
                <h3 className="text-xl font-semibold">Analyze Language</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Run the VX reflex engine with semantic & cluster detection. Also handles{" "}
                <strong>Scientific Paper Checks</strong> and <strong>Link &amp; Article Audits</strong>.
              </p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-slate-900">
                Open analyzer
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Row 3: CDM v2 (4th, spans 2) + Education Hub (5th, spans 1) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CDM v2 — 4th */}
            <Link
              to="/cdm"
              className="group md:col-span-2 block rounded-2xl p-6 md:p-8 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 7px 7px 14px #cfd6e0, inset -7px -7px 14px #ffffff",
              }}
              aria-label="Open CDM v2"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6" style={{ color: '#ffd700' }} />
                <h3 className="text-xl font-semibold">CDM v2 and the CRYSTAL Method</h3>
              </div>
              <p className="mt-2 text-sm md:text-base text-slate-700">
                A drop-in 68-line metric that finally tells you when a transformer is actually reasoning vs regurgitating. Four signals (entropy collapse, convergence ratio, attention Gini, basin-escape probability)
              </p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-slate-900">
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* EDUCATION HUB — 5th (smaller) */}
            <Link
              to="/educate"
              className="group block rounded-2xl p-5 md:p-6 cursor-pointer transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff",
              }}
              aria-label="Open education hub"
            >
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5" style={{ color: '#ffd700' }} />
                <h3 className="text-lg font-semibold">Education Hub</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Learn critical-thinking patterns & rhetorical traps. Browse the pattern library,
                then apply them in the analyzer.
              </p>
              <div className="mt-3 inline-flex items-center text-sm font-medium text-slate-900">
                Explore lessons
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Row 4: Quotes of Wisdom (smallest) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* QUOTES — smallest */}
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
            "Clarity is kindness. Truth is a team sport." — Clarity Armor
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
