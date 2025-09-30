// src/lib/longdoc.ts
// Compact helpers for Long-Doc Mode: split text into chunks and aggregate VX frames.

export type DocChunk = {
  id: string;
  title?: string;
  start: number;   // char index in original text
  end: number;     // char index in original text
  text: string;
};

/**
 * Split by Markdown-style headings. Falls back to window chunking if none found.
 */
export function chunkByHeadings(
  text: string,
  opts: { minSectionLen?: number } = {}
): DocChunk[] {
  const minSectionLen = opts.minSectionLen ?? 300;
  const lines = text.split(/\r?\n/);
  const sections: { title: string; startLine: number }[] = [];

  const headingRe = /^(#{1,6})\s+(.+?)\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headingRe);
    if (m) {
      sections.push({ title: m[2].trim(), startLine: i });
    }
  }

  if (sections.length === 0) {
    // no headings — caller can use chunkByWindow
    return [];
  }

  // Add sentinel end
  sections.push({ title: "__END__", startLine: lines.length });

  const out: DocChunk[] = [];
  for (let i = 0; i < sections.length - 1; i++) {
    const cur = sections[i];
    const next = sections[i + 1];
    const sliceLines = lines.slice(cur.startLine, next.startLine);
    const sliceText = sliceLines.join("\n").trim();
    if (sliceText.length < minSectionLen) continue;

    const startChar = lines.slice(0, cur.startLine).join("\n").length + (cur.startLine > 0 ? 1 : 0);
    const endChar = startChar + sliceText.length;

    out.push({
      id: `h_${i}`,
      title: cur.title === "__END__" ? undefined : cur.title,
      start: startChar,
      end: endChar,
      text: sliceText,
    });
  }

  return out;
}

/**
 * Window chunker for arbitrary text.
 */
export function chunkByWindow(
  text: string,
  opts: { windowSize?: number; overlap?: number } = {}
): DocChunk[] {
  const windowSize = opts.windowSize ?? 1800;
  const overlap = opts.overlap ?? 200;

  const out: DocChunk[] = [];
  let i = 0;
  let idx = 0;
  while (i < text.length) {
    const end = Math.min(i + windowSize, text.length);
    const slice = text.slice(i, end).trim();
    if (slice.length > 0) {
      out.push({
        id: `w_${idx++}`,
        start: i,
        end,
        text: slice,
      });
    }
    if (end === text.length) break;
    i = end - overlap; // slide with overlap
  }
  return out;
}

/**
 * Aggregate frames across chunks into a simple scoreboard by reflex.
 * frames: [{ reflexId, confidence, chunkId? }]
 */
export function aggregateFrames<T extends { reflexId: string; confidence: number; chunkId?: string }>(
  frames: T[]
): {
  byReflex: Record<string, { count: number; avg: number; max: number }>;
  byChunk: Record<string, { count: number; avg: number; max: number }>;
  topReflexes: Array<{ reflexId: string; score: number; count: number }>;
} {
  const byReflex: Record<string, { count: number; sum: number; max: number }> = {};
  const byChunk: Record<string, { count: number; sum: number; max: number }> = {};

  for (const f of frames) {
    const r = (byReflex[f.reflexId] ||= { count: 0, sum: 0, max: 0 });
    r.count++; r.sum += f.confidence; r.max = Math.max(r.max, f.confidence);

    const ckey = f.chunkId ?? "_";
    const c = (byChunk[ckey] ||= { count: 0, sum: 0, max: 0 });
    c.count++; c.sum += f.confidence; c.max = Math.max(c.max, f.confidence);
  }

  const byReflexFinal: Record<string, { count: number; avg: number; max: number }> = {};
  Object.entries(byReflex).forEach(([k, v]) => {
    byReflexFinal[k] = { count: v.count, avg: v.sum / v.count, max: v.max };
  });

  const byChunkFinal: Record<string, { count: number; avg: number; max: number }> = {};
  Object.entries(byChunk).forEach(([k, v]) => {
    byChunkFinal[k] = { count: v.count, avg: v.sum / v.count, max: v.max };
  });

  const topReflexes = Object.entries(byReflexFinal)
    .map(([reflexId, r]) => ({ reflexId, score: r.avg, count: r.count }))
    .sort((a, b) => b.score - a.score);

  return { byReflex: byReflexFinal, byChunk: byChunkFinal, topReflexes };
}
