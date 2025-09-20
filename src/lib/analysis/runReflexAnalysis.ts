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
import { detectAIGeneratedContent } from '@/lib/vx/vx-ai01';
import { detectNarrativeFraming } from '@/lib/vx/vx-nf01';
import { adaptiveLearning } from '@/lib/adaptive/AdaptiveLearningEngine';

/**
 * Main reflex analysis runner
 * Dispatches text through all VX detectors and aggregates results
 */
export const runReflexAnalysis = async (input: string): Promise<VXFrame[]> => {
  if (!input || input.trim().length < 3) {
    console.log('🔍 Analysis skipped: input too short');
    return [];
  }

  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `🔍 [${timestamp}] Starting comprehensive analysis for input:`,
    input.substring(0, 50) + '...'
  );

  const frames: VXFrame[] = [];

  try {
    // Run detectors in parallel
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
      Promise.resolve(detectAIGeneratedContent(input)),
      Promise.resolve(detectNarrativeFraming(input))
    ]);

    // Extra semantic passes (sync)
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

    // Flatten
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

    // Sort by confidence
    frames.sort((a, b) => b.confidence - a.confidence);

    // Adaptive learning tweaks
    frames.forEach((frame) => {
      const adjustment = adaptiveLearning.getPatternAdjustment(frame.reflexId);
      if (adjustment !== 0) {
        const originalConfidence = frame.confidence;
        frame.confidence = Math.max(0.05, Math.min(0.95, frame.confidence + adjustment));
        console.log(
          `🧠 Applied learned adjustment to ${frame.reflexId}: ${originalConfidence} → ${frame.confidence} (${adjustment >= 0 ? '+' : ''}${adjustment.toFixed(3)})`
        );
      }
    });

    console.log(`🔍 [${timestamp}] Final comprehensive analysis results:`, frames.length, 'frames detected');
    frames.forEach((frame) => console.log(`  - ${frame.reflexLabel ?? frame.reflexId}: ${frame.confidence}`));

    // Co-fire clustering
    const clusteredFrames = detectReflexClusters(frames, input);

    console.log(`🔍 [${timestamp}] Complete VX analysis finished, returning ${clusteredFrames.length} frames`);
    return clusteredFrames;
  } catch (error) {
    console.error(`🚨 [${timestamp}] Comprehensive reflex analysis error:`, error);
    return [];
  }
};

/**
 * Detects when multiple high-priority reflexes co-fire
 * Adds cluster metadata for UI alerts
 */
function detectReflexClusters(frames: VXFrame[], originalInput: string): VXFrame[] {
  const hasLegitimateScientificLanguage = /requires further study|needs investigation|warrants research|seems plausible|appears to suggest/i.test(
    originalInput
  );

  const highConfidenceFrames = frames.filter((f) => f.confidence >= 0.75);
  const mediumConfidenceFrames = frames.filter((f) => f.confidence >= 0.55);
  const totalFrames = frames.length;

  const clusterThreshold = hasLegitimateScientificLanguage
    ? { high: 3, medium: 4, volume: 5 }
    : { high: 2, medium: 3, volume: 4 };

  const hasHighCluster = highConfidenceFrames.length >= clusterThreshold.high;
  const hasMediumCluster = mediumConfidenceFrames.length >= clusterThreshold.medium;
  const hasVolumeCluster = totalFrames >= clusterThreshold.volume;

  if (hasHighCluster || hasMediumCluster || hasVolumeCluster) {
    const clusterType = hasHighCluster ? 'HIGH-CONFIDENCE' : hasMediumCluster ? 'MEDIUM-CONFIDENCE' : 'VOLUME';
    const clusterCount = hasHighCluster
      ? highConfidenceFrames.length
      : hasMediumCluster
      ? mediumConfidenceFrames.length
      : totalFrames;

    console.log(`🔥 ${clusterType} Cluster detected: ${clusterCount} reflexes`);

    frames.forEach((frame) => {
      if (frame.confidence >= 0.55) {
        frame.tags = [...(frame.tags || []), 'cluster-alert'];
        frame.priority = Math.max(frame.priority || 1, 3);
      }
    });

    const clusterSummary: VXFrame = {
      reflexId: 'cluster-alert',
      // many places use reflexLabel for display; fall back to reflexId
      reflexLabel: `⚠️ ${clusterType} Manipulation Cluster Detected`,
      rationale: `🔥 ${clusterType} CLUSTER ALERT: ${clusterCount} reflexes triggered on "${originalInput.substring(0, 50)}..." 
      
📋 Analysis: ${getClusterAnalysis(clusterType, clusterCount)}

⚠️ Impact: ${getClusterImpact(clusterType)}`,
      confidence: Math.max(...frames.map((f) => f.confidence)),
      tags: ['cluster', 'alert', clusterType.toLowerCase()],
      priority: 4
    } as VXFrame;

    frames.unshift(clusterSummary);
  }

  return frames;
}

function getClusterAnalysis(type: string, count: number): string {
  switch (type) {
    case 'HIGH-CONFIDENCE':
      return `${count} high-confidence manipulation patterns detected simultaneously suggests sophisticated rhetorical tactics designed to bypass critical thinking through multiple pressure points.`;
    case 'MEDIUM-CONFIDENCE':
      return `${count} medium-confidence patterns indicate layered persuasion techniques that may be subtle but collectively manipulative.`;
    case 'VOLUME':
      return `${count} total reflexes triggered indicates complex content with multiple potential manipulation vectors requiring careful analysis.`;
    default:
      return 'Multiple manipulation patterns detected in single statement.';
  }
}

function getClusterImpact(type: string): string {
  switch (type) {
    case 'HIGH-CONFIDENCE':
      return 'High-confidence clusters often indicate coordinated manipulation designed to overwhelm rational analysis.';
    case 'MEDIUM-CONFIDENCE':
      return 'Medium-confidence clusters suggest subtle but systematic manipulation that may be more dangerous due to its subtlety.';
    case 'VOLUME':
      return 'Volume clusters indicate complex content requiring careful evaluation of each manipulation vector.';
    default:
      return 'Multiple reflexes co-firing warrants increased scrutiny.';
  }
}

export default runReflexAnalysis;
