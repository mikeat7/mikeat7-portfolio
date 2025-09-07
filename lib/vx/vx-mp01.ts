// VX-MP01 — Comprehensive Manipulation Pattern Detector
// Uses expert-generated taxonomy to detect sophisticated propaganda techniques
// Now includes advanced patterns from collaborative AI analysis

import { VXFrame } from "@/types/VXTypes";
import manipulationPatterns from "@/data/manipulation-patterns-comprehensive.json";

interface ManipulationPattern {
  id: string;
  name: string;
  category: string;
  sophistication_level?: string;
  description: string;
  semantic_indicators: string[];
  context_clues?: string[];
  context_dependencies?: string[];
  nested_techniques?: string[];
  examples: string[];
  psychological_mechanism: string;
  counter_detection?: string;
  detection_confidence: number;
  false_positive_risk?: string;
  severity: string;
}

const detectComprehensiveManipulation = (text: string): VXFrame[] => {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();
  
  (manipulationPatterns as ManipulationPattern[]).forEach(pattern => {
    // Check for semantic indicators
    const matchedIndicators = pattern.semantic_indicators.filter(indicator => 
      lowered.includes(indicator.toLowerCase())
    );
    
    if (matchedIndicators.length > 0) {
      // Check for context clues to increase confidence
      const hasContext = (pattern.context_clues || pattern.context_dependencies || []).some(clue => 
        lowered.includes(clue.toLowerCase())
      );
      
      // Calculate final confidence based on matches and context
      let finalConfidence = pattern.detection_confidence;
      if (hasContext) {
        finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
      }
      if (matchedIndicators.length > 1) {
        finalConfidence = Math.min(finalConfidence + 0.05, 0.95);
      }
      
      // Adjust for sophistication level
      if (pattern.sophistication_level === "expert") {
        finalConfidence = Math.min(finalConfidence + 0.05, 0.95);
      }
      
      // BOOST confidence for sophisticated hedge-leap patterns
      if (pattern.id === "AMP002" && /while.*doesn't.*but.*undeniable|although.*however.*obvious/i.test(text)) {
        finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
      }
      
      // REDUCE confidence for legitimate scientific uncertainty
      const hasLegitimateScience = /requires further study|needs investigation|warrants research/i.test(text);
      if (hasLegitimateScience && pattern.category === "statistical") {
        finalConfidence = Math.max(finalConfidence - 0.2, 0.6);
      }
      
      // Determine priority based on severity
      const priority = pattern.severity === "critical" ? 4 :
                      pattern.severity === "high" ? 3 :
                      pattern.severity === "medium" ? 2 : 1;
      
      frames.push({
        reflexId: `vx-mp01-${pattern.id}`,
        reflexLabel: `${pattern.name} Detected`,
        rationale: `🎯 ${pattern.sophistication_level ? pattern.sophistication_level.toUpperCase() + ' ' : ''}Pattern: ${pattern.description}
        
📋 Detected Indicators: ${matchedIndicators.join(", ")}
        
🧠 Psychological Mechanism: ${pattern.psychological_mechanism}
        
${pattern.counter_detection ? `🛡️ Counter-Detection: ${pattern.counter_detection}
        
` : ''}⚠️ Impact: This ${pattern.category} manipulation technique may bypass critical thinking by ${pattern.psychological_mechanism.toLowerCase()}, potentially misleading audiences about the actual strength of evidence or reasoning.`,
        confidence: finalConfidence,
        tags: ["expert-taxonomy", pattern.category, pattern.sophistication_level || "standard", pattern.id],
        priority
      });
    }
  });
  
  return frames;
};

export default detectComprehensiveManipulation;
export { detectComprehensiveManipulation };