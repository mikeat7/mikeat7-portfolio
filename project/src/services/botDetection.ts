import axios from 'axios';

// Mock X API for post analysis (replace with real X API key/endpoint)
const MOCK_X_API = 'https://api.mockxplatform.com/analyze_post';

export interface BotAnalysis {
  botScore: number;
  flags: string[];
  confidence: string;
  educationalPrompt: string;
}

// Bot Detection Service with Enhanced Error Handling
export class BotDetectionService {
  static async analyzeContent(content: string, sourceUrl?: string): Promise<BotAnalysis> {
    try {
      // Input validation
      if (!content || typeof content !== 'string') {
        console.warn('BotDetectionService: Invalid content input', { content: typeof content });
        return this.getErrorFallback('Invalid content provided');
      }

      // Heuristic rules for bot detection
      const flags: string[] = [];
      let botScore = 0;

      try {
        // Rule 1: Repetitive phrasing (e.g., unnatural repetition)
        const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 2);
        const wordCount = words.length;
        const uniqueWords = new Set(words).size;
        
        if (wordCount > 10 && uniqueWords / wordCount < 0.4) {
          flags.push('Repetitive phrasing detected');
          botScore += 30;
        }
      } catch (error) {
        console.error('BotDetectionError: Word analysis failed', { error: error.message, content: content.substring(0, 100) });
        flags.push('Word analysis incomplete');
      }

      try {
        // Rule 2: Excessive punctuation/emojis
        const punctuationCount = (content.match(/[.!?]{2,}|\p{Emoji}{3,}/gu) || []).length;
        if (punctuationCount > 3) {
          flags.push('Excessive punctuation or emojis');
          botScore += 20;
        }
      } catch (error) {
        console.error('BotDetectionError: Punctuation analysis failed', { error: error.message });
        flags.push('Punctuation analysis incomplete');
      }

      try {
        // Rule 3: Generic/template language patterns
        const genericPhrases = [
          'click here', 'amazing opportunity', 'limited time', 'act now',
          'don\'t miss out', 'exclusive offer', 'guaranteed results'
        ];
        const genericMatches = genericPhrases.filter(phrase => 
          content.toLowerCase().includes(phrase)
        ).length;
        
        if (genericMatches > 2) {
          flags.push('Generic marketing language detected');
          botScore += 25;
        }
      } catch (error) {
        console.error('BotDetectionError: Generic phrase analysis failed', { error: error.message });
        flags.push('Template language analysis incomplete');
      }

      try {
        // Rule 4: Unnatural capitalization patterns
        const capsWords = content.match(/\b[A-Z]{2,}\b/g) || [];
        if (capsWords.length > 5) {
          flags.push('Excessive capitalization');
          botScore += 15;
        }
      } catch (error) {
        console.error('BotDetectionError: Capitalization analysis failed', { error: error.message });
        flags.push('Capitalization analysis incomplete');
      }

      // Rule 5: Source analysis (if URL provided)
      if (sourceUrl) {
        try {
          const domain = new URL(sourceUrl).hostname;
          
          // Mock X account check (replace with real API)
          try {
            const response = await axios.get(MOCK_X_API, { 
              params: { url: sourceUrl },
              timeout: 3000 
            });
            const { accountAgeDays, postFrequency, profileCompleteness } = response.data || {};

            if (accountAgeDays && accountAgeDays < 30) {
              flags.push('New account (<30 days)');
              botScore += 25;
            }
            if (postFrequency && postFrequency > 50) {
              flags.push('High posting frequency (>50 posts/day)');
              botScore += 20;
            }
            if (profileCompleteness && profileCompleteness < 0.5) {
              flags.push('Incomplete profile');
              botScore += 15;
            }
          } catch (apiError) {
            console.warn('BotDetectionWarning: API call failed, using fallback analysis', { 
              error: apiError.message, 
              sourceUrl,
              timeout: apiError.code === 'ECONNABORTED' 
            });
            
            // API call failed, use domain-based heuristics
            const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'short.link'];
            if (suspiciousDomains.some(d => domain.includes(d))) {
              flags.push('Suspicious shortened URL');
              botScore += 10;
            }
          }
        } catch (urlError) {
          console.error('BotDetectionError: URL parsing failed', { 
            error: urlError.message, 
            sourceUrl 
          });
          flags.push('Invalid or suspicious URL format');
          botScore += 10;
        }
      }

      try {
        // Rule 6: Content length analysis
        if (content.length < 20) {
          flags.push('Suspiciously short content');
          botScore += 15;
        } else if (content.length > 2000) {
          const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 2);
          const uniqueWords = new Set(words).size;
          if (uniqueWords / words.length < 0.3) {
            flags.push('Long content with low vocabulary diversity');
            botScore += 20;
          }
        }
      } catch (error) {
        console.error('BotDetectionError: Content length analysis failed', { error: error.message });
        flags.push('Length analysis incomplete');
      }

      // Cap score at 100
      botScore = Math.min(botScore, 100);

      // Confidence level
      const confidence = botScore > 75 ? 'High' : botScore > 50 ? 'Moderate' : 'Low';

      // Educational prompt aligned with critical thinking principles
      const educationalPrompt = this.getEducationalPrompt(botScore, flags);

      console.log('BotDetectionSuccess: Analysis completed', { 
        botScore, 
        flagCount: flags.length, 
        confidence,
        contentLength: content.length,
        hasSourceUrl: !!sourceUrl 
      });

      return { botScore, flags, confidence, educationalPrompt };

    } catch (error) {
      console.error(`BotDetectionError: ${error.message}`, { 
        content: content?.substring(0, 100) + '...', 
        sourceUrl,
        errorType: error.constructor.name,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });
      
      return this.getErrorFallback('Analysis failed due to unexpected error');
    }
  }

  private static getErrorFallback(reason: string): BotAnalysis {
    return {
      botScore: 30,
      flags: [`Analysis error: ${reason}`, 'Manual verification recommended'],
      confidence: 'Low',
      educationalPrompt: 'Unable to analyze content for bot patterns. Apply extra scrutiny and verify claims independently using first-principles reasoning.',
    };
  }

  private static getEducationalPrompt(botScore: number, flags: string[]): string {
    if (botScore > 50) {
      return 'High bot activity suggests automated agendas. From first principles, what\'s the intent behind this content? Question institutional motives and seek raw data.';
    }
    return 'Low bot activity, but don\'t trust blindly. Evolutionary incentives shape narratives—verify with primary evidence.';
  }

  static getBotScoreColor(score: number): string {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  }

  static getConfidenceColor(confidence: string): string {
    const colors: Record<string, string> = {
      'High': 'text-red-600',
      'Moderate': 'text-yellow-600',
      'Low': 'text-green-600',
    };
    return colors[confidence] || 'text-gray-600';
  }
}