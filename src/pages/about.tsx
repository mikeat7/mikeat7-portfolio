// src/pages/about.tsx
import React, { useEffect } from "react";
import {
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

/*
  SERVICES — drawn from Filippi's Finest (cestclever.wixsite.com/website).
  Saw-milling details are from the live site; the home-repair / "House Physician"
  framing is Mike's. NOTE TO MIKE: refine wording / add or remove services freely.
*/
const services = [
  {
    sec: "Saw-Milling",
    title: "Custom Saw-Milling",
    text: "Custom-cut lumber milled to any dimension or grade — hardwoods, softwoods, and specialty species. Bring your own logs or use wood I provide. For contractors, DIY builders, and woodworkers who can't find the right size or quality off the shelf.",
  },
  {
    sec: "Workshop",
    title: "Wood-Working & Custom Builds",
    text: "Finished woodwork and custom pieces, milled and built to your specification — practical, well-made, and true to the standard.",
  },
  {
    sec: "Home Care",
    title: "Home Diagnosis & Repair",
    text: "As a “House Physician,” I diagnose and treat the maladies that affect a home — careful, practical repairs and maintenance done properly the first time.",
  },
  {
    sec: "Logistics",
    title: "Free Pick-Up & Delivery",
    text: "Free pick-up and delivery on milling jobs throughout the Mississauga area — finding the right lumber shouldn't be a hassle.",
  },
];

/*
  WORK GALLERY — drop photos into public/images/work/ named work-01.jpg, work-02.jpg, …
  (any web image format works; just match the src below). Edit the captions to match.
  Missing files render as a neat placeholder tile, so it never looks broken.
*/
const WORK_COUNT = 99;
const workImages = Array.from(
  { length: WORK_COUNT },
  (_, i) => `/images/work/work-${String(i + 1).padStart(3, "0")}.jpg`
);

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
            <img
              src="/images/mike.jpg"
              alt="Mike Filippi"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border border-ins-line flex-shrink-0"
            />

            <div className="flex-1">
              <h1 className="ins-heading text-3xl md:text-4xl">Mike Filippi, Maker.</h1>
              <p className="ins-mono mt-2 text-sm tracking-wider uppercase text-ins-teal">
                Craftsman · Independent Researcher · Builder of Epistemic Tools
              </p>

              <div className="mt-6 space-y-4 text-[15.5px] text-ins-text leading-relaxed">
                <p>
                  By trade I am a "House Physician" — someone skilled in the art of diagnosing
                  and prescribing remedies, and treating the maladies that affect your home. I run{" "}
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

        {/* What Services Do I Offer */}
        <h2 className="ins-heading text-xl mt-12">What Services Do I Offer</h2>
        <p className="mt-2 text-sm text-ins-dim max-w-3xl">
          Filippi's Finest — Saw-Milling &amp; Wood-Working, Mississauga, Ontario.
          Welcome to Mike's Milling.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <img
            src="/images/sawn-log.jpg"
            alt="Fresh-sawn log"
            loading="lazy"
            className="w-full h-44 md:h-56 object-cover rounded border border-ins-line"
          />
          <img
            src="/images/sawmill.jpg"
            alt="The sawmill"
            loading="lazy"
            className="w-full h-44 md:h-56 object-cover rounded border border-ins-line"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.title} className="ins-card p-6 flex flex-col">
              <div className="ins-sec">{s.sec}</div>
              <h3 className="ins-subheading text-lg">{s.title}</h3>
              <p className="mt-3 text-sm text-ins-dim leading-relaxed flex-1">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 ins-panel p-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="ins-mono text-xs uppercase tracking-wider text-ins-gold">Get in touch</span>
          <a href="mailto:ekimat7@rogers.com" className="text-ins-teal hover:text-ins-goldbright transition-colors">ekimat7@rogers.com</a>
          <a href="tel:+14163335426" className="text-ins-teal hover:text-ins-goldbright transition-colors">416-333-5426</a>
          <span className="text-ins-dim">Mississauga, ON</span>
        </div>

        {/* Examples of My Work */}
        <h2 className="ins-heading text-xl mt-12">Examples of My Work</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {workImages.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="ins-card overflow-hidden block aspect-[4/3] bg-ins-deep"
            >
              <img
                src={src}
                alt={`Mike Filippi — work sample ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                onError={(e) => {
                  const tile = e.currentTarget.parentElement as HTMLElement | null;
                  if (tile) tile.style.display = "none";
                }}
              />
            </a>
          ))}
        </div>

        {/* Off the Clock — hobbies / a bit more about Mike */}
        <h2 className="ins-heading text-xl mt-12">Off the Clock</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure className="ins-card overflow-hidden flex flex-col">
            <img src="/images/heli.jpg" alt="Mike Filippi flying a commercial helicopter"
                 loading="lazy" className="w-full h-56 object-cover" />
            <figcaption className="p-4 text-sm text-ins-dim">
              <span className="ins-sec">Former Career</span>
              A previous life in the air — commercial helicopter pilot, now retired.
            </figcaption>
          </figure>
          <figure className="ins-card overflow-hidden flex flex-col">
            <img src="/images/tkd.jpg" alt="Mike Filippi with his Tae Kwon Do master"
                 loading="lazy" className="w-full h-56 object-cover" />
            <figcaption className="p-4 text-sm text-ins-dim">
              <span className="ins-sec">Discipline</span>
              Tae Kwon Do black belt — with my master.
            </figcaption>
          </figure>
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
