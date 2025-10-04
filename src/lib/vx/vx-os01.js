// VX-OS01 — Omission Detector
// Flags missing context, attribution, or citations.
const OMISSION_MAP = {
    "studies show": { phrase: "studies show", type: "citation", severity: "high" },
    "experts agree": { phrase: "experts agree", type: "citation", severity: "high" },
    "caused by": { phrase: "caused by", type: "citation", severity: "high" },
    "is caused": { phrase: "is caused", type: "citation", severity: "high" },
    "no longer conducts rigorous": { phrase: "no longer conducts rigorous", type: "buried-admission", severity: "high" },
    "fewer people are also": { phrase: "fewer people are also", type: "data-quality", severity: "high" },
    "but the data do provide": { phrase: "but the data do provide", type: "contradiction", severity: "high" },
    "research indicates": { phrase: "research indicates", type: "citation", severity: "medium" },
    "some say": { phrase: "some say", type: "authority", severity: "medium" },
    "it is believed": { phrase: "it is believed", type: "authority", severity: "medium" },
    "as everyone knows": { phrase: "as everyone knows", type: "consensus", severity: "high" },
    "clearly": { phrase: "clearly", type: "consensus", severity: "low" },
};
const detectOmission = (text) => {
    const frames = [];
    const lower = text.toLowerCase();
    Object.values(OMISSION_MAP).forEach(({ phrase, type, severity }, idx) => {
        if (lower.includes(phrase)) {
            const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
            // Special check for citation omissions
            const hasSources = /source|link|reference|citation/i.test(lower);
            const finalConfidence = (type === "citation" && !hasSources) ? Math.min(confidence + 0.1, 0.95) : confidence;
            frames.push({
                reflexId: `vx-os01-${type}-${idx}`,
                reflexLabel: `Detected ${type} omission`,
                rationale: `The phrase "${phrase}" indicates ${type === "citation" ? "missing source attribution" : type === "authority" ? "vague authority claims" : "implied consensus without justification"}.`,
                confidence: finalConfidence,
                tags: ["omission", type],
                priority: severity === "high" ? 3 : 2,
            });
        }
    });
    return frames;
};
// ✅ Export both default and named for compatibility
export default detectOmission;
export { detectOmission };
export const analyzeOmission = detectOmission;
