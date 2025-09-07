import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

import SignalLegend from "@/components/SignalLegend";

export default function ClaritySignalsPage() {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate('/educate/epistemic-foundations');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['clarity-signals'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Epistemic Foundations
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Understanding Clarity Signals</h1>
         

          <p className="mb-6 text-lg text-gray-700 leading-relaxed">
            Clarity Signals are a beta tool that reflect how an input may be *phrased*, not what it means or whether it's true.
            These indicators focus on rhetorical structure — including emotional tone, logical form, and epistemic language.
          </p>

          <SignalLegend />

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">What These Signals Do</h2>
          <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
            <li>Highlight when phrasing is clear and cautious (🟢 Clarity)</li>
            <li>Flag emotionally loaded or persuasive language (🟡 Tone)</li>
            <li>Detect logical contradictions or reasoning errors (🔴 Conflict)</li>
            <li>Stay silent if nothing notable is detected (⚪ Neutral)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">What These Signals Do <em>Not</em> Do</h2>
          <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
            <li>They do not judge truth, accuracy, or intent</li>
            <li>They do not analyze a speaker's motive</li>
            <li>They do not detect bias, deception, or malice</li>
            <li>They do not evaluate whether something is good or bad</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Suggested Use Cases</h2>
          <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
            <li>Compare tone between academic and opinion writing</li>
            <li>Spot rhetorical shifts in public communication</li>
            <li>Teach argumentation and epistemic humility</li>
            <li>Analyze emotional temperature in difficult conversations</li>
          </ul>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="italic text-sm text-blue-700">
              <strong>Note:</strong> Signal detection is experimental and reflective. It is not a substitute for critical thinking or context-aware interpretation.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <button
              onClick={completeLesson}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mx-auto"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}