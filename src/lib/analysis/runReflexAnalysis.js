// src/lib/analysis/runReflexAnalysis.ts

// --- Detectors (unchanged in spirit; import JS with explicit .js so Vite hits the real files) ---
import { detectEmotionalManipulation }      from "@/lib/vx/vx-em08.js";
import { detectSpeculativeOverreach }       from "@/lib/vx/vx-so01.js";
import { detectHallucination }              from "@/lib/vx/vx-ha01.js";
import { detectOmission }                   from "@/lib/vx/vx-os01.js";
import { detectPerceivedConsensus }         from "@/lib/vx/vx-pc01.js";
import { detectFalsePrecision }             from "@/lib/vx/vx-fp01.js";
import { detectEthicalDrift }               from "@/lib/vx/vx-ed01.js";
import { detectToneEscalation }             from "@/lib/vx/vx-tu01.js";
import { detectJargonOverload }             from "@/lib/vx/vx-ju01.js";
import { detectConfidenceIllusion }         from "@/lib/vx/vx-co01.js";
import { detectDataLessClaims }             from "@/lib/vx/vx-da01.js";
import { detectRhetoricalEntrapment }       from "@/lib/vx/vx-em09.js";
import { detectFalseUrgency }               from "@/lib/vx/vx-fo01.js";
import { detectNarrativeOversimplification } from "@/lib/vx/vx-ns01.js";
import { detectRhetoricalInterruption }     from "@/lib/vx/vx-ri01.js";
import { detectVagueness }                  from "@/lib/vx/vx-vg01.js";
import { detectSemanticPatterns }           from "@/lib/vx/vx-semantic-core.js";
import { detectEnhancedSemanticPatterns }   from "@/lib/vx/vx-enhanced-semantic.js";
import { detectComprehensiveManipulation }  from "@/lib/vx/vx-mp01.js";
import { detectPseudoInquiry }              from "@/lib/vx/vx-inquiry-protection.js";
import { detectAIGeneratedContent }         from "@/lib/vx/vx-ai01.js";
import { detectNarrativeFraming }           from "@/lib/vx/vx-nf01.js";

// --- Codex v0.9 policy helpers ---
import codex from "@/data/front-end-codex.v0.9.json";
import {
  buildHandshake,
  getReflexOrder,
  shouldTriggerReflex,
  emitTelemetry,
} from "@/lib/codex-runtime.js";

// Minimal frame shape (so TS is happy under strict mode)
type VXFrame = {
  reflexId: string;
  reflexLabel?: string;
  rationale?: string;
  reason?: string;
  confidence?: number;
  tags?: string[];
  priority?: number;
};

const DEFAULT_OPTS = {
  mode: "--careful" as "--careful" | "--direct" | "--recap",
  stakes: "medium" as "low" | "medium" | "high",
  useAgent: true,
};

/**
 * Main reflex analysis runner.
 * - Runs local detectors
 * - (Optionally) merges frames from AWS agent if VITE_AGENT_API_BASE is set
 * - Gates & sorts frames via Codex v0.9 (thresholds, block rules, profile order)
 * - Emits lightweight telemetry (console)
 */
const runReflexAnalysis = async (
  input: string,
  opts: Partial<typeof DEFAULT_OPTS> = {}
): Promise<VXFrame[]> => {
  const { mode, stakes, useAgent } = { ...DEFAULT_OPTS, ...opts };

  if (!input || input.trim().length < 3) {
    console.log("🔍 Analysis skipped: input too short");
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
      aiContentFrames,         // VX-AI01
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
      Promise.resolve(detectAIGeneratedContent(input)),
      Promise.resolve(detectNarrativeFraming(input)),
    ]);

    const semanticFrames           = detectSemanticPatterns(input);
    const enhancedSemanticFrames   = detectEnhancedSemanticPatterns(input);
    const comprehensiveFrames      = detectComprehensiveManipulation(input);
    const pseudoInquiryFrames      = detectPseudoInquiry(input);

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
    ] as VXFrame[];

    console.log(`🔍 [${timestamp}] Local VX detections:`, {
      confidence:           (confidenceFrames as VXFrame[]).length,
      dataLess:             (dataLessFrames   as VXFrame[]).length,
      ethical:              (ethicalFrames    as VXFrame[]).length,
      emotional:            (emotionalFrames  as VXFrame[]).length,
      entrapment:           (entrapmentFrames as VXFrame[]).length,
      urgency:              (urgencyFrames    as VXFrame[]).length,
      precision:            (precisionFrames  as VXFrame[]).length,
      hallucination:        (hallucinationFrames as VXFrame[]).length,
      jargon:               (jargonFrames     as VXFrame[]).length,
      oversimplification:   (oversimplificationFrames as VXFrame[]).length,
      omission:             (omissionFrames   as VXFrame[]).length,
      consensus:            (consensusFrames  as VXFrame[]).length,
      interruption:         (interruptionFrames as VXFrame[]).length,
      speculative:          (speculativeFrames as VXFrame[]).length,
      tone:                 (toneFrames       as VXFrame[]).length,
      vagueness:            (vaguenessFrames  as VXFrame[]).length,
      aiContent:            (aiContentFrames  as VXFrame[]).length,
      narrative:            (narrativeFrames  as VXFrame[]).length,
      semantic:             (semanticFrames   as VXFrame[]).length,
      enhancedSemantic:     (enhancedSemanticFrames as VXFrame[]).length,
      comprehensive:        (comprehensiveFrames as VXFrame[]).length,
      pseudoInquiry:        (pseudoInquiryFrames as VXFrame[]).length,
    });
  } catch (err) {
    console.error(`🚨 [${timestamp}] Local detector error:`, err);
  }

  // 2) Optional: AWS Agent frames  (will be skipped if endpoint is absent)
  let agentFrames: VXFrame[] = [];
  if (useAgent && typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AGENT_API_BASE) {
    try {
      const base = (import.meta as any).env.VITE_AGENT_API_BASE;
      const res = await fetch(`${base}/agent/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { text: input }, handshake }),
      });
      if (res.ok) {
        const data = await res.json();
        const frames = Array.isArray(data?.frames) ? data.frames : (data?.frames?.items ?? []);
        if (Array.isArray(frames)) {
          agentFrames = (frames as any[]).map((f) => ({
            reflexId: String((f as any).reflexId ?? (f as any).id ?? "agent-unknown"),
            reflexLabel: String((f as any).reflexLabel ?? (f as any).label ?? "Agent Reflex"),
            confidence: Number((f as any).confidence ?? 0.5),
            rationale: String((f as any).rationale ?? (f as any).reason ?? ""),
            tags: Array.isArray((f as any).tags) ? (f as any).tags : [],
            priority: typeof (f as any).priority === "number" ? (f as any).priority : undefined,
          }));
          agentFrames.forEach((f) => (f.tags = [ ...(f.tags ?? []), "agent" ]));
        }
      } else {
        console.warn(`⚠️ Agent call failed with status ${res.status}`);
      }
    } catch (err) {
      console.warn("⚠️ Agent call error:", err);
    }
  }

  // 3) Merge + de-duplicate frames
  const merged = dedupeFrames([...localFrames, ...agentFrames]);

  // 4) Codex gating (thresholds & blockers)
  const gated: VXFrame[] = [];
  let blockedBy: string | null = null;

  for (const f of merged) {
    const conf = typeof f.confidence === "number" ? f.confidence : 0;
    const { trigger, block } = shouldTriggerReflex(codex as any, f.reflexId, conf, stakes);
    if (block && !blockedBy) blockedBy = f.reflexId;
    if (trigger) gated.push(f);
  }

  if (blockedBy) {
    gated.unshift({
      reflexId: "policy-block",
      reflexLabel: "Analysis Paused: High-Risk Signal",
      rationale:
        `Reflex "${blockedBy}" exceeded its block threshold for stakes="${stakes}". ` +
        `Request sources/clarification or reduce stakes.`,
      confidence: 0.99,
      tags: ["policy", "block"],
      priority: 5,
    });
  }

  // 5) Cluster detection (existing UX)
  const clustered = detectReflexClusters(gated, input);

  // 6) Sort: profile order first, then confidence
  const profileOrder = getReflexOrder(codex as any, (handshake as any).reflex_profile);
  const rank = (id: string) => {
    const i = profileOrder.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  clustered.sort((a, b) => {
    const ai = rank(a.reflexId);
    const bi = rank(b.reflexId);
    if (ai !== bi) return ai - bi;
    return (b.confidence ?? 0) - (a.confidence ?? 0);
  });

  // 7) Telemetry (console only)
  emitTelemetry(
    codex as any,
    {
      name: "analysis_complete",
      data: {
        mode,
        stakes,
        triggered_reflexes: clustered.map((f) => f.reflexId),
        total: clustered.length,
        used_agent: agentFrames.length > 0,
      },
    },
    (e: unknown) => console.log("[telemetry]", e)
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
    const key = `${f.reflexId}::${(f.rationale ?? f.reason ?? "").slice(0, 160)}::${f.reflexLabel ?? ""}`;
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
  const med  = frames.filter((f) => (f.confidence ?? 0) >= 0.55).length;
  const total = frames.length;

  const threshold = hasLegitSci
    ? { high: 3, medium: 4, volume: 5 }
    : { high: 2, medium: 3, volume: 4 };

  const hasHigh = high >= threshold.high;
  const hasMed  = med  >= threshold.medium;
  const hasVol  = total >= threshold.volume;

  if (hasHigh || hasMed || hasVol) {
    const clusterType  = hasHigh ? "HIGH-CONFIDENCE" : hasMed ? "MEDIUM-CONFIDENCE" : "VOLUME";
    const clusterCount = hasHigh ? high : hasMed ? med : total;

    frames.forEach((f) => {
      if ((f.confidence ?? 0) >= 0.55) {
        f.tags = [...(f.tags || []), "cluster-alert"];
        f.priority = Math.max(f.priority || 1, 3);
      }
    });

    frames.unshift({
      reflexId: "cluster-alert",
      reflexLabel: `⚠️ ${clusterType} Manipulation Cluster Detected`,
      rationale: `🔥 ${clusterType} CLUSTER ALERT: ${clusterCount} reflexes triggered on "${originalInput.substring(
        0,
        50
      )}..."`,
      confidence: Math.max(...frames.map((f) => f.confidence ?? 0)),
      tags: ["cluster", "alert", clusterType.toLowerCase()],
      priority: 4,
    });
  }

  return frames;
}

export default runReflexAnalysis;
