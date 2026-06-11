// src/pages/TruthSerum.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function TruthSerum() {
  return (
    <main className="ins-page p-10 text-center">
      <h1 className="ins-heading text-5xl mb-6">Truth Serum + Clarity Armor</h1>
      <p className="max-w-2xl mx-auto text-lg text-ins-text mb-8 leading-relaxed">
        A platform to detect hidden logic, emotional manipulation, and omitted truths in AI and human communication.
        Learn, analyze, and strengthen your clarity reflexes.
      </p>

      <nav className="flex justify-center gap-6">
        <Link to="/educate" className="ins-mono text-ins-teal hover:text-ins-goldbright font-medium text-lg uppercase tracking-wide">Educate Yourself</Link>
        <Link to="/analyze" className="ins-mono text-ins-teal hover:text-ins-goldbright font-medium text-lg uppercase tracking-wide">Analyze Text</Link>
        <Link to="/omissions" className="ins-mono text-ins-teal hover:text-ins-goldbright font-medium text-lg uppercase tracking-wide">View Omissions</Link>
      </nav>
    </main>
  );
}
