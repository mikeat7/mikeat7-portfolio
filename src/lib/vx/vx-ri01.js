// VX-RI01 — Rhetorical Interruption Detector
// Enhanced version with detailed analysis
const detectRhetoricalInterruption = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "that's irrelevant",
            type: "dismissal-tactic",
            severity: "high",
            rationale: "Dismisses points without engaging with their substance",
            explanation: "This phrase shuts down discussion by declaring topics off-limits without explaining why they're irrelevant. It's often used to avoid addressing inconvenient facts or arguments that might weaken one's position."
        },
        {
            phrase: "you're missing the point",
            type: "deflection-tactic",
            severity: "high",
            rationale: "Redirects discussion away from challenging topics",
            explanation: "This phrase implies the speaker has the 'real' point while dismissing the current discussion. It's used to avoid engaging with difficult questions by suggesting the questioner is confused or off-track."
        },
        {
            phrase: "let's move on",
            type: "topic-control",
            severity: "medium",
            rationale: "Controls conversation flow to avoid uncomfortable topics",
            explanation: "This phrase attempts to end discussion of topics that may be uncomfortable or damaging to the speaker's position. It's a form of conversational control that prevents thorough exploration of important issues."
        },
        {
            phrase: "you're avoiding the issue",
            type: "accusatory-deflection",
            severity: "high",
            rationale: "Uses accusation to deflect from one's own avoidance",
            explanation: "This phrase projects avoidance onto others while potentially being guilty of the same behavior. It's often used when the accuser is actually the one avoiding difficult questions or topics."
        },
        {
            phrase: "stop deflecting",
            type: "projection-tactic",
            severity: "high",
            rationale: "Accuses others of deflection while potentially deflecting oneself",
            explanation: "This accusation can be a form of deflection itself, used to put opponents on the defensive rather than addressing their actual points. It shifts focus from content to conversational tactics."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.85 : severity === "medium" ? 0.7 : 0.55;
            frames.push({
                reflexId: `vx-ri01-${type}-${idx}`,
                reflexLabel: `Rhetorical Interruption Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This rhetorical interruption may be designed to control the conversation and avoid addressing challenging points, potentially preventing thorough discussion of important issues.`,
                confidence,
                tags: ["rhetorical-interruption", type, "conversation-control"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectRhetoricalInterruption;
export { detectRhetoricalInterruption };
export const analyzeRepetition = detectRhetoricalInterruption;
