// src/components/AnalyzeText.tsx

import React, { useState } from 'react';
import VXOrchestrator from '@/lib/vx/VXOrchestrator';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import TrustLens from '@/components/TrustLens';
import CoFirePanel from '@/components/CoFirePanel';

import BackButton from '@/components/BackButton';
import VXReflexPreview from '@/components/VXReflexPreview'; // ✅ Added

const AnalyzeText: React.FC = () => {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <BackButton />
      
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Analyze a Statement</h1>
        <p className="text-gray-600 mb-6">
          Paste a claim, argument, or quote. The Clarity Armor engine will reveal hidden assumptions, speculative tone, or manipulative framing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-md p-3 text-gray-800 shadow-sm"
            placeholder="Paste a paragraph, argument, or social media post here..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Run Analysis
          </button>
        </form>

        {submitted && input.trim() && (
          <div className="mt-8 space-y-6">
            <VXOrchestrator input={input} />
            <VXReflexPreview /> {/* ✅ Now integrated */}
            <ReflexInfoDrawer input={input} />
            <TrustLens input={input} />
            <CoFirePanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeText;
