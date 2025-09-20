// src/pages/bot-detection.tsx

import { useVXContext } from '@/context/VXContext';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import CoFirePanel from '@/components/CoFirePanel';
import BackButton from '@/components/BackButton';
import { toReflexFrame } from '@/lib/vx/compat';

export default function BotDetectionPage() {
  const { reflexFrames } = useVXContext();

  // Keep as VXFrame[] for components that expect VXFrame
  const botReflexesVX = reflexFrames.filter(
    (r) => r.reflexId === 'vx-ri01' || r.reflexId === 'vx-ju01'
  );

  // Adapt to ReflexFrame for components that expect the legacy shape
  const botReflexesLegacy = botReflexesVX.map(toReflexFrame);

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Bot-Like Behavior Detection</h1>

      {/* CoFirePanel expects VXFrame[] */}
      <CoFirePanel reflexes={botReflexesVX} />

      {/* ReflexInfoDrawer expects { id, label, tone, ... } */}
      {botReflexesLegacy.map((reflex) => (
        <ReflexInfoDrawer key={reflex.id} reflex={reflex} />
      ))}
    </div>
  );
}
