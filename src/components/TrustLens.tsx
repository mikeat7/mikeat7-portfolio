// src/components/TrustLens.tsx
import React from "react";
import { useVXContext } from "@/context/VXContext";
import CoFirePanel from "./CoFirePanel";
import ReflexInfoDrawer from "./ReflexInfoDrawer";
import type { VXFrame } from "@/types/VXTypes";
import { toReflexFrame } from "@/lib/vx/compat";

const TrustLens: React.FC = () => {
  const ctx = useVXContext();
  const reflexFrames: VXFrame[] = ctx?.reflexFrames ?? [];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Reflex Summary</h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reflexFrames.map((r, idx) => {
          const score = r.confidence ?? 0;
          const label = r.reflexLabel ?? r.reflexId ?? `vx-${idx}`;
          const key = r.reflexId ?? `vx-${idx}`;

          const severityClass =
            score > 0.7
              ? "border-red-500 bg-red-50"
              : score > 0.4
              ? "border-yellow-500 bg-yellow-50"
              : "border-green-500 bg-green-50";

          return (
            <li key={key} className={`p-4 rounded border-l-4 ${severityClass}`}>
              <p className="font-medium text-gray-800">{label}</p>
              <p className="text-sm">Score: {(score * 100).toFixed(1)}%</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-4">
        {/* CoFirePanel expects VXFrame[] */}
        <CoFirePanel reflexes={reflexFrames} />

        {/* Show details for the top reflex (legacy drawer expects { id, label, tone, ... } + isOpen/onClose) */}
        {reflexFrames[0] && (
          <ReflexInfoDrawer
            reflex={toReflexFrame(reflexFrames[0])}
            isOpen={false}
            onClose={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default TrustLens;

