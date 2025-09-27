// VX-PC01 — Perceived Consensus Detector
// Flags exaggerated or fabricated agreement claims with enhanced analysis
const detectPerceivedConsensus = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "then they created another one",
            type: "implied-causation",
            severity: "medium",
        },
        {
            phrase: "as much as we want to put it behind us",
            type: "manufactured-consensus",
            severity: "high",
            rationale: "Creates false impression of universal desire without evidence",
            explanation: "This phrase assumes everyone shares the same sentiment about wanting to 'put it behind us' without any polling or evidence of such consensus. It manufactures agreement to make the following claims seem more reasonable."
        },
        {
            phrase: "then they created another one",
            type: "implied-causation",
            severity: "medium",
            rationale: "Implies direct causation without establishing clear causal link",
            explanation: "This phrase suggests that one action directly caused another problem without providing evidence for the causal relationship. It's a common rhetorical device that can mislead by oversimplifying complex cause-and-effect relationships."
        },
        {
            phrase: "everyone knows",
            type: "consensus",
            severity: "high",
            rationale: "Claims universal knowledge without evidence",
            explanation: "This phrase implies total agreement across all people without providing any supporting evidence or acknowledging dissenting views. It's a classic appeal to false consensus that bypasses the need for actual proof."
        },
        {
            phrase: "everyone agrees",
            type: "consensus",
            severity: "high",
            rationale: "Asserts unanimous agreement without proof",
            explanation: "Suggests complete consensus while bypassing the need to demonstrate actual agreement or address counterarguments."
        },
        {
            phrase: "widely held belief",
            type: "authority",
            severity: "medium",
            rationale: "Appeals to popularity without evidence",
            explanation: "Uses perceived widespread acceptance as validation without providing evidence for the belief's accuracy."
        },
        {
            phrase: "nobody disputes",
            type: "suppression",
            severity: "high",
            rationale: "Suppresses dissent by claiming unanimity",
            explanation: "Dismisses potential disagreement by asserting that no opposition exists, effectively silencing debate."
        },
        {
            phrase: "guaranteed",
            type: "certainty",
            severity: "high",
            rationale: "Claims absolute certainty without qualification",
            explanation: "Uses absolute language that eliminates nuance and presents opinion as unquestionable fact."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase.toLowerCase())) {
            const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
            frames.push({
                reflexId: `vx-pc01-${type}-${idx}`,
                reflexLabel: `Consensus Manipulation Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}. 
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This language pattern attempts to bypass critical thinking by appealing to imaginary consensus rather than providing evidence or logical reasoning.`,
                confidence,
                tags: ["consensus", type, "manipulation"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
// ✅ Export both default and named for compatibility
export default detectPerceivedConsensus;
export { detectPerceivedConsensus };
export const analyzeConsensus = detectPerceivedConsensus;
