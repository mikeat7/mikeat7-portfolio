// VX-NF01 — Narrative Framing Detector
// Detects narrative framing techniques and perspective manipulation
const detectNarrativeFraming = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "despite",
            type: "adversarial-framing",
            severity: "medium",
            rationale: "Uses adversarial language to frame opposition or obstacles",
            explanation: "The word 'despite' creates an adversarial frame that positions certain factors as obstacles to be overcome, potentially biasing perception toward seeing conflict rather than complexity."
        },
        {
            phrase: "resilient",
            type: "heroic-framing",
            severity: "medium",
            rationale: "Uses heroic language to frame subjects as admirable",
            explanation: "This term frames subjects as heroically overcoming challenges, potentially obscuring whether their behavior is actually wise or sustainable by casting it in positive heroic terms."
        },
        {
            phrase: "robust",
            type: "strength-framing",
            severity: "medium",
            rationale: "Uses strength metaphors to frame performance positively",
            explanation: "This strength metaphor frames performance as powerful and healthy, potentially obscuring underlying weaknesses or unsustainability by emphasizing apparent vigor."
        },
        {
            phrase: "defies expert predictions",
            type: "authority-contradiction",
            severity: "high",
            rationale: "Frames outcomes as contradicting expert knowledge",
            explanation: "This phrase frames events as proving experts wrong, potentially undermining legitimate expertise while celebrating unpredictability as inherently positive."
        },
        {
            phrase: "plummet",
            type: "crisis-framing",
            severity: "high",
            rationale: "Uses dramatic decline language to amplify negative perception",
            explanation: "This dramatic term frames decreases as catastrophic falls rather than normal variations, potentially creating false sense of crisis or emergency."
        },
        {
            phrase: "slash workforce",
            type: "violence-framing",
            severity: "high",
            rationale: "Uses violent metaphors for business decisions",
            explanation: "This violent metaphor frames business decisions as aggressive attacks, potentially obscuring legitimate business considerations by emphasizing harm and aggression."
        },
        {
            phrase: "threatens millions",
            type: "threat-amplification",
            severity: "high",
            rationale: "Amplifies threat perception through scale emphasis",
            explanation: "This phrase amplifies threat perception by emphasizing large numbers of potential victims, potentially creating disproportionate fear response to manageable challenges."
        },
        {
            phrase: "unprecedented upheaval",
            type: "chaos-framing",
            severity: "high",
            rationale: "Frames change as chaotic and unprecedented",
            explanation: "This phrase frames normal change as unprecedented chaos, potentially preventing rational adaptation by emphasizing disruption over opportunity."
        },
        {
            phrase: "transform neighborhoods",
            type: "transformation-framing",
            severity: "medium",
            rationale: "Uses transformation language to frame change positively",
            explanation: "This transformation metaphor frames changes as positive evolution, potentially obscuring negative consequences or costs by emphasizing beneficial metamorphosis."
        },
        {
            phrase: "industry upheaval",
            type: "disruption-framing",
            severity: "medium",
            rationale: "Frames business changes as disruptive upheaval",
            explanation: "This phrase frames normal business evolution as disruptive upheaval, potentially creating false sense of instability in routine market changes."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.8 : severity === "medium" ? 0.65 : 0.5;
            frames.push({
                reflexId: `vx-nf01-${type}-${idx}`,
                reflexLabel: `Narrative Framing Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This narrative framing may influence perception by emphasizing certain aspects while de-emphasizing others, potentially shaping emotional and logical responses beyond what the facts alone would warrant.`,
                confidence,
                tags: ["narrative-framing", type, "perspective-manipulation"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectNarrativeFraming;
export { detectNarrativeFraming };
export const analyzeNarrativeFraming = detectNarrativeFraming;
