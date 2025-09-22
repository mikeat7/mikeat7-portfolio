// src/pages/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Beaker, Link2, Cpu, ArrowRight } from "lucide-react";
import { buildHandshake } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";

const HandshakeStatus: React.FC = () => {
  // Non-interactive status (read-only). Later we can add a Mode×Stakes switcher.
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
        <div className="relative rounded-3xl p-10 md:p-14"
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

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Truth Serum + Clarity Armor
            </h1>

            <p className="text-base md:text-lg text-slate-700">
              Voice-AI powered epistemic truth detection. Analyze language, detect manipulation,
              and build clarity—with agent-grade handshakes, context decay, and failure semantics.
            </p>

            <HandshakeStatus />
          </div>

          {/* CTA row */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Analyze Language */}
            <div className="rounded-2xl p-6 bg-[#e9eef5] hover:scale-[1.01] transition"
              style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Analyze Language</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Run the VX reflex engine with semantic & cluster detection.
                Also handles <strong>Scientific Paper Checks</strong> and <strong>Link & Article Audits</strong>.
              </p>
              <Link
                to="/analyze"
                className="mt-4 inline-flex items-center text-sm font-medium text-slate-900"
              >
                Open analyzer <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Education Hub */}
            <div className="rounded-2xl p-6 bg-[#e9eef5] hover:scale-[1.01] transition"
              style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
            >
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Education Hub</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Learn critical-thinking patterns & rhetorical traps. Browse the pattern library,
                then apply them in the analyzer.
              </p>
              <Link
                to="/educate/patterns"
                className="mt-4 inline-flex items-center text-sm font-medium text-slate-900"
              >
                Explore patterns <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Wisdom & Training */}
            <div className="rounded-2xl p-6 bg-[#e9eef5] hover:scale-[1.01] transition"
              style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Wisdom & Training</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Curated quotes and drills for epistemic humility. A calm place to practice better
                questions and better answers.
              </p>
              <Link
                to="/wisdom"
                className="mt-4 inline-flex items-center text-sm font-medium text-slate-900"
              >
                Visit Wisdom & Training <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-8 text-sm italic text-slate-600">
            “Clarity is kindness. Truth is a team sport.” — Clarity Armor
          </p>
        </div>
      </section>
    </main>
  );
};

export default IndexPage;

