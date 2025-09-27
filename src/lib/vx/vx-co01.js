// VX-CO01 — Confidence Illusion Detector
// Enhanced version with detailed analysis
const detectConfidenceIllusion = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "guaranteed",
            type: "absolute-certainty",
            severity: "high",
            rationale: "Claims absolute certainty without providing evidence or qualification",
            explanation: "The word 'guaranteed' eliminates all uncertainty and presents claims as unquestionable facts. This absolute language bypasses the need for evidence or logical reasoning by asserting complete confidence where none may be justified."
        },
        {
            phrase: "undeniable",
            type: "absolute-certainty",
            severity: "high",
            rationale: "Asserts claims cannot be questioned or disputed",
            explanation: "This term shuts down debate by declaring the claim beyond dispute. It's a form of intellectual bullying that attempts to make disagreement seem unreasonable rather than providing actual evidence."
        },
        {
            phrase: "no doubt",
            type: "certainty-claim",
            severity: "high",
            rationale: "Eliminates uncertainty without justification",
            explanation: "This phrase asserts complete confidence while providing no basis for that certainty. It can mask weak evidence or unsupported opinions by presenting them with artificial confidence."
        },
        {
            phrase: "100% certain",
            type: "numerical-certainty",
            severity: "high",
            rationale: "Uses precise numbers to create false impression of scientific certainty",
            explanation: "Mathematical precision (100%) is used to make subjective claims appear objective and scientifically validated, even when no actual measurement or data supports such certainty."
        },
        {
            phrase: "irrefutable",
            type: "absolute-certainty",
            severity: "high",
            rationale: "Claims evidence cannot be challenged or contradicted",
            explanation: "This term presents arguments as beyond criticism, effectively shutting down scientific skepticism and critical thinking by declaring the matter settled without proper peer review or debate."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
            frames.push({
                reflexId: `vx-co01-${type}-${idx}`,
                reflexLabel: `Confidence Illusion Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This overconfident language may be used to bypass critical thinking by presenting opinions as unquestionable facts, potentially misleading audiences about the actual strength of evidence or reasoning behind claims.`,
                confidence,
                tags: ["confidence-illusion", type, "overconfidence"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectConfidenceIllusion;
export { detectConfidenceIllusion };
export const analyzeConfidenceIllusion = detectConfidenceIllusion;
export const analyzeConsensusOverreach = detectConfidenceIllusion;
