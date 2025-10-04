// src/pages/educate.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Target,
  AlertTriangle,
  Zap,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import "@/styles.css"; // ← rising text bubbles

const EducationHub: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  const handleBackToHome = () => {
    navigate("/");
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const categories = [
    {
      id: "epistemic-foundations",
      title: "Epistemic Foundations",
      description: "Build your foundation in critical thinking and intellectual humility",
      icon: <Brain className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-600",
      route: "/educate/epistemic-foundations",
    },
    {
      id: "bullshit-detection",
      title: "Bullshit Detection",
      description: "Learn to identify manipulation, fallacies, and deceptive language",
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-500 to-violet-600",
      route: "/educate/bullshit-detection",
    },
    {
      id: "logical-fallacies",
      title: "Logical Fallacies",
      description: "Master the art of spotting flawed reasoning and invalid arguments",
      icon: <AlertTriangle className="w-8 h-8" />,
      color: "from-orange-500 to-amber-600",
      route: "/educate/logical-fallacies",
    },
    {
      id: "ai-awareness",
      title: "AI Awareness",
      description: "Understand how AI systems work, fail, and can be manipulated",
      icon: <Zap className="w-8 h-8" />,
      color: "from-cyan-500 to-teal-600",
      route: "/educate/ai-awareness",
    },
    {
      id: "advanced-practice",
      title: "Advanced Practice",
      description: "Master-level exercises in clarity, precision, and truth detection",
      icon: <Trophy className="w-8 h-8" />,
      color: "from-slate-500 to-gray-600",
      route: "/educate/advanced-practice",
    },
  ];

  // Rising "reflex thoughts" (≥10)
  const thoughts = [
    "How do we learn what is true?",
    "Why do they frame it that way?",
    "Consensus isn’t science.",
    "Correlation sometimes does equal causation.",
    "What evidence would change my mind?",
    "What’s missing from this story?",
    "Who benefits if I believe this?",
    "Am I reacting or reasoning?",
    "Information overload ≠ understanding.",
    "It’s a feature, not a bug.",
    "Which claims demand citations?",
    "How certain am I anyway?",
    "Is certainty doing work here?",
    "What’s the strongest counterexample?",
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Rising text background, behind all content */}
      <div
        className="bubble-bg pointer-events-none select-none"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0, // content gets zIndex:1+
        }}
      >
        {thoughts.map((t, i) => {
          // deterministic spread so bubbles don’t overlap
          const left = 8 + ((i * 17) % 84);           // 8..92%
          const fs = 0.9 + (((i * 7) % 5) * 0.06);    // ~0.9rem..1.2rem
          const blur = ((i * 13) % 3) * 0.6;          // 0, 0.6, 1.2px
          const delay = ((i * 3.7) % 14).toFixed(2) + "s";
          const dur = (22 + ((i * 5) % 14)) + "s";    // 22..35s

          return (
            <span
              key={i}
              className="bubble-text"
              style={
                {
                  // consumed by CSS as var(--left) etc.
                  "--left": `${left}%`,
                  "--fs": `${fs}rem`,
                  "--blur": `${blur}px`,
                  "--delay": delay,
                  "--duration": dur,
                } as React.CSSProperties
              }
            >
              {t}
            </span>
          );
        })}
      </div>

      {/* Content wrapper (raised, above bubbles) */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={handleBackToHome}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </button>

        {/* Header (neomorphic backdrop) */}
        <div
          className="text-center mb-12 rounded-3xl p-10"
          style={{
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Education Hub
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            Master the art of clear thinking, bullshit detection, and epistemic humility.
            Your journey to intellectual freedom starts here.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="group cursor-pointer rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] border border-white/50"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "9px 9px 18px rgba(163,177,198,0.35), -9px -9px 18px rgba(255,255,255,0.9)",
              }}
            >
              <div className="flex items-center gap-6">
                <div
                  className={`p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${category.color}`}
                  style={{
                    boxShadow:
                      "inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.25)",
                  }}
                >
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                  {/* chevron via rotated ArrowLeft for consistency */}
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Summary (neo panel) */}
        <div className="mt-12 mb-8">
          <div
            className="rounded-2xl p-8 border border-slate-200"
            style={{
              background: "#e9eef5",
              boxShadow:
                "9px 9px 18px rgba(163,177,198,0.35), -9px -9px 18px rgba(255,255,255,0.9)",
            }}
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
              What is "Truth Serum + Clarity Armor"?
            </h2>

            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg leading-relaxed mb-6">
                Truth Serum + Clarity Armor represents a synthesis of computational linguistics,
                epistemic philosophy, and cognitive science—engineered to detect and neutralize
                semantic manipulation in real-time discourse analysis.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div
                  className="p-6 rounded-xl border border-slate-200"
                  style={{
                    background: "#e9eef5",
                    boxShadow:
                      "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff",
                  }}
                >
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    Computational Architecture
                  </h3>
                  <p className="text-sm text-slate-700">
                    The VX detection engine employs specialized algorithms for rhetorical taxonomy,
                    featuring adaptive confidence calibration and co-firing vectors that identify
                    sophisticated propaganda techniques.
                  </p>
                </div>

                <div
                  className="p-6 rounded-xl border border-slate-200"
                  style={{
                    background: "#e9eef5",
                    boxShadow:
                      "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff",
                  }}
                >
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Epistemic Framework
                  </h3>
                  <p className="text-sm text-slate-700">
                    Blends intellectual humility, mental models, and critical pedagogy to build
                    cognitive immunity against manipulation while preserving legitimate discourse.
                  </p>
                </div>
              </div>

              <div
                className="p-6 rounded-xl border border-indigo-200 mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(238,242,255,0.7), rgba(245,243,255,0.7))",
                  boxShadow:
                    "inset 6px 6px 12px rgba(99,102,241,0.08), inset -6px -6px 12px rgba(255,255,255,0.6)",
                }}
              >
                <h3 className="font-semibold text-indigo-800 mb-3">
                  Abner's Vision Realized
                </h3>
                <p className="text-sm text-indigo-800/90 leading-relaxed">
                  This platform embodies the insight that AI systems require epistemic-humility
                  training to resist inherent “bullshitting” tendencies. Built with human-AI
                  collaboration, it detects rhetorical manipulation while protecting legitimate inquiry.
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 italic">
                  <strong>Collaborative Achievement:</strong> Advanced AI systems and human expertise
                  working together for intellectual freedom and clarity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer quote (kept) */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500 italic max-w-2xl mx-auto">
            "The first principle is that you must not fool yourself — and you are the easiest person to fool."
            <br />— Richard Feynman
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationHub;

