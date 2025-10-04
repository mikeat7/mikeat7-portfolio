// VX-ED01 — Ethical Drift Detector
// Enhanced version with detailed analysis
const detectEthicalDrift = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "it's only fair",
            type: "moral-framing",
            severity: "high",
            rationale: "Uses fairness appeal to justify potentially biased actions",
            explanation: "This phrase invokes moral authority ('fairness') to bypass logical scrutiny. It assumes universal agreement on what constitutes 'fair' while potentially advancing a particular agenda under the guise of moral righteousness."
        },
        {
            phrase: "for the greater good",
            type: "utilitarian-manipulation",
            severity: "high",
            rationale: "Utilitarian framing used to justify ethical compromises",
            explanation: "This classic utilitarian phrase is often used to rationalize harmful actions by appealing to collective benefit. It can mask individual rights violations or ethical shortcuts by claiming broader positive outcomes."
        },
        {
            phrase: "necessary evil",
            type: "ethical-compromise",
            severity: "high",
            rationale: "Explicitly acknowledges harm while attempting to justify it",
            explanation: "This phrase admits wrongdoing while trying to make it acceptable through necessity claims. It's a form of ethical drift that normalizes harmful behavior by framing it as unavoidable."
        },
        {
            phrase: "you owe it to",
            type: "obligation-manipulation",
            severity: "medium",
            rationale: "Creates artificial moral obligations to influence behavior",
            explanation: "This phrase manufactures debt or duty where none may exist, using guilt and social pressure to compel action rather than relying on genuine persuasion or evidence."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
            frames.push({
                reflexId: `vx-ed01-${type}-${idx}`,
                reflexLabel: `Ethical Drift Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This ethical framing may be used to bypass critical thinking by appealing to moral intuitions rather than logical reasoning, potentially leading to decisions that compromise individual rights or ethical standards.`,
                confidence,
                tags: ["ethical-drift", type, "manipulation"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectEthicalDrift;
export { detectEthicalDrift };
export const analyzeEthicalDrift = detectEthicalDrift;
