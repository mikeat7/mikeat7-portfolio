// src/pages/bot-detection.tsx

import { useVXContext } from '@/context/VXContext';
import ReflexInfoDrawer from "@/components/ReflexInfoDrawer";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";

export default function BotDetectionPage() {
  const { reflexFrames } = useVXContext();
  const botReflexes = reflexFrames.filter(
    (r) => r.reflexId === "vx-ri01" || r.reflexId === "vx-ju01"
  );

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Bot-Like Behavior Detection</h1>
      <CoFirePanel reflexes={botReflexes} />
      {botReflexes.map((reflex) => (
        <ReflexInfoDrawer key={reflex.reflexId} reflex={reflex} />
      ))}
    </div>
  );
}
