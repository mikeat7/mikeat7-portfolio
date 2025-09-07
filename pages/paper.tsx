// src/pages/paper.tsx

import React from "react";
import { useVXContext } from "@/context/VXContext"; // ✅ Correct path
import ReflexInfoDrawer from "@/components/ReflexInfoDrawer";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";

export default function PaperAnalysisPage() {
  const { reflexFrames } = useVXContext();

  const paperReflexes = reflexFrames.filter(
    (r) => r.reflexId === "vx-da01" || r.reflexId === "vx-fp01"
  );

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Scientific Paper Analysis</h1>
      <CoFirePanel reflexes={paperReflexes} />
      {paperReflexes.map((reflex) => (
        <ReflexInfoDrawer key={reflex.reflexId} reflex={reflex} />
      ))}
    </div>
  );
}
