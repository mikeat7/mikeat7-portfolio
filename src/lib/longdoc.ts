// src/lib/longdoc.ts
import type { VXFrame } from "@/types/VXTypes";

export type Chunk = { label: string; text: string };

export function chunkByHeadings(input: string): Chunk[] {
  const lines = input.split(/\r?\n/);
  const chunks: Chunk[] = [];
  let buf: string[] = [];
  let label = "Intro";

  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) chunks.push({ label, text });
    buf = [];
  };

  for (const line of lines) {
    const m = /^(#+)\s*(.*)$/.exec(line);
    if (m) {
      flush();
      label = m[2] || `Section ${chunks.length + 1}`;
    } else {
      buf.push(line);
    }
  }
  flush();
  return chunks.length ? chunks : [{ label: "Document", text: input }];
}

export function chunkByWindow(input: string, size = 1800, overlap = 200): Chunk[] {
  const out: Chunk[] = [];
  let i = 0;
  while (i < input.length) {
    const slice = input.slice(i, i + size);
    out.push({
      label: `Window ${out.length + 1}`,
      text: slice,
    });
    i += size - overlap;
  }
  return out.length ? out : [{ label: "Document", text: input }];
}

export function aggregateFrames(perSection: Array<{ label: string; frames: VXFrame[] }>) {
  const allFrames: VXFrame[] = [];
  const scoreboard = perSection.map(s => ({ label: s.label, count: s.frames.length }));
  for (const s of perSection) allFrames.push(...s.frames);
  return { allFrames, scoreboard };
}
