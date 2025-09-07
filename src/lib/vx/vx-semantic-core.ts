// src/lib/vx/vx-semantic-core.ts
// Semantic pattern detection engine

import { VXFrame } from "@/types/VXTypes";
import { adjustConfidenceForLegitimateInquiry } from './vx-inquiry-protection';

export interface SemanticPattern {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  contextClues: string[];
  confidence: number;
}

// Semantic patterns for manipulation detection
export const SEMANTIC_PATTERNS: SemanticPattern[] = [
  {
    id: "false-limitation",
    name: "False Limitation",
    description: "Artificially restricts the scope or application of something",
    indicators: ["only good for", "just for", "merely", "nothing but", "simply"],
    contextClues: ["medical", "treatment", "use", "purpose", "application"],
    confidence: 0.8
  },
  {
    id: "dismissive-framing", 
    name: "Dismissive Framing",
    description: "Reduces complex topics to oversimplified categories",
    indicators: ["horse medicine", "conspiracy theory", "debunked", "pseudoscience"],
    contextClues: ["medical", "scientific", "research", "study"],
    confidence: 0.85
  },
  {
    id: "absolute-quantifiers",
    name: "Absolute Quantifiers", 
    description: "Uses absolute terms that eliminate exceptions",
    indicators: ["all", "every", "never", "always", "completely", "totally", "entirely"],
    contextClues: ["people", "cases", "time", "situation", "instance"],
    confidence: 0.75
  },
  {
    id: "vague-authority",
    name: "Vague Authority",
    description: "Appeals to unnamed or unspecified authorities",
    indicators: ["experts say", "scientists claim", "doctors agree", "studies show", "research proves"],
    contextClues: ["agree", "say", "claim", "believe", "conclude", "find"],
    confidence: 0.9
  },
  {
    id: "implied-consensus",
    name: "Implied Consensus",
    description: "Suggests widespread agreement without evidence",
    indicators: ["everyone knows", "it's obvious", "clearly", "obviously", "common knowledge"],
    contextClues: ["that", "this", "the fact", "the truth"],
    confidence: 0.85
  }
];

export function detectSemanticPatterns(text: string): VXFrame[] {
  const frames: VXFrame[] = [];
  const lowered = text.toLowerCase();
  
  // Enhanced hedging detection - reduce false positives on legitimate uncertainty
  const hasLegitimateHedging = /seems|appears|suggests|may|might|could|requires further study|needs investigation/i.test(text);
  const hasScientificProcess = /study|research|investigate|examine|analyze/i.test(text);
  
  SEMANTIC_PATTERNS.forEach(pattern => {
    const hasIndicator = pattern.indicators.some(indicator => 
      lowered.includes(indicator.toLowerCase())
    );
    
    if (hasIndicator) {
      // Check for context clues to increase confidence
      const hasContext = pattern.contextClues.some(clue => 
        lowered.includes(clue.toLowerCase())
      );
      
      let finalConfidence = pattern.confidence;
      
      // Increase confidence for context
      if (hasContext) {
        finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
      }
      
      // REDUCE confidence for legitimate scientific discourse
      if (hasLegitimateHedging && hasScientificProcess && pattern.id === "vague-authority") {
        finalConfidence = Math.max(finalConfidence - 0.5, 0.2);
      }
      
      // ADDITIONAL: Reduce confidence for methodology language without authority claims
      const hasMethodologyLanguage = /could be carried out|should be conducted|requires further study|needs investigation/i.test(text);
      if (hasMethodologyLanguage && pattern.id === "vague-authority") {
        finalConfidence = Math.max(finalConfidence - 0.4, 0.1);
      }
      
      // REDUCE confidence for reasonable uncertainty expressions
      if (hasLegitimateHedging && pattern.id === "absolute-quantifiers") {
        finalConfidence = Math.max(finalConfidence - 0.2, 0.5);
      }
      
      // APPLY INQUIRY PROTECTION FRAMEWORK
      finalConfidence = adjustConfidenceForLegitimateInquiry(finalConfidence, text, pattern.id);
      
      frames.push({
        reflexId: `vx-semantic-${pattern.id}`,
        reflexLabel: pattern.name,
        rationale: `🎯 Semantic Pattern: ${pattern.description}
        
📋 Analysis: Detected manipulation pattern that ${pattern.description.toLowerCase()}. This technique is often used to bypass critical thinking by ${getManipulationTactic(pattern.id)}.
        
⚠️ Impact: This pattern may mislead audiences by oversimplifying complex issues or appealing to false authorities rather than providing evidence-based reasoning.`,
        confidence: finalConfidence,
        tags: ["semantic-pattern", pattern.id, "manipulation"],
        priority: finalConfidence >= 0.8 ? 3 : 2
      });
    }
  });
  
  return frames;
}

function getManipulationTactic(patternId: string): string {
  const tactics = {
    "false-limitation": "artificially constraining the scope of discussion",
    "dismissive-framing": "reducing complex topics to simple categories", 
    "absolute-quantifiers": "eliminating exceptions and nuance",
    "vague-authority": "appealing to unnamed experts",
    "implied-consensus": "assuming widespread agreement"
  };
  
  return tactics[patternId] || "manipulating perception";
}