// VX-ENHANCED-SEMANTIC — Comprehensive Manipulation Pattern Detection
// Built from expert linguistic analysis and real-world propaganda examples
import manipulationPatterns from "@/data/manipulation-patterns-enhanced.json";
const detectEnhancedSemanticPatterns = (text) => {
    const frames = [];
    const lowered = text.toLowerCase();
    manipulationPatterns.forEach(pattern => {
        // Check for semantic indicators
        const matchedIndicators = pattern.semantic_indicators.filter(indicator => lowered.includes(indicator.toLowerCase()));
        if (matchedIndicators.length > 0) {
            // Check for context clues to increase confidence
            const hasContext = pattern.context_clues.some(clue => lowered.includes(clue.toLowerCase()));
            // Calculate final confidence based on matches and context
            let finalConfidence = pattern.detection_confidence;
            if (hasContext) {
                finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
            }
            if (matchedIndicators.length > 1) {
                finalConfidence = Math.min(finalConfidence + 0.05, 0.95);
            }
            // Determine priority based on severity
            const priority = pattern.severity === "critical" ? 4 :
                pattern.severity === "high" ? 3 :
                    pattern.severity === "medium" ? 2 : 1;
            frames.push({
                reflexId: `vx-semantic-${pattern.id}`,
                reflexLabel: `${pattern.name} Detected`,
                rationale: `🎯 Manipulation Pattern: ${pattern.description}
        
📋 Detected Indicators: ${matchedIndicators.join(", ")}
        
🧠 Psychological Mechanism: ${pattern.psychological_mechanism}
        
⚠️ Impact: This ${pattern.category} manipulation technique may bypass critical thinking by ${pattern.psychological_mechanism.toLowerCase()}, potentially misleading audiences about the actual strength of evidence or reasoning.`,
                confidence: finalConfidence,
                tags: ["semantic-manipulation", pattern.category, pattern.id],
                priority
            });
        }
    });
    return frames;
};
export default detectEnhancedSemanticPatterns;
export { detectEnhancedSemanticPatterns };
