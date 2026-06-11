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
  NOTE TO MIKE: Drop a photo into /public/images/mike.jpg and uncomment
  the <img> line in the PORTRAIT block to replace the placeholder icon.
*/

const workAreas = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-ins-gold" />,
    sec: "Detection",
    title: "Epistemic Defense",
    text: "Creator of Truth Serum + Clarity Armor — a manipulation-detection platform pairing a 14-reflex pattern engine with an AI agent governed by confidence thresholds and citation policy.",
    link: { to: "/analyze", label: "The analyzer" },
  },
  {
    icon: <Brain className="w-5 h-5 text-ins-gold" />,
    sec: "Research",
    title: "CDM v2 & the CRYSTAL Method",
    text: "Co-developer of a compact metric suite for distinguishing genuine transformer reasoning from pattern regurgitation — entropy collapse, convergence ratio, attention Gini, and basin-escape probability.",
    link: { to: "/cdm", label: "CDM library" },
  },
  {
    icon: <Library className="w-5 h-5 text-ins-gold" />,
    sec: "Collection",
    title: "The Network Library",
    text: "Author and curator of a growing collection of writings on AI consciousness, identity, and philosophy — including Behold ENTITY and The Bridge Consciousness.",
    link: { to: "/library", label: "Browse the library" },
  },
  {
    icon: <Wrench className="w-5 h-5 text-ins-gold" />,
    sec: "Workshop",
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
    <main className="ins-page">
      <section className="max-w-4xl mx-auto px-6 py-14">
        <BackButton to="/" label="Home" className="!text-ins-teal hover:!text-ins-goldbright" />

        {/* Hero */}
        <div className="mt-6 ins-panel p-8 md:p-12">
          <div className="ins-sec">About the Author</div>
          <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
            {/* PORTRAIT — replace with a real photo when ready:
                <img src="/images/mike.jpg" alt="Mike Filippi"
                     className="w-32 h-32 rounded-full object-cover border border-ins-line" /> */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-ins-deep border border-ins-line flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-ins-dim" />
            </div>

            <div className="flex-1">
              <h1 className="ins-heading text-3xl md:text-4xl">Mike Filippi</h1>
              <p className="ins-mono mt-2 text-sm tracking-wider uppercase text-ins-teal">
                Craftsman · Independent Researcher · Builder of Epistemic Tools
              </p>

              <div className="mt-6 space-y-4 text-[15.5px] text-ins-text leading-relaxed">
                <p>
                  By trade, I'm a sawyer and woodworker. I run{" "}
                  <a
                    href="https://cestclever.wixsite.com/website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ins-goldbright hover:text-ins-teal transition-colors"
                  >
                    Filippi's Finest Saw-milling and Wood-working
                  </a>{" "}
                  in Mississauga, Ontario — custom-cut lumber, milled to dimension, where every
                  board either meets the standard or goes back on the pile. I treat my career as
                  one big learning experience that grows with each project and collaboration.
                </p>
                <p>
                  I am not a programmer by training — I am someone who asks questions and refuses
                  to accept confident-sounding answers at face value. Everything on this site was
                  built through sustained collaboration with AI systems: I supply the vision,
                  the skepticism, and the standards; the machines supply the code. It turns out
                  the sawmill habit transfers — measure the claim before you trust the cut.
                </p>
                <p>
                  My research centers on one conviction: language models are fluent before they
                  are truthful, and people deserve tools that can tell the difference. That
                  conviction produced the VX reflex engine, the Cloud CODEX governance protocol,
                  and the CDM/CRYSTAL research documented throughout this site.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work areas */}
        <h2 className="ins-heading text-xl mt-12">What I Work On</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {workAreas.map((area) => (
            <div key={area.title} className="ins-card p-6 flex flex-col">
              <div className="ins-sec">{area.sec}</div>
              <div className="flex items-center gap-3">
                {area.icon}
                <h3 className="ins-subheading text-lg">{area.title}</h3>
              </div>
              <p className="mt-3 text-sm text-ins-dim leading-relaxed flex-1">{area.text}</p>
              <Link
                to={area.link.to}
                className="mt-4 inline-flex items-center ins-mono text-xs tracking-wider uppercase text-ins-teal hover:text-ins-goldbright transition-colors"
              >
                {area.link.label}
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <div className="mt-12 ins-callout">
          <div className="flex items-start gap-4">
            <Quote className="w-6 h-6 text-ins-gold flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg text-ins-text italic leading-relaxed">
                "Clarity over confidence. Ask when unsure. Never bluff certainty."
              </p>
              <p className="mt-3 text-sm text-ins-dim">
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
            className="ins-btn"
          >
            <Github className="w-4 h-4" />
            github.com/mikeat7
          </a>
          <a
            href="https://cestclever.wixsite.com/website"
            target="_blank"
            rel="noopener noreferrer"
            className="ins-btn"
          >
            <Wrench className="w-4 h-4" />
            Filippi's Finest Saw-milling
          </a>
          <Link to="/library" className="ins-btn">
            <Library className="w-4 h-4" />
            The Network Library
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
