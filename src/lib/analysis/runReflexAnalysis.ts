// src/lib/analysis/runReflexAnalysis.ts
import { VXFrame } from '@/types/VXTypes';
import { detectEmotionalManipulation } from '@/lib/vx/vx-em08';
import { detectSpeculativeOverreach } from '@/lib/vx/vx-so01';
import { detectHallucination } from '@/lib/vx/vx-ha01';
import { detectOmission } from '@/lib/vx/vx-os01';
import { detectPerceivedConsensus } from '@/lib/vx/vx-pc01';
import { detectFalsePrecision } from '@/lib/vx/vx-fp01';
import { detectEthicalDrift } from '@/lib/vx/vx-ed01';
import { detectToneEscalation } from '@/lib/vx/vx-tu01';
import { detectJargonOverload } from '@/lib/vx/vx-ju01';
import { detectConfidenceIllusion } from '@/lib/vx/vx-co01';
import { detectDataLessClaims } from '@/lib/vx/vx-da01';
import { detectRhetoricalEntrapment } from '@/lib/vx/vx-em09';
import { detectFalseUrgency } from '@/lib/vx/vx-fo01';
import { detectNarrativeOversimplification } from '@/lib/vx/vx-ns01';
import { detectRhetoricalInterruption } from '@/lib/vx/vx-ri01';
import { detectVagueness } from '@/lib/vx/vx-vg01';
import { detectSemanticPatterns } from '@/lib/vx/vx-semantic-core';
import { detectEnhancedSemanticPatterns } from '@/lib/vx/vx-enhanced-semantic';
import { detectComprehensiveManipulation } from '@/lib/vx/vx-mp01';
import { detectPseudoInquiry } from '@/lib/vx/vx-inquiry-protection';
import { detectNarrativeFraming } from '@/lib/vx/vx-nf01'; // ✅ keep single import
import { adaptiveLearning } from '@/lib/adaptive/AdaptiveLearningEngine';

/**
 * Main reflex analysis runner
 * Dispatches text through detectors and aggregates results
 */
const runReflexAnalysis = async (input: string): Promise<VXFrame[]> => {
  if (!input || input.trim().length < 3) {
    console.log('🔍 Analysis skipped: input too short');
    return [];
  }

  const timestamp = new Date().toLocaleTimeString();
  console.log(`🔍 [${timestamp}] Starting comprehensive analysis for input:`, input.substring(0, 50) + '...');
  const frames: VXFrame[] = [];

  try {
    const [
      confidenceFrames,        // VX-CO01
      dataLessFrames,          // VX-DA01
      ethicalFrames,           // VX-ED01
      emotionalFrames,         // VX-EM08
      entrapmentFrames,        // VX-EM09
      urgencyFrames,           // VX-FO01
      precisionFrames,         // VX-FP01
      hallucinationFrames,     // VX-HA01
      jargonFrames,            // VX-JU01
      oversimplificationFrames,// VX-NS01
      omissionFrames,          // VX-OS01
      consensusFrames,         // VX-PC01
      interruptionFrames,      // VX-RI01
      speculativeFrames,       // VX-SO01
      toneFrames,              // VX-TU01
      vaguenessFrames,         // VX-VG01
      aiContentFrames,         // VX-AI01
      narrativeFrames          // VX-NF01
    ] = await Promise.all([
      Promise.resolve(detectConfidenceIllusion(input)),
      Promise.resolve(detectDataLessClaims(input)),
      Promise.resolve(detectEthicalDrift(input)),
      Promise.resolve(detectEmotionalManipulation(input)),
      Promise.resolve(detectRhetoricalEntrapment(input)),
      Promise.resolve(detectFalseUrgency(input)),
      Promise.resolve(detectFalsePrecision(input)),
      Promise.resolve(detectHallucination(input)),
      Promise.resolve(detectJargonOverload(input)),
      Promise.resolve(detectNarrativeOversimplification(input)),
      Promise.resolve(detectOmission(input)),
      Promise.resolve(detectPerceivedConsensus(input)),
      Promise.resolve(detectRhetoricalInterruption(input)),
      Promise.resolve(detectSpeculativeOverreach(input)),
      Promise.resolve(detectToneEscalation(input)),
      Promise.resolve(detectVagueness(input)),
      Promise.resolve([]), // detectAIGeneratedContent: provide empty if not implemented
      Promise.resolve(detectNarrativeFraming(input))
    ]);
    
    const semanticFrames = detectSemanticPatterns(input);
    const enhancedSemanticFrames = detectEnhancedSemanticPatterns(input);
    const comprehensiveFrames = detectComprehensiveManipulation(input);
    const pseudoInquiryFrames = detectPseudoInquiry(input);

    console.log(`🔍 [${timestamp}] Complete VX detection results:`, {
      confidence: confidenceFrames.length,
      dataLess: dataLessFrames.length,
      ethical: ethicalFrames.length,
      emotional: emotionalFrames.length,
      entrapment: entrapmentFrames.length,
      urgency: urgencyFrames.length,
      precision: precisionFrames.length,
      hallucination: hallucinationFrames.length,
      jargon: jargonFrames.length,
      oversimplification: oversimplificationFrames.length,
      omission: omissionFrames.length,
      consensus: consensusFrames.length,
      interruption: interruptionFrames.length,
      speculative: speculativeFrames.length,
      tone: toneFrames.length,
      vagueness: vaguenessFrames.length,
      aiContent: aiContentFrames.length,
      narrative: narrativeFrames.length,
      semantic: semanticFrames.length,
      enhancedSemantic: enhancedSemanticFrames.length,
      comprehensive: comprehensiveFrames.length,
      pseudoInquiry: pseudoInquiryFrames.length
    });

    frames.push(
      ...confidenceFrames,
      ...dataLessFrames,
      ...ethicalFrames,
      ...emotionalFrames,
      ...entrapmentFrames,
      ...urgencyFrames,
      ...precisionFrames,
      ...hallucinationFrames,
      ...jargonFrames,
      ...oversimplificationFrames,
      ...omissionFrames,
      ...consensusFrames,
      ...interruptionFrames,
      ...speculativeFrames,
      ...toneFrames,
      ...vaguenessFrames,
      ...aiContentFrames,
      ...narrativeFrames,
      ...semanticFrames,
      ...enhancedSemanticFrames,
      ...comprehensiveFrames,
      ...pseudoInquiryFrames
    );

    // Sort by confidence (highest first)
    frames.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));

    // Adaptive learning tweaks
    frames.forEach(frame => {
      const adjustment = adaptiveLearning.getPatternAdjustment(frame.reflexId);
      if (adjustment !== 0) {
        frame.confidence = Math.max(0.05, Math.min(0.95, (frame.confidence ?? 0) + adjustment));
      }
    });

    const clusteredFrames = detectReflexClusters(frames, input);
    console.log(`🔍 [${timestamp}] Complete VX analysis finished, returning ${clusteredFrames.length} frames`);
    return clusteredFrames;

  } catch (error) {
    console.error(`🚨 [${timestamp}] Comprehensive reflex analysis error:`, error);
    return [];
  }
};

/** Cluster detection (co-firing reflexes) */
function detectReflexClusters(frames: VXFrame[], originalInput: string): VXFrame[] {
  const hasLegitimateScientificLanguage =
    /requires further study|needs investigation|warrants research|seems plausible|appears to suggest/i.test(originalInput);

  const highConfidenceFrames = frames.filter(f => (f.confidence ?? 0) >= 0.75);
  const mediumConfidenceFrames = frames.filter(f => (f.confidence ?? 0) >= 0.55);
  const totalFrames = frames.length;

  const clusterThreshold = hasLegitimateScientificLanguage
    ? { high: 3, medium: 4, volume: 5 }
    : { high: 2, medium: 3, volume: 4 };

  const hasHighCluster = highConfidenceFrames.length >= clusterThreshold.high;
  const hasMediumCluster = mediumConfidenceFrames.length >= clusterThreshold.medium;
  const hasVolumeCluster = totalFrames >= clusterThreshold.volume;

  if (hasHighCluster || hasMediumCluster || hasVolumeCluster) {
    const clusterType = hasHighCluster ? 'HIGH-CONFIDENCE' : hasMediumCluster ? 'MEDIUM-CONFIDENCE' : 'VOLUME';
    const clusterCount = hasHighCluster ? highConfidenceFrames.length : hasMediumCluster ? mediumConfidenceFrames.length : totalFrames;

    frames.forEach(frame => {
      if ((frame.confidence ?? 0) >= 0.55) {
        frame.tags = [...(frame.tags || []), 'cluster-alert'];
        frame.priority = Math.max(frame.priority || 1, 3);
      }
    });

    frames.unshift({
      reflexId: 'cluster-alert',
      reflexLabel: `⚠️ ${clusterType} Manipulation Cluster Detected`,
      rationale:
        `🔥 ${clusterType} CLUSTER ALERT: ${clusterCount} reflexes triggered on "${originalInput.substring(0, 50)}..."`,
      confidence: Math.max(...frames.map(f => f.confidence ?? 0)),
      tags: ['cluster', 'alert', clusterType.toLowerCase()],
      priority: 4
    });
  }

  return frames;
}

export default runReflexAnalysis;
