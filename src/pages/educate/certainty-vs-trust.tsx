import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, CheckCircle } from "lucide-react";
import BackButton from "@/components/BackButton";


const CertaintyVsTrust: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['certainty-vs-trust'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <BackButton />
       
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Why Certainty Sells, But Trust Wins
          </h1>
          <p className="text-lg text-gray-600">
            Understanding the difference between confidence and trustworthiness
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 space-y-6">
              <p className="text-xl leading-relaxed">
                Certainty is seductive. People trust strong opinions, even when they're wrong. This is why
                charismatic figures can gain followers — they sound sure.
              </p>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">The Certainty Trap</h3>
                <p className="text-red-700">
                  But in complex systems, certainty is often a red flag. Science and honesty thrive on doubt,
                  revision, and careful framing — not declarations.
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Building Real Trust</h3>
                <p className="text-green-700">
                  Build trust instead: be open about uncertainty, cite sources, admit when evidence is lacking.
                  It's slower — but more powerful in the long run.
                </p>
              </div>
              
              <blockquote className="text-xl italic text-center text-gray-600 border-l-4 border-blue-400 pl-6 py-4 bg-blue-50 rounded-r-lg">
                "Strong opinions, weakly held" is a sign of epistemic humility, not weakness.
              </blockquote>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Insights</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Why Certainty Appeals</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Reduces cognitive load</li>
                      <li>• Provides emotional comfort</li>
                      <li>• Signals authority and competence</li>
                      <li>• Simplifies complex decisions</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Why Trust Matters More</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Acknowledges complexity</li>
                      <li>• Allows for course correction</li>
                      <li>• Builds long-term credibility</li>
                      <li>• Encourages critical thinking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
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
  );
};

export default CertaintyVsTrust;