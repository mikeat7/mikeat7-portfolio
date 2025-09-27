// VX-JU01 — Jargon Overload Detector
// Enhanced version with detailed analysis
const detectJargonOverload = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "leverage synergies",
            type: "corporate-buzzwords",
            severity: "high",
            rationale: "Uses meaningless corporate jargon to obscure simple concepts",
            explanation: "This phrase combines two business buzzwords that sound sophisticated but convey little actual meaning. 'Leverage synergies' typically means 'use combined resources' but the jargon makes simple concepts sound more complex and authoritative than they are."
        },
        {
            phrase: "operationalize",
            type: "process-jargon",
            severity: "medium",
            rationale: "Transforms simple actions into complex-sounding processes",
            explanation: "This term takes the simple concept of 'implement' or 'put into practice' and makes it sound more technical and important. It's often used to make routine activities appear more strategic or sophisticated."
        },
        {
            phrase: "scalable solutions",
            type: "tech-buzzwords",
            severity: "medium",
            rationale: "Uses technical jargon to make vague promises sound concrete",
            explanation: "While 'scalable' has specific technical meaning, it's often used as a buzzword to make any proposal sound more impressive and future-ready, even when scalability isn't relevant or the 'solution' isn't clearly defined."
        },
        {
            phrase: "paradigm shift",
            type: "transformation-jargon",
            severity: "high",
            rationale: "Overuses academic terminology to inflate importance of changes",
            explanation: "This phrase, borrowed from scientific philosophy, is often misused to make any change sound revolutionary and fundamental, even when describing minor adjustments or normal business evolution."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.85 : severity === "medium" ? 0.7 : 0.55;
            frames.push({
                reflexId: `vx-ju01-${type}-${idx}`,
                reflexLabel: `Jargon Overload Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This jargon may be used to create an illusion of expertise or sophistication while actually obscuring meaning and making simple concepts unnecessarily complex, potentially intimidating audiences into acceptance without understanding.`,
                confidence,
                tags: ["jargon-overload", type, "obfuscation"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectJargonOverload;
export { detectJargonOverload };
export const analyzeJargonOverload = detectJargonOverload;
