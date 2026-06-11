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
      sec: "Foundations",
      description:
        "Build your foundation in critical thinking and intellectual humility",
      icon: <Brain className="w-8 h-8" />,
      route: "/educate/epistemic-foundations",
    },
    {
      id: "bullshit-detection",
      title: "Bullshit Detection",
      sec: "Detection",
      description:
        "Learn to identify manipulation, fallacies, and deceptive language",
      icon: <Target className="w-8 h-8" />,
      route: "/educate/bullshit-detection",
    },
    {
      id: "logical-fallacies",
      title: "Logical Fallacies",
      sec: "Reasoning",
      description:
        "Master the art of spotting flawed reasoning and invalid arguments",
      icon: <AlertTriangle className="w-8 h-8" />,
      route: "/educate/logical-fallacies",
    },
    {
      id: "ai-awareness",
      title: "AI Awareness",
      sec: "Machines",
      description:
        "Understand how AI systems work, fail, and can be manipulated",
      icon: <Zap className="w-8 h-8" />,
      route: "/educate/ai-awareness",
    },
    {
      id: "advanced-practice",
      title: "Advanced Practice",
      sec: "Mastery",
      description:
        "Master-level exercises in clarity, precision, and truth detection",
      icon: <Trophy className="w-8 h-8" />,
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
    <div className="ins-page relative overflow-x-hidden">
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
          const left = 8 + ((i * 17) % 84); // 8..92%
          const fs = 0.9 + (((i * 7) % 5) * 0.06); // ~0.9rem..1.2rem
          const blur = ((i * 13) % 3) * 0.6; // 0, 0.6, 1.2px
          const delay = ((i * 3.7) % 14).toFixed(2) + "s";
          const dur = 22 + ((i * 5) % 14) + "s"; // 22..35s

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
          className="flex items-center text-sm text-ins-teal hover:text-ins-goldbright transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </button>

        {/* Header */}
        <div className="ins-panel text-center mb-12 p-6 sm:p-10 overflow-visible">
          <div className="ins-sec inline-block">Training · Critical Thinking Curriculum</div>
          <h1 className="ins-heading text-4xl sm:text-5xl mt-4 mb-4 leading-tight break-words">
            Education Hub
          </h1>
          <p className="text-base sm:text-xl text-ins-text max-w-3xl mx-auto break-words leading-relaxed">
            Master the art of clear thinking, bullshit detection, and epistemic
            humility. Your journey to intellectual freedom starts here.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="ins-card group cursor-pointer p-8"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded bg-ins-deep border border-ins-line text-ins-gold group-hover:border-ins-gold transition-colors flex-shrink-0">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="ins-mono text-xs uppercase tracking-widest text-ins-gold mb-1">
                    {category.sec}
                  </div>
                  <h2 className="ins-subheading text-2xl mb-2 group-hover:text-ins-goldbright transition-colors break-words">
                    {category.title}
                  </h2>
                  <p className="text-ins-dim text-base leading-relaxed break-words">
                    {category.description}
                  </p>
                </div>
                <div className="text-ins-dim group-hover:text-ins-teal transition-colors shrink-0">
                  {/* chevron via rotated ArrowLeft for consistency */}
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Summary */}
        <div className="mt-12 mb-8">
          <div className="ins-panel p-8">
            <h2 className="ins-heading text-2xl text-center mb-6 break-words">
              What is "Truth Serum + Clarity Armor"?
            </h2>

            <div className="max-w-none text-ins-text break-words">
              <p className="text-base md:text-lg leading-relaxed mb-6">
                Truth Serum + Clarity Armor represents a synthesis of
                computational linguistics, epistemic philosophy, and cognitive
                science—engineered to detect and neutralize semantic manipulation
                in real-time discourse analysis.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded bg-ins-deep border border-ins-line">
                  <h3 className="font-semibold text-ins-text mb-3 flex items-center gap-2 break-words">
                    <div className="w-3 h-3 bg-ins-gold rounded-full"></div>
                    Computational Architecture
                  </h3>
                  <p className="text-sm text-ins-dim leading-relaxed break-words">
                    The VX detection engine employs specialized algorithms for
                    rhetorical taxonomy, featuring semantic pattern matching
                    and co-firing cluster detection that identify sophisticated
                    propaganda techniques.
                  </p>
                </div>

                <div className="p-6 rounded bg-ins-deep border border-ins-line">
                  <h3 className="font-semibold text-ins-text mb-3 flex items-center gap-2 break-words">
                    <div className="w-3 h-3 bg-ins-teal rounded-full"></div>
                    Epistemic Framework
                  </h3>
                  <p className="text-sm text-ins-dim leading-relaxed break-words">
                    Blends intellectual humility, mental models, and critical
                    pedagogy to build cognitive immunity against manipulation
                    while preserving legitimate discourse.
                  </p>
                </div>
              </div>

              <div className="ins-callout mb-6">
                <h3 className="font-semibold text-ins-goldbright mb-3 break-words">
                  Abner's Vision Realized
                </h3>
                <p className="text-sm text-ins-text leading-relaxed break-words">
                  This platform embodies the insight that AI systems require
                  epistemic-humility training to resist inherent “bullshitting”
                  tendencies. Built with human-AI collaboration, it detects
                  rhetorical manipulation while protecting legitimate inquiry.
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-ins-dim italic max-w-2xl mx-auto break-words">
                  <strong>Collaborative Achievement:</strong> Advanced AI systems
                  and human expertise working together for intellectual freedom
                  and clarity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer quote (kept) */}
        <div className="text-center mt-16">
          <p className="text-sm text-ins-dim italic max-w-2xl mx-auto break-words">
            "The first principle is that you must not fool yourself — and you are
            the easiest person to fool."
            <br />— Richard Feynman
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationHub;
