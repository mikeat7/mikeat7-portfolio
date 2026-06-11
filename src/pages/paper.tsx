// src/pages/paper.tsx

import React from 'react';
import { useVXContext } from '@/context/VXContext';
import BackButton from '@/components/BackButton';
import CoFirePanel from '@/components/CoFirePanel';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import type { VXFrame } from '@/types/VXTypes';
import { toReflexFrame, type ReflexFrame } from '@/lib/vx/compat';

export default function PaperAnalysisPage() {
  const { reflexFrames } = useVXContext();

  // Focus on data-less claims and false precision
  const paperReflexesVX: VXFrame[] = reflexFrames.filter((r: VXFrame) =>
    r.reflexId === 'vx-da01' || r.reflexId === 'vx-fp01'
  );

  // Legacy shape for ReflexInfoDrawer
  const paperReflexesLegacy: ReflexFrame[] = paperReflexesVX.map(toReflexFrame);

  return (
    <div className="ins-page p-6">
      <BackButton className="!text-ins-teal hover:!text-ins-goldbright" />
      <h1 className="ins-heading text-2xl mb-4 mt-4">Scientific Paper Analysis</h1>

      {/* CoFirePanel expects VXFrame[] */}
      <CoFirePanel reflexes={paperReflexesVX} />

      {paperReflexesLegacy.length > 0 ? (
        paperReflexesLegacy.map((reflex: ReflexFrame) => (
          <ReflexInfoDrawer key={reflex.id} reflex={reflex} isOpen={false} onClose={() => {}} />
        ))
      ) : (
        <div className="mt-6 rounded p-4 text-sm bg-ins-panel border border-ins-line text-ins-dim">
          No paper-related reflexes found yet. Try text with numeric claims, confidence intervals,
          or methodological assertions to test false precision and data-less claim detectors.
        </div>
      )}
    </div>
  );
}

