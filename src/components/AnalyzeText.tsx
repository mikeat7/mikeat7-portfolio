// src/components/AnalyzeText.tsx

import React, { useState, useContext } from "react";
import BackButton from "@/components/BackButton";
import VXReflexPreview from "@/components/VXReflexPreview";
import CoFirePanel from "@/components/CoFirePanel";
import { analyzeInput } from "@/lib/scanLogic";
import { VXContext } from "@/context/VXContext";
import type { VXFrame } from "@/types/VXTypes";

const AnalyzeText: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localResults, setLocalResults] = useState<VXFrame[]>([]);
  const ctx = useContext(VXContext); // may be undefined until provider mounts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (text.trim().length < 3) return;

    setBusy(true);
    try {
      const results = await analyzeInput(text);
      // Broadcast to context if setters exist so the rest of the UI can consume
      (ctx as any)?.setLatestInput?.(text);
      (ctx as any)?.setReflexFrames?.(results);
      setLocalResults(results);
    } catch (err) {
      console.error("Analyze failed:", err);
      setLocalResults([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <BackButton />

        <h1 className="text-3xl font-bold mb-4 text-gray-900">Analyze a Statement</h1>
        <p className="text-gray-600 mb-6">
          Paste a claim, argument, or quote. The Clarity Armor engine will reveal hidden assumptions,
          speculative tone, or manipulative framing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-md p-3 text-gray-800 shadow-sm"
            placeholder="Paste a paragraph, argument, or social media post here..."
          />
          <button
            type="submit"
            disabled={busy || text.trim().length < 3}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {busy ? "Analyzing…" : "Run Analysis"}
          </button>
        </form>

        {submitted && text.trim() && (
          <div className="mt-8 space-y-6">
            {/* Show cluster/co-fire overview using local results */}
            <CoFirePanel reflexes={localResults} />

            {/* Show per-reflex cards (reads from context if provider is present, otherwise empty) */}
            <VXReflexPreview />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeText;

