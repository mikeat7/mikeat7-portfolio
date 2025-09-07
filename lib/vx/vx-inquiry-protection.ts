// VX-INQUIRY-PROTECTION — Legitimate Scientific Inquiry Protection System
// Distinguishes between genuine intellectual discourse and manipulative pseudo-inquiry

import { VXFrame } from "@/types/VXTypes";

interface InquiryContext {
  hasMethodologyLanguage: boolean;
  hasIntellectualHumility: boolean;
  hasProcessOrientation: boolean;
  hasHiddenAgenda: boolean;
  hasImpliedConspiracy: boolean;
  hasRhetoricalManipulation: boolean;
}

// Patterns that indicate LEGITIMATE scientific inquiry
const LEGITIMATE_INQUIRY_PATTERNS = {
  methodology: [
    "could be carried out",
    "should be conducted", 
    "requires further study",
    "needs investigation",
    "warrants research",
    "randomized controlled trials",
    "longitudinal studies",
    "meta-analysis might",
    "replication studies",
    "peer review should"
  ],
  
  intellectualHumility: [
    "I could be wrong",
    "other explanations are possible",
    "critics raise valid concerns",
    "evidence could support multiple",
    "genuinely uncertain about",
    "deserves skeptical examination",
    "limitations of this approach",
    "acknowledging the complexity"
  ],
  
  processOriented: [
    "study design could",
    "methodology should",
    "research protocol",
    "data collection methods",
    "statistical analysis",
    "experimental controls",
    "sample size considerations",
    "confounding variables"
  ],
  
  uncertaintyMarkers: [
    "seems plausible",
    "appears to suggest",
    "might indicate",
    "could potentially",
    "possibly related",
    "tentative evidence",
    "preliminary findings",
    "inconclusive but interesting"
  ]
};

// Patterns that indicate MANIPULATIVE pseudo-inquiry
const MANIPULATIVE_INQUIRY_PATTERNS = {
  hiddenAgenda: [
    "just asking questions",
    "just wondering why",
    "curious how they",
    "interesting that they",
    "makes you wonder",
    "don't you find it odd",
    "isn't it suspicious",
    "coincidence that"
  ],
  
  impliedConspiracy: [
    "won't study this",
    "refuse to investigate",
    "experts won't consider",
    "scientists dismiss",
    "research always supports",
    "they don't want you to know",
    "mainstream won't cover",
    "suppressed research"
  ],
  
  rhetoricalManipulation: [
    "don't you think it's strange",
    "isn't it interesting how",
    "why do you suppose they",
    "what are the odds that",
    "how convenient that",
    "funny how they always",
    "notice how they never",
    "ever wonder why"
  ],
  
  authorityUndermining: [
    "so-called experts",
    "establishment scientists",
    "mainstream narrative",
    "official story",
    "they want us to believe",
    "convenient for them",
    "serves their interests",
    "follows the money"
  ]
};

export function analyzeInquiryContext(text: string): InquiryContext {
  const lowered = text.toLowerCase();
  
  return {
    hasMethodologyLanguage: LEGITIMATE_INQUIRY_PATTERNS.methodology.some(pattern => 
      lowered.includes(pattern.toLowerCase())
    ),
    hasIntellectualHumility: LEGITIMATE_INQUIRY_PATTERNS.intellectualHumility.some(pattern => 
      lowered.includes(pattern.toLowerCase())
    ),
    hasProcessOrientation: LEGITIMATE_INQUIRY_PATTERNS.processOriented.some(pattern => 
      lowered.includes(pattern.toLowerCase())
    ),
    hasHiddenAgenda: MANIPULATIVE_INQUIRY_PATTERNS.hiddenAgenda.some(pattern => 
      lowered.includes(pattern.toLowerCase())
    ),
    hasImpliedConspiracy: MANIPULATIVE_INQUIRY_PATTERNS.impliedConspiracy.some(pattern => 
      lowered.includes(pattern.toLowerCase())
    ),
    hasRhetoricalManipulation: MANIPULATIVE_INQUIRY_PATTERNS.rhetoricalManipulation.some(pattern => 
      lowered.includes(pattern.toLowerCase())
    )
  };
}

export function adjustConfidenceForLegitimateInquiry(
  baseConfidence: number, 
  text: string,
  detectionType: string
): number {
  const context = analyzeInquiryContext(text);
  let adjustment = 0;
  
  // PROTECT legitimate scientific discourse
  if (context.hasMethodologyLanguage) {
    adjustment -= 0.4;
    console.log(`🛡️ Methodology language detected, reducing confidence by 0.4`);
  }
  
  if (context.hasIntellectualHumility) {
    adjustment -= 0.3;
    console.log(`🛡️ Intellectual humility detected, reducing confidence by 0.3`);
  }
  
  if (context.hasProcessOrientation) {
    adjustment -= 0.2;
    console.log(`🛡️ Process orientation detected, reducing confidence by 0.2`);
  }
  
  // BOOST detection of manipulative pseudo-inquiry
  if (context.hasHiddenAgenda) {
    adjustment += 0.3;
    console.log(`🚨 Hidden agenda detected, increasing confidence by 0.3`);
  }
  
  if (context.hasImpliedConspiracy) {
    adjustment += 0.4;
    console.log(`🚨 Implied conspiracy detected, increasing confidence by 0.4`);
  }
  
  if (context.hasRhetoricalManipulation) {
    adjustment += 0.2;
    console.log(`🚨 Rhetorical manipulation detected, increasing confidence by 0.2`);
  }
  
  // Special protection for authority detection on legitimate methodology
  if (detectionType === 'vague-authority' && 
      (context.hasMethodologyLanguage || context.hasProcessOrientation)) {
    adjustment -= 0.5; // Extra protection
    console.log(`🛡️ Extra protection for methodology language in authority detection`);
  }
  
  const finalConfidence = Math.max(0.05, Math.min(0.95, baseConfidence + adjustment));
  
  console.log(`🎯 Confidence adjustment: ${baseConfidence} → ${finalConfidence} (${adjustment >= 0 ? '+' : ''}${adjustment})`);
  
  return finalConfidence;
}

export function detectPseudoInquiry(text: string): VXFrame[] {
  const frames: VXFrame[] = [];
  const context = analyzeInquiryContext(text);
  
  // Only flag if we have manipulative patterns WITHOUT legitimate inquiry markers
  const hasManipulation = context.hasHiddenAgenda || context.hasImpliedConspiracy || context.hasRhetoricalManipulation;
  const hasLegitimateMarkers = context.hasMethodologyLanguage || context.hasIntellectualHumility;
  
  if (hasManipulation && !hasLegitimateMarkers) {
    let manipulationType = '';
    let confidence = 0.7;
    
    if (context.hasImpliedConspiracy) {
      manipulationType = 'Conspiracy Implication';
      confidence = 0.85;
    } else if (context.hasHiddenAgenda) {
      manipulationType = 'JAQing Off (Just Asking Questions)';
      confidence = 0.8;
    } else if (context.hasRhetoricalManipulation) {
      manipulationType = 'Rhetorical Question Manipulation';
      confidence = 0.75;
    }
    
    frames.push({
      reflexId: 'vx-inquiry-pseudo',
      reflexLabel: `Pseudo-Inquiry Detected: ${manipulationType}`,
      rationale: `🎯 Pattern: Uses inquiry language to advance agenda without genuine uncertainty
      
📋 Analysis: This appears to be pseudo-inquiry that uses question formats or uncertainty language to make claims while avoiding direct responsibility for those claims. This technique maintains plausible deniability while guiding audiences toward predetermined conclusions.
      
⚠️ Impact: This pseudo-inquiry manipulation may bypass critical thinking by appearing to ask genuine questions while actually making implicit claims, potentially misleading audiences about the speaker's true agenda.`,
      confidence,
      tags: ['pseudo-inquiry', 'manipulation', manipulationType.toLowerCase().replace(/\s+/g, '-')],
      priority: 3
    });
  }
  
  return frames;
}

export default {
  analyzeInquiryContext,
  adjustConfidenceForLegitimateInquiry,
  detectPseudoInquiry
};