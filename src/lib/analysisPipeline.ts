import codex from "@/data/front-end-codex.v0.9.json";
import {
  decideCitation,
  shouldRunOmissionScan,
  getReflexOrder,
  shouldTriggerReflex,
  enforceConfidence,
  contextExpired,
  type Mode,
  type Stakes,
  emitTelemetry,
} from "@/lib/codex-runtime";

export interface AnalysisInput {
  stakes: Stakes;
  mode: Mode;
  // e.g., { hallucination: 0.81, omission: 0.62, ... }
  scores: Record<string, number>;
  contextAge: { turnsSinceRecap: number; tokensSinceRecap: number };
  externalClaim?: boolean;
  citePolicyOverride?: "off" | "auto" | "force";
}

export interface FiredReflex {
  reflexId: string;
  score: number;
}

export interface AnalysisOutcome {
  minConf: number;
  fired: FiredReflex[];
  blockedBy?: string;
  needCite: boolean;
  runOmissions: boolean;
  expired: boolean;
}

/**
 * Pure front-end policy pass: takes detector scores and applies
 * thresholds, co-fire order, citation policy, omission scan, and context decay.
 */
export function runAnalysis(input: AnalysisInput): AnalysisOutcome {
  const minConf = enforceConfidence(codex as any, input.stakes, undefined, input.mode);

  const order = getReflexOrder(codex as any, "default");
  const fired: FiredReflex[] = [];

  for (const reflexId of order) {
    const score = input.scores[reflexId] ?? 0;
    const { trigger, block } = shouldTriggerReflex(codex as any, reflexId, score, input.stakes);
    if (block) {
      emitTelemetry("analysis.blocked", { reflexId, score });
      return {
        minConf,
        fired,
        blockedBy: reflexId,
        needCite: true,
        runOmissions: true,
        expired: false,
      };
    }
    if (trigger) fired.push({ reflexId, score });
  }

  const needCite = decideCitation(
    codex as any,
    input.stakes,
    Math.max(0, ...fired.map((f) => f.score), 0.5),
    !!input.externalClaim,
    input.citePolicyOverride ?? "auto"
  );

  const runOmissions = shouldRunOmissionScan(codex as any, input.stakes, "auto");
  const expired = contextExpired(codex as any, input.contextAge);

  emitTelemetry("analysis.complete", {
    firedCount: fired.length,
    needCite,
    runOmissions,
    expired,
  });

  return { minConf, fired, needCite, runOmissions, expired };
}
