// src/lib/analysis/runReflexAnalysis.ts
import { VXFrame } from '@/types/VXTypes';

// --- Detectors (unchanged) ---
import { detectEmotionalManipulation } from '@/lib/vx/vx-em08';
import { detectSpeculativeOverreach } from '@/lib/vx/vx-so01';
import { detectHallucination } from '@/lib/vx/vx-ha01';
import { detectOmission } from '@/lib/vx/vx-os01';
import { detectPerceivedConsensus } from '@/lib/vx/vx-pc01';
import { detectFalsePrecision } from '@/lib/vx/vx-fp01';
import { detectEthicalDrift } from '@/lib/vx/vx-ed01';
import { detectToneEscalation } from '@/lib/vx/vx-tu01';
import { detectJargonOverload } from '@/lib/vx/vx-ju01';
import { detectConfidenceIllusion } from '@/lib/vx/vx-co01';
import { detectDataLessClaims } from '@/lib/vx/vx-da01';
import { detectRhetoricalEntrapment } from '@/lib/vx/vx-em09';
import { detectFalseUrgency } from '@/lib/vx/vx-fo01';
import { detectNarrativeOversimplification } from '@/lib/vx/vx-ns01';
import { detectRhetoricalInterruption } from '@/lib/vx/vx-ri01';
import { detectVagueness } from '@/lib/vx/vx-vg01';
import { detectSemanticPatterns } from '@/lib/vx/vx-semantic-core';
import { detectEnhancedSemanticPatterns } from '@/lib/vx/vx-enhanced-semantic';
import { detectComprehensiveManipulation } from '@/lib/vx/vx-mp01';
import { detectPseudoInquiry } from '@/lib/vx/vx-inquiry-protection';
import { detectNarrativeFraming } from '@/lib/vx/vx-nf01';

// --- Codex v0.9 policy helpers ---
import codex from '@/data/front-end-codex.v0.9.json';
import {
  buildHandshake,
  getReflexOrder,
  shouldTriggerReflex,
  emitTelemetry,
  type Stakes,
  type Mode,
} from '@/lib/codex-runtime';

// -------------------------------
// Public API
// -------------------------------
export interface AnalysisOptions {
  mode?: Mode;          // '--direct' | '--careful' | '--recap'
  stakes?: Stakes;      // 'low' | 'medium' | 'high'
  useAgent?: boolean;   // if true and endpoint present, blend frames from AWS agent
}

const DEFAULT_OPTS: Required<AnalysisOptions> = {
  mode: '--careful',
  stakes: 'medium',
  useAgent: true,
};

/**
 * Main reflex analysis runner.
 * - Runs local detectors
 * - (Optionally) merges frames from AWS agent if VITE_AGENT_API_BASE is set
 * - Gates & sorts frames via Codex v0.9 (thresholds, block rules, profile order)
 * - Emits lightweight telemetry (console)
 */
const runReflexAnalysis = async (input: string, opts: AnalysisOptions = {}): Promise<VXFrame[]> => {
  const { mode, stakes, useAgent } = { ...DEFAULT_OPTS, ...opts };

  if (!input || input.trim().length < 3) {
    console.log('🔍 Analysis skipped: input too short');
    return [];
  }

  const timestamp = new Date().toLocaleTimeString();
  const handshake = buildHandshake(codex as any, { mode, stakes });

  // 1) Local detectors (in parallel)
  let localFrames: VXFrame[] = [];
  try {
    const [
      confidenceFrames,        // VX-CO01
      dataLessFrames,          // VX-DA01
      ethicalFrames,           // VX-ED01
      emotionalFrames,         // VX-EM08
      entrapmentFrames,        // VX-EM09
      urgencyFrames,           // VX-FO01
      precisionFrames,         // VX-FP01
      hallucinationFrames,     // VX-HA01
      jargonFrames,            // VX-JU01
      oversimplificationFrames,// VX-NS01
      omissionFrames,          // VX-OS01
      consensusFrames,         // VX-PC01
      interruptionFrames,      // VX-RI01
      speculativeFrames,       // VX-SO01
      toneFrames,              // VX-TU01
      vaguenessFrames,         // VX-VG01
      aiContentFrames,         // not implemented → empty
      narrativeFrames          // VX-NF01
    ] = await Promise.all([
      Promise.resolve(detectConfidenceIllusion(input)),
      Promise.resolve(detectDataLessClaims(input)),
      Promise.resolve(detectEthicalDrift(input)),
      Promise.resolve(detectEmotionalManipulation(input)),
      Promise.resolve(detectRhetoricalEntrapment(input)),
      Promise.resolve(detectFalseUrgency(input)),
      Promise.resolve(detectFalsePrecision(input)),
      Promise.resolve(detectHallucination(input)),
      Promise.resolve(detectJargonOverload(input)),
      Promise.resolve(detectNarrativeOversimplification(input)),
      Promise.resolve(detectOmission(input)),
      Promise.resolve(detectPerceivedConsensus(input)),
      Promise.resolve(detectRhetoricalInterruption(input)),
      Promise.resolve(detectSpeculativeOverreach(input)),
      Promise.resolve(detectToneEscalation(input)),
      Promise.resolve(detectVagueness(input)),
      Promise.resolve([] as VXFrame[]),
      Promise.resolve(detectNarrativeFraming(input)),
    ]);

    const semanticFrames = detectSemanticPatterns(input);
    const enhancedSemanticFrames = detectEnhancedSemanticPatterns(input);
    const comprehensiveFrames = detectComprehensiveManipulation(input);
    const pseudoInquiryFrames = detectPseudoInquiry(input);

    // Accumulate locally
    localFrames = [
      ...confidenceFrames,
      ...dataLessFrames,
      ...ethicalFrames,
      ...emotionalFrames,
      ...entrapmentFrames,
      ...urgencyFrames,
      ...precisionFrames,
      ...hallucinationFrames,
      ...jargonFrames,
      ...oversimplificationFrames,
      ...omissionFrames,
      ...consensusFrames,
      ...interruptionFrames,
      ...speculativeFrames,
      ...toneFrames,
      ...vaguenessFrames,
      ...aiContentFrames,
      ...narrativeFrames,
      ...semanticFrames,
      ...enhancedSemanticFrames,
      ...comprehensiveFrames,
      ...pseudoInquiryFrames,
    ];

    console.log(`🔍 [${timestamp}] Local VX detections:`, {
      confidence: confidenceFrames.length,
      dataLess: dataLessFrames.length,
      ethical: ethicalFrames.length,
      emotional: emotionalFrames.length,
      entrapment: entrapmentFrames.length,
      urgency: urgencyFrames.length,
      precision: precisionFrames.length,
      hallucination: hallucinationFrames.length,
      jargon: jargonFrames.length,
      oversimplification: oversimplificationFrames.length,
      omission: omissionFrames.length,
      consensus: consensusFrames.length,
      interruption: interruptionFrames.length,
      speculative: speculativeFrames.length,
      tone: toneFrames.length,
      vagueness: vaguenessFrames.length,
      aiContent: aiContentFrames.length,
      narrative: narrativeFrames.length,
      semantic: semanticFrames.length,
      enhancedSemantic: enhancedSemanticFrames.length,
      comprehensive: comprehensiveFrames.length,
      pseudoInquiry: pseudoInquiryFrames.length,
    });
  } catch (err) {
    console.error(`🚨 [${timestamp}] Local detector error:`, err);
  }

  // 2) Optional: AWS Agent frames
  let agentFrames: VXFrame[] = [];
  if (useAgent && typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_AGENT_API_BASE) {
    try {
      const base = (import.meta as any).env.VITE_AGENT_API_BASE as string;
      const res = await fetch(`${base}/agent/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: { text: input }, handshake }),
      });
      if (res.ok) {
        const data = await res.json();
        const frames = Array.isArray(data?.frames) ? data.frames : (data?.frames?.items ?? []);
        if (Array.isArray(frames)) {
          agentFrames = frames.map((f: any) => ({
            reflexId: String(f.reflexId ?? f.id ?? 'agent-unknown'),
            reflexLabel: String(f.reflexLabel ?? f.label ?? 'Agent Reflex'),
            confidence: Number(f.confidence ?? 0.5),
            rationale: String(f.rationale ?? f.reason ?? ''),
            tags: Array.isArray(f.tags) ? f.tags : [],
            priority: typeof f.priority === 'number' ? f.priority : undefined,
          })) as VXFrame[];
          // Tag as agent-origin
          agentFrames.forEach(f => (f.tags = [...(f.tags ?? []), 'agent']));
        }
      } else {
        console.warn(`⚠️ Agent call failed with status ${res.status}`);
      }
    } catch (err) {
      console.warn('⚠️ Agent call error:', err);
    }
  }

  // 3) Merge + de-duplicate frames
  const merged = dedupeFrames([...localFrames, ...agentFrames]);

  // 4) Codex gating (thresholds & blockers)
  const gated = [];
  let blockedBy: string | null = null;
  for (const f of merged) {
    const { trigger, block } = shouldTriggerReflex(codex as any, f.reflexId, f.confidence ?? 0, stakes);
    if (block && !blockedBy) blockedBy = f.reflexId;
    if (trigger) gated.push(f);
  }
  if (blockedBy) {
    gated.unshift({
      reflexId: 'policy-block',
      reflexLabel: 'Analysis Paused: High-Risk Signal',
      rationale:
        `Reflex "${blockedBy}" exceeded its block threshold for stakes="${stakes}". ` +
        `Request sources/clarification or reduce stakes.`,
      confidence: 0.99,
      tags: ['policy', 'block'],
      priority: 5,
    });
  }

  // 5) Cluster detection (your existing UX)
  const clustered = detectReflexClusters(gated, input);

  // 6) Sort: profile order first, then confidence
  const profileOrder = getReflexOrder(codex as any, handshake.reflex_profile);
  const indexOf = (id: string) => {
    const i = profileOrder.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  clustered.sort((a, b) => {
    const ai = indexOf(a.reflexId);
    const bi = indexOf(b.reflexId);
    if (ai !== bi) return ai - bi;
    return (b.confidence ?? 0) - (a.confidence ?? 0);
  });

  // 7) Telemetry (console only)
  emitTelemetry(
    codex as any,
    {
      name: 'analysis_complete',
      data: {
        mode,
        stakes,
        triggered_reflexes: clustered.map(f => f.reflexId),
        total: clustered.length,
        used_agent: agentFrames.length > 0,
      },
    },
    (e) => console.log('[telemetry]', e)
  );

  console.log(`🔍 [${timestamp}] Analysis finished, returning ${clustered.length} frames`);
  return clustered;
};

// -------------------------------------------
// Helpers
// -------------------------------------------
function dedupeFrames(frames: VXFrame[]): VXFrame[] {
  const seen = new Set<string>();
  const out: VXFrame[] = [];
  for (const f of frames) {
    const key = `${f.reflexId}::${(f.rationale ?? f.reason ?? '').slice(0, 160)}::${f.reflexLabel ?? ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(f);
    }
  }
  return out;
}

/** Cluster detection (co-firing reflexes) */
function detectReflexClusters(frames: VXFrame[], originalInput: string): VXFrame[] {
  const hasLegitSci =
    /requires further study|needs investigation|warrants research|seems plausible|appears to suggest/i.test(
      originalInput
    );

  const high = frames.filter((f) => (f.confidence ?? 0) >= 0.75).length;
  const med = frames.filter((f) => (f.confidence ?? 0) >= 0.55).length;
  const total = frames.length;

  const threshold = hasLegitSci
    ? { high: 3, medium: 4, volume: 5 }
    : { high: 2, medium: 3, volume: 4 };

  const hasHigh = high >= threshold.high;
  const hasMed = med >= threshold.medium;
  const hasVol = total >= threshold.volume;

  if (hasHigh || hasMed || hasVol) {
    const clusterType = hasHigh ? 'HIGH-CONFIDENCE' : hasMed ? 'MEDIUM-CONFIDENCE' : 'VOLUME';
    const clusterCount = hasHigh ? high : hasMed ? med : total;

    frames.forEach((f) => {
      if ((f.confidence ?? 0) >= 0.55) {
        f.tags = [...(f.tags || []), 'cluster-alert'];
        f.priority = Math.max(f.priority || 1, 3);
      }
    });

    frames.unshift({
      reflexId: 'cluster-alert',
      reflexLabel: `⚠️ ${clusterType} Manipulation Cluster Detected`,
      rationale: `🔥 ${clusterType} CLUSTER ALERT: ${clusterCount} reflexes triggered on "${originalInput.substring(0, 50)}..."`,
      confidence: Math.max(...frames.map((f) => f.confidence ?? 0)),
      tags: ['cluster', 'alert', clusterType.toLowerCase()],
      priority: 4,
    });
  }

  return frames;
}

export default runReflexAnalysis;
