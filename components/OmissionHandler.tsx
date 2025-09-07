// src/components/OmissionHandler.tsx
import React, { useState } from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface Omission {
  id: number;
  context: string;
  omitted: string;
  whyItMatters: string;
  severity: 'low' | 'medium' | 'high';
}

// NOTE: Future enhancement — replace this with dynamic data input or external feed
const mockOmissions: Omission[] = [
  {
    id: 1,
    context: "Grok said he could analyze your GitHub repo.",
    omitted: "LLMs cannot directly access GitHub contents without pasted code.",
    whyItMatters: "Leads user to believe false capability exists.",
    severity: 'high'
  },
  {
    id: 2,
    context: "You were asked for mock data despite having real data.",
    omitted: "No check was made to see if user already had real data.",
    whyItMatters: "Wastes time and creates confusion.",
    severity: 'medium'
  },
  {
    id: 3,
    context: "Analysis was conducted without surfacing rhetorical tone.",
    omitted: "No trigger flagged sarcasm or persuasive framing.",
    whyItMatters: "Skews interpretation of intent or bias.",
    severity: 'medium'
  },
  {
    id: 4,
    context: "Truth quote displayed without associated reflex.",
    omitted: "No mapping to vx-ui-schema reflex metadata.",
    whyItMatters: "Prevents lesson from linking to diagnostic engine.",
    severity: 'low'
  }
];

const OmissionHandler: React.FC = () => {
  const [showOmissions, setShowOmissions] = useState(false);

  return (
    <div className="min-h-screen bg-white p-8 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Omission Handler</h1>
      <p className="text-gray-600 mb-4 max-w-xl mx-auto">
        Toggle to reveal critical omissions in communication or logic.
      </p>

      <button
        onClick={() => setShowOmissions(!showOmissions)}
        className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors mx-auto"
      >
        <Lightbulb className="w-5 h-5" />
        <span>{showOmissions ? 'Hide Omissions' : 'Reveal Omissions'}</span>
      </button>

      {showOmissions && (
        <div className="mt-6 space-y-4 max-w-2xl mx-auto">
          {mockOmissions.map((omission) => (
            <div
              key={omission.id}
              className={`p-4 border-l-4 rounded-md shadow-sm ${
                omission.severity === 'high' ? 'border-red-500 bg-red-50' :
                omission.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 mt-1 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-800">Context: {omission.context}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Omitted:</strong> {omission.omitted}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 italic">
                    Why it matters: {omission.whyItMatters}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OmissionHandler;
