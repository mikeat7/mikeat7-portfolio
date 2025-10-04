import codex from "@/data/front-end-codex.v0.9.json";
import { decideCitation, shouldRunOmissionScan, getReflexOrder, shouldTriggerReflex, enforceConfidence, contextExpired, emitTelemetry, } from "@/lib/codex-runtime";
/**
 * Pure front-end policy pass: takes detector scores and applies
 * thresholds, co-fire order, citation policy, omission scan, and context decay.
 */
export function runAnalysis(input) {
    const minConf = enforceConfidence(codex, input.stakes, undefined, input.mode);
    const order = getReflexOrder(codex, "default");
    const fired = [];
    for (const reflexId of order) {
        const score = input.scores[reflexId] ?? 0;
        const { trigger, block } = shouldTriggerReflex(codex, reflexId, score, input.stakes);
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
        if (trigger)
            fired.push({ reflexId, score });
    }
    const needCite = decideCitation(codex, input.stakes, Math.max(0, ...fired.map((f) => f.score), 0.5), !!input.externalClaim, input.citePolicyOverride ?? "auto");
    const runOmissions = shouldRunOmissionScan(codex, input.stakes, "auto");
    const expired = contextExpired(codex, input.contextAge);
    emitTelemetry("analysis.complete", {
        firedCount: fired.length,
        needCite,
        runOmissions,
        expired,
    });
    return { minConf, fired, needCite, runOmissions, expired };
}
