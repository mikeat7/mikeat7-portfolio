// src/pages/educate/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck, Landmark, Cpu, Trophy, Search, Beaker, Brain, HelpCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

const Card: React.FC<{ to: string; title: string; desc: string; icon: React.ReactNode }> = ({ to, title, desc, icon }) => (
  <Link to={to}
    className="block rounded-2xl p-6 bg-[#e9eef5] hover:scale-[1.01] transition"
    style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
  >
    <div className="flex items-center gap-3">
      {icon}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    <p className="mt-2 text-sm text-slate-700">{desc}</p>
  </Link>
);

const EducateHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#e9eef5] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <BackButton />
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <h1 className="text-3xl font-bold text-slate-900">Education Hub</h1>
          <p className="mt-3 text-slate-700">
            Master the art of clear thinking, bullshit detection, and epistemic humility.
            Your journey to intellectual freedom starts here.
          </p>

          {/* Top sections from your original spec */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              to="/educate/epistemic-foundations"
              title="Epistemic Foundations"
              desc="Build your foundation in critical thinking and intellectual humility."
              icon={<Landmark className="w-5 h-5" />}
            />
            <Card
              to="/educate/bullshit-detection"
              title="Bullshit Detection"
              desc="Identify manipulation, fallacies, and deceptive language."
              icon={<ShieldCheck className="w-5 h-5" />}
            />
            <Card
              to="/educate/logical-fallacies"
              title="Logical Fallacies"
              desc="Spot flawed reasoning and invalid arguments."
              icon={<BookOpen className="w-5 h-5" />}
            />
            <Card
              to="/educate/ai-awareness"
              title="AI Awareness"
              desc="Understand how AI systems work, fail, and can be manipulated."
              icon={<Cpu className="w-5 h-5" />}
            />
            <Card
              to="/educate/advanced-practice"
              title="Advanced Practice"
              desc="Master-level exercises in clarity, precision, and truth detection."
              icon={<Trophy className="w-5 h-5" />}
            />
            <Card
              to="/educate/bullshit-patterns"
              title="Pattern Library"
              desc="Search expert-identified rhetorical and semantic patterns."
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Extra destinations you already route to */}
          <h2 className="mt-10 text-xl font-semibold text-slate-900">More modules</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              to="/educate/clarity-signals"
              title="Clarity Signals"
              desc="Positive indicators of honest, careful communication."
              icon={<Beaker className="w-5 h-5" />}
            />
            <Card
              to="/educate/epistemic-sandbox"
              title="Epistemic Sandbox"
              desc="Interactive practice area for hypotheses, tests, and uncertainty."
              icon={<Brain className="w-5 h-5" />}
            />
            <Card
              to="/educate/how-llms-bullshit"
              title="How LLMs Bullshit"
              desc="Understand and counteract model tendencies toward overclaiming."
              icon={<HelpCircle className="w-5 h-5" />}
            />
            <Card
              to="/train"
              title="Train an AI to be Honest"
              desc="(Future) Teach models epistemic humility with guided prompts."
              icon={<Cpu className="w-5 h-5" />}
            />
          </div>

          {/* Your signature quote */}
          <blockquote className="mt-10 p-5 rounded-2xl bg-[#e9eef5] italic text-slate-800"
            style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}
          >
            “The first principle is that you must not fool yourself — and you are the easiest person to fool.”
            <div className="text-sm not-italic text-slate-600 mt-2">— Richard Feynman</div>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default EducateHub;
