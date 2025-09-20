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
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Scientific Paper Analysis</h1>

      {/* CoFirePanel expects VXFrame[] */}
      <CoFirePanel reflexes={paperReflexesVX} />

      {paperReflexesLegacy.length > 0 ? (
        paperReflexesLegacy.map((reflex: ReflexFrame) => (
          <ReflexInfoDrawer key={reflex.id} reflex={reflex} isOpen={false} onClose={() => {}} />
        ))
      ) : (
        <div className="mt-6 rounded border bg-gray-50 p-4 text-sm text-gray-600">
          No paper-related reflexes found yet. Try text with numeric claims, confidence intervals,
          or methodological assertions to test false precision and data-less claim detectors.
        </div>
      )}
    </div>
  );
}

