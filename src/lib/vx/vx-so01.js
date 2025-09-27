// VX-SO01 — Speculative Overreach Detector
// Enhanced version with detailed analysis
const detectSpeculativeOverreach = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "may",
            type: "speculation",
            severity: "medium",
        },
        {
            phrase: "likely growing",
            type: "speculative-certainty",
            severity: "high",
            rationale: "Presents speculation as probable fact without supporting evidence",
            explanation: "The phrase 'likely growing' suggests probability without providing the statistical basis for that assessment. This creates false confidence in uncertain projections."
        },
        {
            phrase: "estimates",
            type: "data-hedging",
            severity: "medium",
            rationale: "Uses uncertain data while maintaining authoritative tone",
            explanation: "Acknowledges data uncertainty while continuing to make definitive claims based on that uncertain data."
        },
        {
            phrase: "may",
            type: "speculation",
            severity: "medium",
            rationale: "Uses speculative language without providing evidence or clear attribution",
            explanation: "The word 'may' introduces uncertainty while presenting information as potentially factual. This hedging language can mask the lack of concrete evidence or create false impressions of possibility without proper justification."
        },
        {
            phrase: "possibly",
            type: "speculation",
            severity: "high",
            rationale: "Presents speculation as potential fact without supporting evidence",
            explanation: "The term 'possibly' suggests likelihood without providing any basis for that assessment. This creates an illusion of informed speculation while actually offering no substantive information."
        },
        {
            phrase: "could potentially",
            type: "double-speculation",
            severity: "high",
            rationale: "Double speculative language compounds uncertainty while masking lack of evidence",
            explanation: "Combining 'could' and 'potentially' creates layered speculation that sounds more authoritative than it is. This pattern often disguises complete uncertainty as measured possibility."
        },
        {
            phrase: "might be",
            type: "speculation",
            severity: "medium",
            rationale: "Hedged language that avoids commitment while implying knowledge",
            explanation: "This phrase suggests the speaker has some basis for the claim while actually providing no evidence or reasoning."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.8 : severity === "medium" ? 0.6 : 0.4;
            frames.push({
                reflexId: `vx-so01-${type}-${idx}`,
                reflexLabel: `Speculative Overreach Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This speculative language may create false impressions of knowledge or certainty where none exists, potentially misleading readers about the strength of evidence behind claims.`,
                confidence,
                tags: ["speculation", type, "overreach"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectSpeculativeOverreach;
export { detectSpeculativeOverreach };
export const analyzeSpeculation = detectSpeculativeOverreach;
export const detectSpeculativeAuthority = detectSpeculativeOverreach;
