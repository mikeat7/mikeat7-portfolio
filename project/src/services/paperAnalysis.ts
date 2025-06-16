import { SourceCredibilityService } from './sourceCredibility';
import { BotDetectionService } from './botDetection';

export interface PaperAnalysis {
  fallacies: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    examples: string[];
  }>;
  confidence: {
    category: 'known' | 'speculated' | 'unknown';
    confidence: number;
    reasoning: string;
    flags: string[];
  };
  credibility: {
    credibilityScore: number;
    bias: string;
    factualRating: string;
    issues: string[];
  };
  botScore: number;
  botFlags: string[];
  summary: string;
  recommendations: string[];
}

export class PaperAnalysisService {
  static async analyzePaper(input: string): Promise<PaperAnalysis> {
    try {
      // Determine if input is URL or text
      const isUrl = input.includes('http://') || input.includes('https://');
      let content = input;
      let sourceUrl = '';

      if (isUrl) {
        sourceUrl = input;
        // In a real implementation, you would fetch the content from the URL
        content = `Sample content from ${new URL(input).hostname}`;
      }

      // Run parallel analysis
      const [credibilityResult, botResult] = await Promise.all([
        isUrl ? SourceCredibilityService.analyzeSource(input) : Promise.resolve({
          credibilityScore: 70,
          bias: 'unknown',
          factualRating: 'unknown',
          issues: []
        }),
        BotDetectionService.analyzeContent(content, sourceUrl || undefined)
      ]);

      // Analyze fallacies (simplified version)
      const fallacies = this.analyzeFallacies(content);
      
      // Analyze confidence (simplified version)
      const confidence = this.analyzeConfidence(content);

      // Generate summary and recommendations
      const summary = this.generateSummary(fallacies, confidence, credibilityResult, botResult);
      const recommendations = this.generateRecommendations(fallacies, confidence, credibilityResult, botResult);

      return {
        fallacies,
        confidence,
        credibility: credibilityResult,
        botScore: botResult.botScore,
        botFlags: botResult.flags,
        summary,
        recommendations
      };

    } catch (error) {
      console.error('Paper analysis failed:', error);
      throw new Error('Failed to analyze paper');
    }
  }

  private static analyzeFallacies(content: string) {
    const fallacies = [];
    const lowerContent = content.toLowerCase();

    // Appeal to Fear
    if (lowerContent.includes('crisis') || lowerContent.includes('threat') || lowerContent.includes('danger')) {
      fallacies.push({
        type: 'Appeal to Fear',
        severity: 'high' as const,
        description: 'Uses fear-based language to bypass rational evaluation',
        examples: ['crisis', 'threat', 'danger']
      });
    }

    // False Urgency
    if (lowerContent.includes('act now') || lowerContent.includes('limited time')) {
      fallacies.push({
        type: 'False Urgency',
        severity: 'medium' as const,
        description: 'Creates artificial time pressure',
        examples: ['act now', 'limited time']
      });
    }

    // Add more fallacy detection logic here...

    return fallacies;
  }

  private static analyzeConfidence(content: string) {
    const lowerContent = content.toLowerCase();
    let confidence = 70;
    const flags = [];
    let category: 'known' | 'speculated' | 'unknown' = 'speculated';

    // Certainty indicators
    if (lowerContent.includes('definitely') || lowerContent.includes('certainly')) {
      flags.push('High certainty language detected');
      confidence -= 10;
    }

    // Uncertainty indicators
    if (lowerContent.includes('might') || lowerContent.includes('possibly')) {
      flags.push('Appropriate uncertainty markers');
      confidence += 10;
      category = 'unknown';
    }

    // Source indicators
    if (lowerContent.includes('study') || lowerContent.includes('research')) {
      flags.push('Research references present');
      confidence += 15;
      category = 'known';
    }

    return {
      category,
      confidence: Math.max(0, Math.min(100, confidence)),
      reasoning: `Content appears to be ${category} based on language patterns`,
      flags
    };
  }

  private static generateSummary(fallacies: any[], confidence: any, credibility: any, botResult: any): string {
    const issues = [];
    
    if (fallacies.length > 0) {
      issues.push(`${fallacies.length} rhetorical fallacies detected`);
    }
    
    if (confidence.confidence < 60) {
      issues.push('low confidence indicators');
    }
    
    if (credibility.credibilityScore < 70) {
      issues.push('credibility concerns');
    }
    
    if (botResult.botScore > 50) {
      issues.push('potential automation');
    }

    if (issues.length === 0) {
      return 'Content appears to be well-structured with minimal manipulation indicators.';
    }

    return `Analysis reveals ${issues.join(', ')}. Critical evaluation recommended.`;
  }

  private static generateRecommendations(fallacies: any[], confidence: any, credibility: any, botResult: any): string[] {
    const recommendations = [];

    if (fallacies.length > 0) {
      recommendations.push('Question emotional appeals and verify factual claims independently');
    }

    if (confidence.confidence < 60) {
      recommendations.push('Seek additional sources to verify uncertain claims');
    }

    if (credibility.credibilityScore < 70) {
      recommendations.push('Cross-reference with higher-credibility sources');
    }

    if (botResult.botScore > 50) {
      recommendations.push('Verify authenticity and check for coordinated messaging');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue applying critical thinking principles');
    }

    return recommendations;
  }
}

// Export the main analysis function
export const analyzePaper = (input: string) => PaperAnalysisService.analyzePaper(input);