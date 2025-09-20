// src/pages/paper.tsx

import React from "react";
import { useVXContext } from "@/context/VXContext";
import ReflexInfoDrawer from "@/components/ReflexInfoDrawer";
import CoFirePanel from "@/components/CoFirePanel";
import BackButton from "@/components/BackButton";
import { toReflexFrame } from "@/lib/vx/compat";

export default function PaperAnalysisPage() {
  const { reflexFrames } = useVXContext();

  const paperReflexesVX = reflexFrames.filter(
    (r) => r.reflexId === "vx-da01" || r.reflexId === "vx-fp01"
  );

  const paperReflexesLegacy = paperReflexesVX.map(toReflexFrame);

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Scientific Paper Analysis</h1>

      {/* VXFrame[] */}
      <CoFirePanel reflexes={paperReflexesVX} />

      {/* Legacy frame shape */}
      {paperReflexesLegacy.map((reflex) => (
        <ReflexInfoDrawer key={reflex.id} reflex={reflex} />
      ))}
    </div>
  );
}
