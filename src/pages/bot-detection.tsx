// src/pages/bot-detection.tsx
import React from 'react';
import { useVXContext } from '@/context/VXProvider'; // prefer the provider barrel
import BackButton from '@/components/BackButton';
import CoFirePanel from '@/components/CoFirePanel';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import type { VXFrame } from '@/types/VXTypes';
import { toReflexFrame, type ReflexFrame } from '@/lib/vx/compat';

export default function BotDetectionPage() {
  const { reflexFrames } = useVXContext();

  // Focus on rhetorical interruption + jargon overload
  const botReflexesVX: VXFrame[] = reflexFrames.filter((r: VXFrame) =>
    r.reflexId === 'vx-ri01' || r.reflexId === 'vx-ju01'
  );

  // Legacy shape for the drawer component
  const botReflexesLegacy: ReflexFrame[] = botReflexesVX.map(toReflexFrame);

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Bot-Like Behavior Detection</h1>

      {/* CoFirePanel expects VXFrame[] */}
      <CoFirePanel reflexes={botReflexesVX} />

      {/* Drawer expects legacy shape + isOpen/onClose */}
      {botReflexesLegacy.map((reflex: ReflexFrame) => (
        <ReflexInfoDrawer key={reflex.id} reflex={reflex} isOpen={false} onClose={() => {}} />
      ))}
    </div>
  );
}
