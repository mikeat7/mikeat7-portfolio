// src/pages/index.tsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_800px_at_20%_10%,#f6f9ff_0%,#e9eef5_60%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-900 shadow-sm">
          🧠 AWS Agent Ready · Codex v0.9 Handshake
        </span>

        <section className="neu mt-6 p-6 md:p-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Truth Serum + Clarity Armor
          </h1>
          <p className="mt-2 text-slate-600">Voice-AI powered epistemic truth detection</p>
          <p className="text-slate-600">Analyze language • Detect manipulation • Build clarity</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/analyze" className="cta primary">Analyze Language</Link>
            <Link to="/educate/bullshit-patterns" className="cta">Education Hub</Link>
            <a href="#wisdom" className="cta">Wisdom &amp; Training</a>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <article className="card neu">
            <h3 className="text-lg font-semibold">Core Analysis Tools</h3>
            <p className="text-sm text-slate-600 mt-1">
              VX reflex engine with semantic + cluster detection. Handshake-driven mode & stakes; context
              decay + failure semantics via Codex v0.9.
            </p>
          </article>
          <article className="card neu">
            <h3 className="text-lg font-semibold">Scientific Paper Checks</h3>
            <p className="text-sm text-slate-600 mt-1">
              Methods & references triage for weak evidence and conflicts. Citation prompts when
              confidence is below policy.
            </p>
          </article>
          <article className="card neu">
            <h3 className="text-lg font-semibold">Link & Article Audits</h3>
            <p className="text-sm text-slate-600 mt-1">
              Paste a URL or full text; get manipulation patterns, missing context, and source requests.
            </p>
          </article>
          <article className="card neu">
            <h3 className="text-lg font-semibold">Agent-grade Handshake</h3>
            <p className="text-sm text-slate-600 mt-1">
              <strong>mode</strong>, <strong>stakes</strong>, <strong>min_confidence</strong>,{" "}
              <strong>cite_policy</strong>, <strong>omission_scan</strong>, <strong>reflex_profile</strong> — sent with every call.
            </p>
          </article>
        </section>

        <p id="wisdom" className="mt-8 p-4 text-center text-slate-700 text-sm neu-inset">
          “Clarity is kindness. Truth is a team sport.” — Clarity Armor
        </p>
      </div>
    </main>
  );
};

export default HomePage;
