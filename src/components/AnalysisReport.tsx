// src/components/AnalysisReport.tsx
import React from "react";
import type { VXFrame } from "@/types/VXTypes";

type Props = {
  frames: VXFrame[];
  inputSample?: string;
  handshakeLine?: string;
  sectionScores?: Array<{ label: string; count: number }>;
  reportText?: string; // optional server report (from /agent/summarize)
};

function fmt(num: number) {
  return (num ?? 0).toFixed(2);
}

function bucketize(frames: VXFrame[]) {
  const buckets: Record<string, VXFrame[]> = {};
  for (const f of frames) {
    const key = f.reflexId?.split("-")[1] ?? "misc";
    buckets[key] = buckets[key] || [];
    buckets[key].push(f);
  }
  return buckets;
}

const AnalysisReport: React.FC<Props> = ({
  frames,
  inputSample,
  handshakeLine,
  sectionScores,
  reportText,
}) => {
  const buckets = bucketize(frames);
  const total = frames.length;

  return (
    <div
      className="rounded-3xl p-6 md:p-8 mt-8"
      style={{
        background: "#e9eef5",
        boxShadow:
          "inset 8px 8px 16px #cfd6e0, inset -8px -8px 16px #ffffff",
      }}
    >
      <h2 className="text-xl font-semibold">Analysis Report</h2>

      {handshakeLine && (
        <p className="mt-1 text-xs text-slate-600">{handshakeLine}</p>
      )}

      {inputSample && (
        <blockquote className="mt-3 text-sm text-slate-700 border-l-4 border-slate-300 pl-3 italic">
          {inputSample.slice(0, 300)}
          {inputSample.length > 300 ? "…" : ""}
        </blockquote>
      )}

      {/* Optional server-made narrative */}
      {reportText && (
        <div className="mt-4 text-sm text-slate-800 leading-6 whitespace-pre-wrap">
          {reportText}
        </div>
      )}

      {/* Section scoreboard (Long-Doc Mode) */}
      {sectionScores && sectionScores.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-slate-900">Per-Section Scoreboard</h3>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {sectionScores.map((s, i) => (
              <div
                key={i}
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "#e9eef5",
                  boxShadow:
                    "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="font-semibold">{s.label}</div>
                <div className="text-slate-600">detections: {s.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-medium text-slate-900">Reflex Summary</h3>
        <p className="text-sm text-slate-600">Total detections: {total}</p>

        <div className="mt-2 grid gap-2">
          {Object.entries(buckets)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([code, list]) => (
              <div
                key={code}
                className="text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "#e9eef5",
                  boxShadow:
                    "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {code.toUpperCase()} • {list[0]?.reflexLabel ?? ""}
                  </span>
                  <span className="text-xs text-slate-600">
                    {list.length} hits · top conf {fmt(Math.max(...list.map(f => f.confidence ?? 0)))}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
