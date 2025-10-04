// src/lib/analysis/runReflexAnalysis.js

// --- Detectors (JS modules) ---
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

// --- Codex v0.9 policy helpers (JS) ---
import codex from "@/data/front-end-codex.v0.9.json";
import {
  buildHandshake,
  getReflexOrder,
  shouldTriggerReflex,
  emitTelemetry,
} from "@/lib/codex-runtime.js";

const DEFAULT_OPTS = {
  mode: "--careful",
  stakes: "medium",
  useAgent: true, // can be toggled off by caller
};

export default async function runReflexAnalysis(input, opts = {}) {
  const { mode, stakes, useAgent } = { ...DEFAULT_OPTS, ...opts };

  if (!input || String(input).trim().length < 3) {
    console.log("🔍 Analysis skipped: input too short");
    return [];
  }

  const timestamp = new Date().toLocaleTimeString();
  const handshake = buildHandshake(codex, { mode, stakes });

  // 1) Local detectors (parallel)
  let localFrames = [];
  try {
    const [
      confidenceFrames,         // VX-CO01
      dataLessFrames,           // VX-DA01
      ethicalFrames,            // VX-ED01
      emotionalFrames,          // VX-EM08
      entrapmentFrames,         // VX-EM09
      urgencyFrames,            // VX-FO01
      precisionFrames,          // VX-FP01
      hallucinationFrames,      // VX-HA01
      jargonFrames,             // VX-JU01
      oversimplificationFrames, // VX-NS01
      omissionFrames,           // VX-OS01
      consensusFrames,          // VX-PC01
      interruptionFrames,       // VX-RI01
      speculativeFrames,        // VX-SO01
      toneFrames,               // VX-TU01
      vaguenessFrames,          // VX-VG01
      aiContentFrames,          // VX-AI01
      narrativeFrames           // VX-NF01
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

    const semanticFrames         = detectSemanticPatterns(input);
    const enhancedSemanticFrames = detectEnhancedSemanticPatterns(input);
    const comprehensiveFrames    = detectComprehensiveManipulation(input);
    const pseudoInquiryFrames    = detectPseudoInquiry(input);

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
      confidence:           confidenceFrames.length,
      dataLess:             dataLessFrames.length,
      ethical:              ethicalFrames.length,
      emotional:            emotionalFrames.length,
      entrapment:           entrapmentFrames.length,
      urgency:              urgencyFrames.length,
      precision:            precisionFrames.length,
      hallucination:        hallucinationFrames.length,
      jargon:               jargonFrames.length,
      oversimplification:   oversimplificationFrames.length,
      omission:             omissionFrames.length,
      consensus:            consensusFrames.length,
      interruption:         interruptionFrames.length,
      speculative:          speculativeFrames.length,
      tone:                 toneFrames.length,
      vagueness:            vaguenessFrames.length,
      aiContent:            aiContentFrames.length,
      narrative:            narrativeFrames.length,
      semantic:             semanticFrames.length,
      enhancedSemantic:     enhancedSemanticFrames.length,
      comprehensive:        comprehensiveFrames.length,
      pseudoInquiry:        pseudoInquiryFrames.length,
    });
  } catch (err) {
    console.error(`🚨 [${timestamp}] Local detector error:`, err);
  }

  // 2) Optional: AWS Agent frames (skips if no endpoint)
  let agentFrames = [];
  if (useAgent && typeof import.meta !== "undefined" && import.meta.env?.VITE_AGENT_API_BASE) {
    try {
      const base = import.meta.env.VITE_AGENT_API_BASE;
      const res = await fetch(`${base}/agent/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { text: input }, handshake }),
      });
      if (res.ok) {
        const data = await res.json();
        const frames = Array.isArray(data?.frames) ? data.frames : (data?.frames?.items ?? []);
        if (Array.isArray(frames)) {
          agentFrames = frames.map((f) => ({
            reflexId:   String(f.reflexId ?? f.id ?? "agent-unknown"),
            reflexLabel:String(f.reflexLabel ?? f.label ?? "Agent Reflex"),
            confidence: Number(f.confidence ?? 0.5),
            rationale:  String(f.rationale ?? f.reason ?? ""),
            tags:       Array.isArray(f.tags) ? f.tags : [],
            priority:   typeof f.priority === "number" ? f.priority : undefined,
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

  // 3) Merge + de-duplicate
  const merged = dedupeFrames([...localFrames, ...agentFrames]);

  // 4) Codex gating (thresholds & blockers)
  const gated = [];
  let blockedBy = null;

  for (const f of merged) {
    const conf = typeof f.confidence === "number" ? f.confidence : 0;
    const { trigger, block } = shouldTriggerReflex(codex, f.reflexId, conf, stakes);
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

  // 5) Cluster detection
  const clustered = detectReflexClusters(gated, input);

  // 6) Sort: profile order first, then confidence
  const profileOrder = getReflexOrder(codex, handshake.reflex_profile);
  const rank = (id) => {
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
    codex,
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
    (e) => console.log("[telemetry]", e)
  );

  console.log(`🔍 [${timestamp}] Analysis finished, returning ${clustered.length} frames`);
  return clustered;
}

// ----------------- Helpers -----------------

function dedupeFrames(frames) {
  const seen = new Set();
  const out = [];
  for (const f of frames) {
    const key = `${f.reflexId}::${(f.rationale ?? f.reason ?? "").slice(0, 160)}::${f.reflexLabel ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(f);
    }
  }
  return out;
}

function detectReflexClusters(frames, originalInput) {
  const hasLegitSci =
    /requires further study|needs investigation|warrants research|seems plausible|appears to suggest/i.test(originalInput);

  const high  = frames.filter((f) => (f.confidence ?? 0) >= 0.75).length;
  const med   = frames.filter((f) => (f.confidence ?? 0) >= 0.55).length;
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
      rationale: `🔥 ${clusterType} CLUSTER ALERT: ${clusterCount} reflexes triggered on "${originalInput.substring(0, 50)}..."`,
      confidence: Math.max(...frames.map((f) => f.confidence ?? 0)),
      tags: ["cluster", "alert", clusterType.toLowerCase()],
      priority: 4,
    });
  }

  return frames;
}
