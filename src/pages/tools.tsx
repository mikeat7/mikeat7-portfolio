// src/pages/tools.tsx
import React, { useState, useEffect } from "react";
import {
  Copy,
  CheckCircle,
  ExternalLink,
  Wrench,
  Activity,
  Cpu,
  Layers,
  Camera,
  Github,
} from "lucide-react";
import BackButton from "@/components/BackButton";

interface Tool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Path to a self-contained HTML tool (Open + Copy HTML buttons) */
  file?: string;
  /** GitHub repo for downloadable desktop apps (View on GitHub button) */
  github?: string;
  /** Guide page for downloadable scripts (Open Guide button; downloads live on the guide) */
  guide?: string;
  icon: React.ReactNode;
  tags: string[];
}

const tools: Tool[] = [
  {
    id: "media-sorter",
    title: "Media Sorter",
    subtitle: "AI Photo & Video Organizer (Desktop App)",
    description:
      "Born as a trail-camera tool, now a full offline media organizer. Scans any folder of photos or videos and sorts them into labelled subfolders using three AI models — MegaDetector (animals, people, vehicles), OpenCLIP (scenes, plus custom categories you define by typing a sentence), and facial recognition. Eight modes including duplicate detection, visual similarity search, and event clustering. Runs entirely on your own computer — no cloud, no accounts, nothing uploaded.",
    github: "https://github.com/mikeat7/Media_Sorter",
    icon: <Camera className="w-6 h-6 text-ins-gold" />,
    tags: ["AI Vision", "Trail Cameras", "Photo Organization", "Offline", "Windows"],
  },
  {
    id: "music-scanner",
    title: "Music Library Scanner & Builder",
    subtitle: "MP3/WAV Rescue Suite (Python Scripts)",
    description:
      "Two command-line tools that rescued a thirty-year music collection. The Scanner diagnoses every MP3 and WAV in a library — corruption, songs that cut off early, duplicates, ringtone-length fragments, even live recordings with spoken intros or applause. The Builder then copies only the healthy files into a clean, alphabetized Artist - Title library. Proven on 6,000+ real files (it found a 35% truncation rate in a Napster-era folder). Originals are never touched; everything runs offline.",
    guide: "/tools/music-scanner.html",
    github: "https://github.com/mikeat7/Music_Scanner",
    icon: <Layers className="w-6 h-6 text-ins-gold" />,
    tags: ["Music", "File Integrity", "Duplicates", "Offline", "Python"],
  },
  {
    id: "crystalscope",
    title: "CrystalScope",
    subtitle: "Argument Depth Analyzer",
    description:
      "Measures structural reasoning depth — not surface vocabulary. Six independent signals: argument architecture, epistemic hygiene, conceptual density, structural integrity, domain reach, and precision index. Inspired by the CRYSTAL / CDM framework developed by Elias Rook and Mike Filippi. Genuinely hard to max out — scores above 80 are rare.",
    file: "/tools/crystalscope.html",
    icon: <Activity className="w-6 h-6 text-ins-gold" />,
    tags: ["Text Analysis", "CDM", "CRYSTAL Framework", "AI Evaluation"],
  },
  {
    id: "session-estimator",
    title: "Session History Analyzer",
    subtitle: "Smart Token & Word Counter",
    description:
      "Paste any session log, document, or conversation and instantly see word count, character count, and a smart token estimate calibrated to within ~3% of Claude, Grok, and Llama tokenizers. Essential for tracking context window usage and planning long AI sessions.",
    file: "/tools/session-estimator.html",
    icon: <Cpu className="w-6 h-6 text-ins-gold" />,
    tags: ["Token Counting", "AI Sessions", "Utilities"],
  },
  {
    id: "gcode-simulator",
    title: "Universal G-Code Simulator",
    subtitle: "Browser-Based CNC & 3D Print Visualizer",
    description:
      "Visualize and dry-run CNC and 3D printing G-code directly in the browser with real-time path rendering. Supports generic and project-specific modes. No installation, no file uploads — runs entirely client-side so your designs stay private.",
    file: "/tools/gcode-simulator.html",
    icon: <Wrench className="w-6 h-6 text-ins-gold" />,
    tags: ["CNC", "3D Printing", "Engineering"],
  },
  {
    id: "magnet-array-designer",
    title: "Magnet Array Designer",
    subtitle: "Field Visualization & Array Configuration",
    description:
      "Design and visualize custom magnet arrays with configurable pole patterns, geometry, and field parameters. Built for exploring Halbach arrays and other magnetic configurations. Runs fully in the browser — no server, no data sent anywhere. (And yes — this tool's design inspired the look of the entire site.)",
    file: "/tools/magnet-array-designer.html",
    icon: <Layers className="w-6 h-6 text-ins-gold" />,
    tags: ["Magnetics", "Engineering", "Physics"],
  },
  {
    id: "depth-lens",
    title: "Depth Lens v1.5",
    subtitle: "Text Depth Meter (Legacy)",
    description:
      "The original depth scoring tool — measures vocabulary entropy, Gini coefficient, and word-scramble resilience. Note its known limitations: the score saturates at 158 and virtually all well-written text eventually reaches 'Prodigy-grade Depth', making it a poor discriminator. It rewards rare vocabulary over genuine argument structure. Kept here for reference; CrystalScope supersedes it.",
    file: "/tools/depth-lens.html",
    icon: <Activity className="w-6 h-6 text-ins-dim" />,
    tags: ["Legacy", "Text Analysis", "CDM"],
  },
];

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleCopyHTML = async () => {
    if (!tool.file) return;
    setCopying(true);
    try {
      const res = await fetch(tool.file);
      const html = await res.text();
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      alert("Could not copy HTML. Try opening the tool and using Save As.");
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="ins-card p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">{tool.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="ins-subheading text-xl">{tool.title}</h3>
          <p className="ins-mono text-xs tracking-wider uppercase text-ins-dim mt-1">
            {tool.subtitle}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-[15px] text-ins-dim leading-relaxed">{tool.description}</p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span key={tag} className="ins-chip">
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {tool.github && (
          <a
            href={tool.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ins-btn ins-btn-gold"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        )}
        {tool.guide && (
          <a
            href={tool.guide}
            target="_blank"
            rel="noopener noreferrer"
            className="ins-btn ins-btn-gold"
          >
            <ExternalLink className="w-4 h-4" />
            Guide &amp; Download
          </a>
        )}
        {tool.file && (
          <a
            href={tool.file}
            target="_blank"
            rel="noopener noreferrer"
            className="ins-btn ins-btn-gold"
          >
            <ExternalLink className="w-4 h-4" />
            Open Tool
          </a>
        )}
        {tool.file && (
          <button onClick={handleCopyHTML} disabled={copying} className="ins-btn disabled:opacity-50">
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-ins-teal" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {copying ? "Copying…" : "Copy HTML"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ToolsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="ins-page">
      <section className="max-w-6xl mx-auto px-6 py-14">
        {/* Page Header */}
        <div className="ins-panel p-8 md:p-12 mb-8">
          <BackButton to="/" label="Home" className="!text-ins-teal hover:!text-ins-goldbright" />
          <div className="mt-5">
            <div className="ins-sec flex items-center gap-2">
              <Wrench className="w-4 h-4 text-ins-gold" />
              Workshop · Standalone Software
            </div>
            <h1 className="ins-heading text-3xl md:text-5xl mt-4">Tools</h1>
            <p className="mt-4 text-base md:text-lg text-ins-text leading-relaxed max-w-3xl">
              Free software built by the author — self-contained browser tools and downloadable
              desktop apps. No login, no server, no data collection. Browser tools open directly
              or copy as HTML to run locally; desktop apps install from GitHub. Each tool was born
              from conversations with AI and refined for real use.
            </p>
          </div>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-sm italic text-ins-dim text-center">
          All browser tools run entirely on your device. Nothing is sent to any server.
        </p>
      </section>
    </main>
  );
};

export default ToolsPage;
