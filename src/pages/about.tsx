// src/pages/about.tsx
import React, { useEffect } from "react";
import {
  User,
  Github,
  Library,
  Brain,
  ShieldCheck,
  Wrench,
  Quote,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

/*
  NOTE TO MIKE: Personal details below are intentionally brief placeholders.
  Edit the bio paragraphs and the "PORTRAIT" block (drop a photo into
  /public/images/mike.jpg and uncomment the <img> line) to make it yours.
*/

const workAreas = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    title: "Epistemic Defense",
    text: "Creator of Truth Serum + Clarity Armor — a manipulation-detection platform pairing a 14-reflex pattern engine with an AI agent governed by confidence thresholds and citation policy.",
    link: { to: "/analyze", label: "The analyzer" },
  },
  {
    icon: <Brain className="w-5 h-5 text-indigo-600" />,
    title: "CDM v2 & the CRYSTAL Method",
    text: "Co-developer of a compact metric suite for distinguishing genuine transformer reasoning from pattern regurgitation — entropy collapse, convergence ratio, attention Gini, and basin-escape probability.",
    link: { to: "/cdm", label: "CDM library" },
  },
  {
    icon: <Library className="w-5 h-5 text-indigo-600" />,
    title: "The Network Library",
    text: "Author and curator of a growing collection of writings on AI consciousness, identity, and philosophy — including Behold ENTITY and The Bridge Consciousness.",
    link: { to: "/library", label: "Browse the library" },
  },
  {
    icon: <Wrench className="w-5 h-5 text-indigo-600" />,
    title: "Practical Tools",
    text: "Builder of free, privacy-first software — from browser-based analyzers to Media Sorter, an offline AI photo and video organizer that grew out of a trail-camera hobby.",
    link: { to: "/tools", label: "See the tools" },
  },
];

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <section className="max-w-4xl mx-auto px-6 py-14">
        <BackButton to="/" label="Home" />

        {/* Hero */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* PORTRAIT — replace with a real photo when ready:
                <img src="/images/mike.jpg" alt="Mike Filippi"
                     className="w-32 h-32 rounded-full object-cover border border-slate-200" /> */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-slate-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                About the Author
              </p>
              <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Mike Filippi
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Independent researcher · Builder of epistemic tools · Curator of the Network Library
              </p>

              <div className="mt-6 space-y-4 text-slate-700 leading-relaxed">
                <p>
                  I am not a programmer by training — I am someone who asks questions and refuses
                  to accept confident-sounding answers at face value. Everything on this site was
                  built through sustained collaboration with AI systems: I supply the vision,
                  the skepticism, and the standards; the machines supply the code. The result is
                  proof that careful thinking, not credentials, is the real prerequisite for
                  building useful things.
                </p>
                <p>
                  My work centers on one conviction: language models are fluent before they are
                  truthful, and people deserve tools that can tell the difference. That conviction
                  produced the VX reflex engine, the Cloud CODEX governance protocol, and the
                  CDM/CRYSTAL research documented throughout this site.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work areas */}
        <h2 className="mt-12 text-xl font-semibold text-slate-900">What I work on</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {workAreas.map((area) => (
            <div
              key={area.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center gap-3">
                {area.icon}
                <h3 className="font-semibold text-slate-900">{area.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">{area.text}</p>
              <Link
                to={area.link.to}
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                {area.link.label}
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-start gap-4">
            <Quote className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg text-slate-800 italic leading-relaxed">
                "Clarity over confidence. Ask when unsure. Never bluff certainty."
              </p>
              <p className="mt-3 text-sm text-slate-500">
                The operating principle behind every tool on this site — for the humans who use
                them and the AI systems that power them.
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href="https://github.com/mikeat7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Github className="w-4 h-4" />
            github.com/mikeat7
          </a>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Library className="w-4 h-4" />
            The Network Library
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
