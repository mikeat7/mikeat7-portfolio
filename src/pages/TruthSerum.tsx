// src/pages/TruthSerum.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function TruthSerum() {
  return (
    <main className="min-h-screen p-10 bg-gradient-to-br from-slate-100 to-slate-200 text-center">
      <h1 className="text-5xl font-bold mb-6 text-gray-900">Truth Serum + Clarity Armor</h1>
      <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
        A platform to detect hidden logic, emotional manipulation, and omitted truths in AI and human communication. 
        Learn, analyze, and strengthen your clarity reflexes.
      </p>

      <nav className="flex justify-center gap-6">
        <Link to="/educate" className="text-blue-600 hover:underline font-medium text-lg">Educate Yourself</Link>
        <Link to="/analyze" className="text-blue-600 hover:underline font-medium text-lg">Analyze Text</Link>
        <Link to="/omissions" className="text-blue-600 hover:underline font-medium text-lg">View Omissions</Link>
      </nav>
    </main>
  );
}
