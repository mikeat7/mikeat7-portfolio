import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const bubbleThoughts = [
  "its too complicated",
  "what are they thinking",
  "too much information",
  "if only I had a way to 'know'",
  "how can I tell if they are lying",
  "it not a bug, its a feature",
  "consensus is not science",
];

const primaryTools = [
  {
    label: "Analyze Language",
    route: "/analyze",
    description: "Detect rhetorical patterns and emotional manipulation",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    label: "Education Hub",
    route: "/educate",
    description: "Learn critical thinking and epistemic tools",
    color: "bg-green-600 hover:bg-green-700",
  },
];

const specializedTools = [
  {
    label: "Scientific Paper Scanner",
    route: "/paper",
    description: "Analyze research papers for bias and omissions",
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    label: "Bot Detection",
    route: "/bot-detection",
    description: "Identify automated or artificial content",
    color: "bg-orange-600 hover:bg-orange-700",
  },
 
];

const wisdomTools = [
  {
    label: "Quotes of Wisdom",
    route: "/wisdom",
    description: "Curated insights from great thinkers",
    color: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    label: "Train an AI to be Honest",
    route: "/train",
    description: "Teach language models epistemic humility",
    color: "bg-teal-600 hover:bg-teal-700",
  },
];

const Button = ({ onClick, children, className }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded text-white font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

export default function HomePage() {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      <div className="bubble-bg">
        {bubbleThoughts.map((text, i) => (
          <div key={i} className="bubble-text">
            {text}
          </div>
        ))}
      </div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="text-center pt-16 pb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            Truth Serum + Clarity Armor
          </h1>
          <p className="text-xl text-gray-600 mb-2 drop-shadow-sm">
            Voice-AI powered Epistemic Truth Detection
          </p>
          <p className="text-sm text-gray-500 italic">
            Analyze language • Detect manipulation • Build clarity
          </p>
        </div>
        <div className="flex-1 px-6 pb-16">
          <div className="max-w-6xl mx-auto space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 drop-shadow-sm">
                Core Analysis Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {primaryTools.map((tool) => (
                  <div
                    key={tool.route}
                    onClick={() => handleNavigate(tool.route)}
                    className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {tool.label}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="mt-4">
                      <Button className={tool.color}>Explore →</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 drop-shadow-sm">
                Specialized Scanners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {specializedTools.map((tool) => (
                  <div
                    key={tool.route}
                    onClick={() => handleNavigate(tool.route)}
                    className="group cursor-pointer bg-white/85 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {tool.label}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {tool.description}
                    </p>
                    <Button className={`${tool.color} text-xs`}>Launch →</Button>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 drop-shadow-sm">
                Wisdom & Training
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {wisdomTools.map((tool) => (
                  <div
                    key={tool.route}
                    onClick={() => handleNavigate(tool.route)}
                    className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {tool.label}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {tool.description}
                    </p>
                    <Button className={`${tool.color} text-xs`}>Access →</Button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <div className="text-center pb-8">
          <p className="text-sm text-gray-500 italic drop-shadow-sm mb-2">
            "The first principle is that you must not fool yourself — and you are the easiest person to fool." — Richard Feynman
          </p>
        </div>
      </div>
    </div>
  );
}