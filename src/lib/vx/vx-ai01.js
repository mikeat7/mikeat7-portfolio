// VX-AI01 — AI-Generated Content Detector
// Detects patterns typical of AI-generated text
const detectAIGeneratedContent = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    const patterns = [
        {
            phrase: "as an ai",
            type: "ai-self-identification",
            severity: "high",
            rationale: "Direct AI self-identification",
            explanation: "This phrase is a clear indicator of AI-generated content, as AI systems often identify themselves this way when responding to queries."
        },
        {
            phrase: "i don't have personal opinions",
            type: "ai-disclaimer",
            severity: "high",
            rationale: "Typical AI disclaimer about lacking personal views",
            explanation: "AI systems frequently use this disclaimer to avoid taking positions on controversial topics, indicating artificial rather than human authorship."
        },
        {
            phrase: "here are some key points",
            type: "structured-response",
            severity: "medium",
            rationale: "Overly structured presentation typical of AI responses",
            explanation: "AI systems often organize information in bullet points or numbered lists, creating more structured responses than typical human communication."
        },
        {
            phrase: "it's worth noting that",
            type: "ai-hedging",
            severity: "medium",
            rationale: "Formal hedging language common in AI responses",
            explanation: "This formal transitional phrase is frequently used by AI systems to introduce qualifications or additional information in a structured way."
        },
        {
            phrase: "based on my training data",
            type: "ai-limitation-acknowledgment",
            severity: "high",
            rationale: "Direct reference to AI training process",
            explanation: "This phrase explicitly acknowledges the AI's training-based knowledge, which is a clear indicator of artificial rather than human authorship."
        },
        {
            phrase: "i should note that",
            type: "ai-disclaimer",
            severity: "medium",
            rationale: "Formal disclaimer language typical of AI systems",
            explanation: "AI systems often use this phrase to introduce caveats or limitations, reflecting their programmed tendency to provide balanced, cautious responses."
        }
    ];
    patterns.forEach(({ phrase, type, severity, rationale, explanation }, idx) => {
        if (lowered.includes(phrase)) {
            const confidence = severity === "high" ? 0.9 : severity === "medium" ? 0.75 : 0.6;
            frames.push({
                reflexId: `vx-ai01-${type}-${idx}`,
                reflexLabel: `AI-Generated Content Detected`,
                rationale: `🎯 Pattern: "${phrase}" - ${rationale}
        
📋 Analysis: ${explanation}
        
⚠️ Impact: This language pattern suggests artificial rather than human authorship, which may be relevant for understanding the source and nature of the content.`,
                confidence,
                tags: ["ai-generated", type, "artificial-content"],
                priority: severity === "high" ? 3 : 2
            });
        }
    });
    return frames;
};
export default detectAIGeneratedContent;
export { detectAIGeneratedContent };
export const analyzeAIContent = detectAIGeneratedContent;
