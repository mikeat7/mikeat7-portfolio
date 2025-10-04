/**
 * codex-runtime.ts — Validator + runtime helpers for front-end codex v0.9.0
 *
 * - Zero external deps. Vite + React friendly.
 * - Validates the JSON contract and exposes helpers for:
 *   handshake state, citation policy, omission scan, reflex thresholds,
 *   failure semantics, context decay, and telemetry (with redaction).
 *
 * Back-compat: includes both a "simple" emitTelemetry(event, payload?)
 * and a legacy emitTelemetry(codex, event, publish) form.
 */
/* -------------------------- Validation Utilities -------------------------- */
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
export function validateCodex(codex) {
    const errors = [];
    // Basic shape
    if (!SEMVER_RE.test(codex.codex_version)) {
        errors.push(`codex_version must be semver (got "${codex.codex_version}")`);
    }
    if (!codex.handshake_required_fields) {
        errors.push("missing handshake_required_fields");
    }
    else {
        const h = codex.handshake_required_fields;
        ["--direct", "--careful", "--recap"].forEach((m) => {
            if (!h.mode.includes(m))
                errors.push(`handshake.mode missing "${m}"`);
        });
        if (h.min_confidence.type !== "number") {
            errors.push("handshake.min_confidence.type must be 'number'");
        }
        const [lo, hi] = h.min_confidence.range;
        if (!(lo === 0 && hi === 1))
            errors.push("handshake.min_confidence.range must be [0,1]");
        if (h.codex_version !== codex.codex_version) {
            errors.push(`handshake.codex_version (${h.codex_version}) must match codex_version (${codex.codex_version})`);
        }
    }
    // Defaults must exist in long-form contract
    if (!codex.handshake_defaults)
        errors.push("missing handshake_defaults");
    ["--direct", "--careful", "--recap"].forEach((m) => {
        if (!codex.modes[m])
            errors.push(`modes missing "${m}"`);
    });
    ["low", "medium", "high"].forEach((s) => {
        if (!codex.stakes_policy[s])
            errors.push(`stakes_policy missing "${s}"`);
    });
    if (!codex.reflex_profiles?.default?.prioritization_order?.length) {
        errors.push("reflex_profiles.default.prioritization_order must not be empty");
    }
    if (!codex.failure_semantics)
        errors.push("missing failure_semantics");
    if (!codex.telemetry)
        errors.push("missing telemetry");
    if (errors.length)
        return { ok: false, errors };
    return { ok: true };
}
let _codex = null;
let _handshake = null;
let _publisher = null;
/** Initialize runtime with a validated codex + default handshake state. */
export function initCodexRuntime(codex) {
    const v = validateCodex(codex);
    if (!v.ok) {
        // eslint-disable-next-line no-console
        console.error("Codex invalid:", v.errors);
    }
    _codex = codex;
    _handshake = buildHandshake(codex, codex.handshake_defaults);
    if (typeof window !== "undefined") {
        window.__clarityArmorCodex = { config: codex, handshake: _handshake };
    }
}
/** Optional: set a custom telemetry sink (e.g., window.dispatchEvent, fetch, etc.) */
export function setTelemetryPublisher(publish) {
    _publisher = publish;
}
export function getCodexConfig() {
    return _codex;
}
export function getHandshake() {
    if (_handshake)
        return _handshake;
    if (_codex) {
        _handshake = buildHandshake(_codex, _codex.handshake_defaults);
        return _handshake;
    }
    // Extremely safe fallback
    return {
        mode: "--careful",
        stakes: "medium",
        min_confidence: 0.6,
        cite_policy: "auto",
        omission_scan: "auto",
        reflex_profile: "default",
        codex_version: "0.9.0"
    };
}
/** Validate and normalize a partial handshake update against codex rules. */
export function validateHandshake(codex, next) {
    const base = buildHandshake(codex, getHandshake());
    const errors = [];
    const mode = ["--direct", "--careful", "--recap"].includes(next.mode ?? base.mode)
        ? (next.mode ?? base.mode)
        : base.mode;
    const stakes = ["low", "medium", "high"].includes(next.stakes ?? base.stakes)
        ? (next.stakes ?? base.stakes)
        : base.stakes;
    const min_confidence = enforceConfidence(codex, stakes, typeof next.min_confidence === "number" ? next.min_confidence : base.min_confidence, mode);
    const cite_policy = ["off", "auto", "force"].includes(next.cite_policy ?? base.cite_policy)
        ? (next.cite_policy ?? base.cite_policy)
        : base.cite_policy;
    const omission_scan = typeof next.omission_scan === "boolean" || next.omission_scan === "auto"
        ? next.omission_scan
        : base.omission_scan;
    const reflex_profile = ["default", "strict", "lenient"].includes(next.reflex_profile ?? base.reflex_profile)
        ? (next.reflex_profile ?? base.reflex_profile)
        : base.reflex_profile;
    const normalized = {
        mode,
        stakes,
        min_confidence,
        cite_policy,
        omission_scan,
        reflex_profile,
        codex_version: codex.codex_version
    };
    return { ok: errors.length === 0, errors, normalized };
}
/** Build a handshake header from codex policies + options. */
export function buildHandshake(codex, opts = {}) {
    const mode = opts.mode ?? codex.handshake_defaults?.mode ?? "--careful";
    const stakes = opts.stakes ?? codex.handshake_defaults?.stakes ?? "medium";
    const modeDefault = codex.modes[mode].min_confidence_default;
    const floor = codex.stakes_policy[stakes].min_confidence_floor;
    const min_confidence = Math.max(floor, opts.min_confidence ?? codex.handshake_defaults?.min_confidence ?? modeDefault);
    const cite_policy = opts.cite_policy ?? codex.handshake_defaults?.cite_policy ?? codex.stakes_policy[stakes].cite_policy_default;
    const omission_scan = (opts.omission_scan ?? codex.handshake_defaults?.omission_scan ?? codex.stakes_policy[stakes].omission_scan_default);
    const reflex_profile = opts.reflex_profile ?? codex.handshake_defaults?.reflex_profile ?? "default";
    return {
        mode,
        stakes,
        min_confidence,
        cite_policy,
        omission_scan,
        reflex_profile,
        codex_version: codex.codex_version
    };
}
/** Commit a partial handshake update into runtime state. */
export function setHandshake(next) {
    if (!_codex)
        return;
    const { normalized } = validateHandshake(_codex, next);
    _handshake = normalized;
    if (typeof window !== "undefined") {
        window.__clarityArmorCodex = { config: _codex, handshake: _handshake };
    }
    emitTelemetry("handshake.update", { handshake: normalized });
}
/* ------------------------------ Policy Logic ------------------------------ */
export function decideCitation(codex, stakes, confidence, externalClaim, citePolicy) {
    // Honor explicit cite policy first
    if (citePolicy === "force")
        return true;
    if (citePolicy === "off") {
        // allow "off" for low-stakes only; for medium/high we still bias to cite
        return stakes !== "low";
    }
    // Auto: fast path rules
    const hooks = codex.citation_hooks;
    if (externalClaim)
        return true;
    if (hooks?.require_for_stakes?.includes(stakes))
        return true;
    if (["medium", "high"].includes(stakes) && confidence < 0.85)
        return true;
    return false;
}
export function shouldRequireCitations() {
    if (!_codex)
        return false;
    const h = getHandshake();
    if (h.cite_policy === "force")
        return true;
    if (h.cite_policy === "off")
        return false;
    // "auto" + hooks
    const hooks = _codex.citation_hooks;
    return hooks?.require_for_stakes?.includes(h.stakes) ?? false;
}
export function shouldRunOmissionScan(codex, stakes, omissionScan) {
    if (typeof omissionScan === "boolean")
        return omissionScan;
    // "auto" -> prefer ON for medium/high, ON by default for low (cheap signal)
    return stakes === "high" || stakes === "medium" || stakes === "low";
}
/** Order reflex execution by profile priority, filtering by thresholds. */
export function getReflexOrder(codex, profile) {
    const order = codex.reflex_profiles[profile].prioritization_order;
    return order.filter((id) => codex.reflex_thresholds[id]);
}
/** Decide if a reflex should trigger or block given score/stakes/thresholds. */
export function shouldTriggerReflex(codex, reflexId, score, stakes) {
    const t = codex.reflex_thresholds[reflexId];
    if (!t)
        return { trigger: false, block: false };
    // Optional suppression by stakes
    if (t.suppress_below_stakes && rankStakes(stakes) < rankStakes(t.suppress_below_stakes)) {
        return { trigger: false, block: false };
    }
    const trigger = score >= t.trigger_at;
    const block = typeof t.block_if_over === "number" ? score >= t.block_if_over : false;
    return { trigger, block };
}
function rankStakes(s) {
    return s === "low" ? 0 : s === "medium" ? 1 : 2;
}
export function contextExpired(codex, age) {
    const d = codex.context_decay;
    const turnsLimit = d.force_recap_after_turns ?? d.max_turns_without_recap;
    const tokenLimit = d.force_recap_after_tokens ?? d.max_tokens_since_recap;
    return age.turnsSinceRecap >= turnsLimit || age.tokensSinceRecap >= tokenLimit;
}
export function classifyFailure(codex, confidence) {
    const { hedge_threshold = 0.4, refuse_threshold = 0.2 } = codex.failure_semantics || {};
    if (confidence <= (refuse_threshold ?? 0.2))
        return "refuse";
    if (confidence <= (hedge_threshold ?? 0.4))
        return "hedge";
    return "ok";
}
export function failureText(codex, kind) {
    const f = codex.failure_semantics[kind];
    return { text: f.ui_failover_text, action: f.action };
}
/* ------------------------------ Confidence -------------------------------- */
export function enforceConfidence(codex, stakes, requestedMin, mode) {
    const floor = codex.stakes_policy[stakes].min_confidence_floor;
    const modeDefault = codex.modes[mode].min_confidence_default;
    return Math.max(floor, requestedMin ?? modeDefault);
}
export function emitTelemetry(a, b, c) {
    // LEGACY: (codex, event, publish)
    if (typeof a !== "string") {
        const codex = a;
        const ev = b ?? { name: "unknown" };
        const publish = c;
        if (!codex.telemetry?.emit_events)
            return;
        publish({ ...ev, timestamp: ev.timestamp ?? Date.now() });
        return;
    }
    // SIMPLE: (eventName, payload?)
    const name = a;
    const codex = _codex;
    if (!codex || codex.telemetry?.enabled === false || codex.telemetry?.emit_events === false) {
        return;
    }
    // Field redaction: only redact top-level keys listed in redact_fields
    const redact = new Set(codex.telemetry?.redact_fields ?? []);
    const safe = {};
    const data = b ?? {};
    for (const [k, v] of Object.entries(data)) {
        safe[k] = redact.has(k) ? "[redacted]" : v;
    }
    const evt = { name, data: safe, timestamp: Date.now() };
    // Default sink: console
    // eslint-disable-next-line no-console
    console.log(`[telemetry] ${evt.name}`, evt.data);
    // Optional custom sink
    if (_publisher)
        _publisher(evt);
    // Optional DOM broadcast for low-friction integrations
    if (typeof window !== "undefined") {
        try {
            window.dispatchEvent(new CustomEvent("clarityarmor:telemetry", { detail: evt }));
        }
        catch {
            /* noop */
        }
    }
}
/* ------------------------------ Example Usage ----------------------------- */
/*
import codexJson from "@/data/front-end-codex.v0.9.json";

// Initialize once at app boot:
initCodexRuntime(codexJson as Codex);

// Build or update handshakes:
const initial = buildHandshake(codexJson as Codex, { mode: "--careful", stakes: "high" });
setHandshake({ cite_policy: "force", min_confidence: 0.75 });

// Policy checks:
const needCite = decideCitation(codexJson as Codex, "high", 0.82, true, getHandshake().cite_policy);
const runOmissions = shouldRunOmissionScan(codexJson as Codex, "high", getHandshake().omission_scan);

// Reflex & thresholds:
const order = getReflexOrder(codexJson as Codex, getHandshake().reflex_profile);
const { trigger, block } = shouldTriggerReflex(codexJson as Codex, "hallucination", 0.81, "high");

// Context decay:
const expired = contextExpired(codexJson as Codex, { turnsSinceRecap: 13, tokensSinceRecap: 1200 });

// Failure semantics:
const outcome = classifyFailure(codexJson as Codex, 0.33); // "hedge"
const ft = failureText(codexJson as Codex, "hedge");

// Telemetry:
emitTelemetry("analysis.complete", { count: 7, stakes: getHandshake().stakes, latestInput: "..." });
*/
