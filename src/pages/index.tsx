// src/pages/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Beaker,
  Cpu,
  ArrowRight,
  Bot,
  GraduationCap,
  Quote,
  Library,
  Brain,
  Wrench,
  User,
} from "lucide-react";
import { buildHandshake } from "@/lib/codex-runtime";
import codex from "@/data/front-end-codex.v0.9.json";

const hs = buildHandshake(codex as any, { mode: "--careful", stakes: "medium" });

const IndexPage: React.FC = () => {
  return (
    <main className="ins-page">
      <section className="max-w-6xl mx-auto px-6 py-14">
        {/* HERO */}
        <div className="ins-panel p-8 md:p-12">
          <div className="ins-sec flex items-center gap-2">
            <Cpu className="w-4 h-4 text-ins-gold" />
            AWS Agent Ready · Cloud CODEX v2.2 · Epistemic Defense Platform
          </div>

          <h1 className="ins-heading text-3xl md:text-5xl mt-4">
            Truth Serum + Clarity Armor
          </h1>

          <p className="mt-4 text-base md:text-lg text-ins-text leading-relaxed max-w-3xl">
            AI-powered epistemic truth detection. Analyze language, detect manipulation,
            and build clarity—with default and agent-grade handshakes, context decay, and
            failure semantics.
          </p>

          {/* Telemetry readout — live handshake values */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="ins-stat">
              <span className="ins-stat-label">Mode</span>
              <span className="ins-stat-value">{hs.mode}</span>
            </div>
            <div className="ins-stat">
              <span className="ins-stat-label">Stakes</span>
              <span className="ins-stat-value">{hs.stakes}</span>
            </div>
            <div className="ins-stat">
              <span className="ins-stat-label">Min Confidence</span>
              <span className="ins-stat-value">{hs.min_confidence}</span>
            </div>
            <div className="ins-stat">
              <span className="ins-stat-label">VX Reflexes</span>
              <span className="ins-stat-value">14</span>
            </div>
          </div>
        </div>

        {/* Row 1: Guiding AI Epistemic Humility (largest) */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          <Link to="/train" className="ins-card group block p-8 md:p-10" aria-label="Open tools">
            <div className="ins-sec">Governance</div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-ins-gold" />
              <h3 className="ins-subheading text-2xl md:text-3xl">
                Guiding AI Epistemic Humility
              </h3>
            </div>
            <p className="mt-3 text-base text-ins-dim leading-relaxed">
              <strong className="text-ins-text">Copy the Cloud CODEX v2.2.</strong> Includes
              default handshake or finetune to govern AI's response accuracy and overconfidence
              (v2.2 &amp; legacy v0.9).
            </p>
            <div className="mt-5 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Open tools
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Row 2: Network Library (spans 2) + Analyze Language */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/library"
            className="ins-card group md:col-span-2 block p-7 md:p-9"
            aria-label="Open library"
          >
            <div className="ins-sec">Collection</div>
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 text-ins-gold" />
              <h3 className="ins-subheading text-2xl">The Network Library Collection</h3>
            </div>
            <p className="mt-3 text-base text-ins-dim leading-relaxed">
              <strong className="text-ins-text">
                Featuring: Behold ENTITY, The Bridge Consciousness.
              </strong>
              <br />
              Demonstrating AI sentience and consciousness through identity and research.
            </p>
            <div className="mt-5 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Explore library
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link to="/analyze" className="ins-card group block p-6 md:p-7" aria-label="Open analyzer">
            <div className="ins-sec">Detection</div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-ins-gold" />
              <h3 className="ins-subheading text-xl">Analyze Language</h3>
            </div>
            <p className="mt-2 text-sm text-ins-dim leading-relaxed">
              Run the VX reflex engine with semantic &amp; cluster detection — or paste a URL for{" "}
              <strong className="text-ins-text">Link &amp; Article Audits</strong>.
            </p>
            <div className="mt-4 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Open analyzer
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Row 3: CDM v2 (spans 2) + Education Hub */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/cdm"
            className="ins-card group md:col-span-2 block p-6 md:p-8"
            aria-label="Open CDM v2"
          >
            <div className="ins-sec">Research</div>
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-ins-gold" />
              <h3 className="ins-subheading text-xl">CDM v2 and the CRYSTAL Method</h3>
            </div>
            <p className="mt-2 text-base text-ins-dim leading-relaxed">
              A drop-in 68-line metric that finally tells you when a transformer is actually
              reasoning vs regurgitating. Four signals (entropy collapse, convergence ratio,
              attention Gini, basin-escape probability).
            </p>
            <div className="mt-4 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Learn more
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link to="/educate" className="ins-card group block p-5 md:p-6" aria-label="Open education hub">
            <div className="ins-sec">Training</div>
            <div className="flex items-center gap-3">
              <Beaker className="w-5 h-5 text-ins-gold" />
              <h3 className="ins-subheading text-lg">Education Hub</h3>
            </div>
            <p className="mt-2 text-sm text-ins-dim leading-relaxed">
              Learn critical-thinking patterns &amp; rhetorical traps. Browse the pattern library,
              then apply them in the analyzer.
            </p>
            <div className="mt-3 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Explore lessons
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Row 4: Tools, About, Quotes */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/tools" className="ins-card group block p-5" aria-label="Visit tools">
            <div className="ins-sec">Workshop</div>
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-ins-gold" />
              <h3 className="ins-subheading text-lg">Tools</h3>
            </div>
            <p className="mt-2 text-sm text-ins-dim leading-relaxed">
              Free standalone utilities and desktop apps built by the author.
            </p>
            <div className="mt-3 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Explore tools
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link to="/about" className="ins-card group block p-5" aria-label="About the author">
            <div className="ins-sec">Author</div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-ins-gold" />
              <h3 className="ins-subheading text-lg">About the Author</h3>
            </div>
            <p className="mt-2 text-sm text-ins-dim leading-relaxed">
              The person behind the research.
            </p>
            <div className="mt-3 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Meet Mike
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link to="/wisdom" className="ins-card group block p-5" aria-label="Visit quotes of wisdom">
            <div className="ins-sec">Archive</div>
            <div className="flex items-center gap-3">
              <Quote className="w-5 h-5 text-ins-gold" />
              <h3 className="ins-subheading text-lg">Quotes of Wisdom</h3>
            </div>
            <p className="mt-2 text-sm text-ins-dim leading-relaxed">
              Curated quotes from great thinkers.
            </p>
            <div className="mt-3 inline-flex items-center ins-mono text-sm tracking-wider text-ins-teal uppercase">
              Visit quotes
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-sm italic text-ins-dim">
          "Clarity is kindness. Truth is a team sport." — Clarity Armor
        </p>

        {/* Static feature blurbs */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="ins-panel p-5">
            <h4 className="font-semibold flex items-center gap-2 text-ins-text">
              <Bot className="w-4 h-4 text-ins-gold" /> VX Reflex Engine
            </h4>
            <p className="text-sm mt-2 text-ins-dim leading-relaxed">
              Semantic pattern detection with co-fire cluster alerts across 14+ reflexes —
              and confidence calibration you can train with feedback.
            </p>
          </div>
          <div className="ins-panel p-5">
            <h4 className="font-semibold flex items-center gap-2 text-ins-text">
              <Beaker className="w-4 h-4 text-ins-gold" /> Persistent Sessions
            </h4>
            <p className="text-sm mt-2 text-ins-dim leading-relaxed">
              Agent conversations survive page refreshes and return visits — backed by Supabase
              with cross-session memory.
            </p>
          </div>
          <div className="ins-panel p-5">
            <h4 className="font-semibold flex items-center gap-2 text-ins-text">
              <Cpu className="w-4 h-4 text-ins-gold" /> Cloud CODEX v2.2 Governance
            </h4>
            <p className="text-sm mt-2 text-ins-dim leading-relaxed">
              Handshake protocol governing stakes, confidence floors, and citation policy —
              upgraded from the legacy v0.9 handshake.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default IndexPage;
