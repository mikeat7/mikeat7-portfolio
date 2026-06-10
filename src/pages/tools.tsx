// src/pages/tools.tsx
import React, { useState, useEffect } from "react";
import { Copy, CheckCircle, ExternalLink, Wrench, Activity, Cpu, Layers, Camera, Github } from "lucide-react";
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
    icon: <Camera className="w-6 h-6" style={{ color: "#ffd700" }} />,
    tags: ["AI Vision", "Trail Cameras", "Photo Organization", "Offline", "Windows"],
  },
  {
    id: "crystalscope",
    title: "CrystalScope",
    subtitle: "Argument Depth Analyzer",
    description:
      "Measures structural reasoning depth — not surface vocabulary. Six independent signals: argument architecture, epistemic hygiene, conceptual density, structural integrity, domain reach, and precision index. Inspired by the CRYSTAL / CDM framework developed by Elias Rook and Mike Filippi. Genuinely hard to max out — scores above 80 are rare.",
    file: "/tools/crystalscope.html",
    icon: <Activity className="w-6 h-6" style={{ color: "#ffd700" }} />,
    tags: ["Text Analysis", "CDM", "CRYSTAL Framework", "AI Evaluation"],
  },
  {
    id: "session-estimator",
    title: "Session History Analyzer",
    subtitle: "Smart Token & Word Counter",
    description:
      "Paste any session log, document, or conversation and instantly see word count, character count, and a smart token estimate calibrated to within ~3% of Claude, Grok, and Llama tokenizers. Essential for tracking context window usage and planning long AI sessions.",
    file: "/tools/session-estimator.html",
    icon: <Cpu className="w-6 h-6" style={{ color: "#ffd700" }} />,
    tags: ["Token Counting", "AI Sessions", "Utilities"],
  },
  {
    id: "gcode-simulator",
    title: "Universal G-Code Simulator",
    subtitle: "Browser-Based CNC & 3D Print Visualizer",
    description:
      "Visualize and dry-run CNC and 3D printing G-code directly in the browser with real-time path rendering. Supports generic and project-specific modes. No installation, no file uploads — runs entirely client-side so your designs stay private.",
    file: "/tools/gcode-simulator.html",
    icon: <Wrench className="w-6 h-6" style={{ color: "#ffd700" }} />,
    tags: ["CNC", "3D Printing", "Engineering"],
  },
  {
    id: "magnet-array-designer",
    title: "Magnet Array Designer",
    subtitle: "Field Visualization & Array Configuration",
    description:
      "Design and visualize custom magnet arrays with configurable pole patterns, geometry, and field parameters. Built for exploring Halbach arrays and other magnetic configurations. Runs fully in the browser — no server, no data sent anywhere.",
    file: "/tools/magnet-array-designer.html",
    icon: <Layers className="w-6 h-6" style={{ color: "#ffd700" }} />,
    tags: ["Magnetics", "Engineering", "Physics"],
  },
  {
    id: "depth-lens",
    title: "Depth Lens v1.5",
    subtitle: "Text Depth Meter (Legacy)",
    description:
      "The original depth scoring tool — measures vocabulary entropy, Gini coefficient, and word-scramble resilience. Note its known limitations: the score saturates at 158 and virtually all well-written text eventually reaches 'Prodigy-grade Depth', making it a poor discriminator. It rewards rare vocabulary over genuine argument structure. Kept here for reference; CrystalScope supersedes it.",
    file: "/tools/depth-lens.html",
    icon: <Activity className="w-6 h-6" style={{ color: "#aaaaaa" }} />,
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
    <div
      className="rounded-2xl p-6 md:p-8"
      style={{
        background: "#e9eef5",
        boxShadow: "inset 8px 8px 16px #cfd6e0, inset -8px -8px 16px #ffffff",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">{tool.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-slate-900">{tool.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{tool.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
        {tool.description}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full text-slate-600 font-medium"
            style={{
              background: "#e9eef5",
              boxShadow: "3px 3px 6px #cfd6e0, -3px -3px 6px #ffffff",
            }}
          >
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-900 transition-transform hover:scale-[1.02] focus:outline-none"
            style={{
              background: "#e9eef5",
              boxShadow: "5px 5px 10px #cfd6e0, -5px -5px 10px #ffffff",
            }}
          >
            <Github className="w-4 h-4" style={{ color: "#ffd700" }} />
            View on GitHub
          </a>
        )}
        {tool.file && (
        <a
          href={tool.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-900 transition-transform hover:scale-[1.02] focus:outline-none"
          style={{
            background: "#e9eef5",
            boxShadow: "5px 5px 10px #cfd6e0, -5px -5px 10px #ffffff",
          }}
        >
          <ExternalLink className="w-4 h-4" style={{ color: "#ffd700" }} />
          Open Tool
        </a>
        )}

        {tool.file && (
        <button
          onClick={handleCopyHTML}
          disabled={copying}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-900 transition-transform hover:scale-[1.02] focus:outline-none disabled:opacity-50"
          style={{
            background: "#e9eef5",
            boxShadow: copied
              ? "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff"
              : "5px 5px 10px #cfd6e0, -5px -5px 10px #ffffff",
          }}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" style={{ color: "#ffd700" }} />
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
    <main className="min-h-screen bg-[#e9eef5] text-slate-800">
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div
          className="relative rounded-3xl p-10 md:p-14 mb-10"
          style={{
            background: "#e9eef5",
            boxShadow: "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <BackButton to="/" label="Home" />
          <div className="mt-4 flex flex-col gap-3">
            <div className="inline-flex items-center text-xs md:text-sm text-slate-600">
              <Wrench className="w-4 h-4 mr-2" style={{ color: "#ffd700" }} />
              <span className="font-semibold">Standalone HTML Tools</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Tools
            </h1>
            <p className="text-base md:text-lg text-slate-700">
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
        <p className="mt-10 text-sm italic text-slate-600 text-center">
          All tools run entirely in your browser. Nothing is sent to any server.
        </p>
      </section>
    </main>
  );
};

export default ToolsPage;
