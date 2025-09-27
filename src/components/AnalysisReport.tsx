import React from "react";
import type { VXFrame } from "@/types/VXTypes";

type Props = { frames: VXFrame[]; inputSample?: string; handshakeLine?: string };

function group(frames: VXFrame[]) {
  const byId: Record<string, VXFrame[]> = {};
  for (const f of frames) {
    byId[f.reflexId] ??= [];
    byId[f.reflexId].push(f);
  }
  // Sort groups by max confidence desc
  return Object.entries(byId)
    .map(([id, arr]) => ({
      id,
      label: arr[0]?.reflexLabel ?? id,
      maxConf: Math.max(...arr.map(a => a.confidence ?? 0)),
      items: arr
    }))
    .sort((a, b) => b.maxConf - a.maxConf);
}

export default function AnalysisReport({ frames, inputSample, handshakeLine }: Props) {
  if (!frames?.length) return null;
  const groups = group(frames);
  const top = groups.slice(0, 5);

  const suggestions = [
    frames.some(f => f.reflexId.includes("omission")) && "Ask for missing context or opposing evidence.",
    frames.some(f => f.reflexId.includes("speculative") || f.reflexId.includes("pc01")) && "Request concrete sources instead of 'experts say' or vague consensus.",
    frames.some(f => f.reflexId.includes("fp01") || f.reflexId.includes("co01")) && "Verify numbers/precision; state uncertainty explicitly.",
    frames.some(f => f.reflexId.includes("fo01") || f.reflexId.includes("tu01")) && "De-escalate urgency; evaluate time sensitivity with evidence.",
  ].filter(Boolean) as string[];

  return (
    <div
      className="mt-6 rounded-2xl p-5"
      style={{ background:"#e9eef5", boxShadow:"inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #fff" }}
    >
      <h3 className="text-lg font-semibold text-slate-900">Analysis Report</h3>
      {handshakeLine && (
        <p className="text-xs text-slate-600 mt-1">{handshakeLine}</p>
      )}
      {inputSample && (
        <p className="text-xs text-slate-500 mt-1 italic">
          Sample: “{inputSample.slice(0, 120)}{inputSample.length > 120 ? "…" : ""}”
        </p>
      )}

      <div className="mt-4 space-y-3">
        {top.map(g => (
          <div key={g.id}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{g.label}</span>
              <span className="text-[10px] px-2 py-[2px] rounded-md"
                style={{ background:"#e9eef5", boxShadow:"inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #fff" }}>
                ~{Math.round(g.maxConf*100)}% conf
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              {g.items[0]?.rationale ?? "Pattern detected."}
            </p>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-800">Next steps</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
