import axios from 'axios';

// Browser-compatible in-memory cache implementation
class InMemoryCache {
  private cache = new Map<string, { value: any; expiry: number }>();
  private stats = { hits: 0, misses: 0 };
  private ttl: number;

  constructor(options: { stdTTL: number }) {
    this.ttl = options.stdTTL * 1000; // Convert seconds to milliseconds
  }

  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) {
      this.stats.misses++;
      return undefined;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }

    this.stats.hits++;
    return item.value;
  }

  set(key: string, value: any): boolean {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
    return true;
  }

  del(key: string): number {
    return this.cache.delete(key) ? 1 : 0;
  }

  flushAll(): void {
    this.cache.clear();
  }

  keys(): string[] {
    // Clean expired keys first
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
    return Array.from(this.cache.keys());
  }

  getStats() {
    return this.stats;
  }
}

// Initialize cache with 10-minute TTL (600 seconds)
const cache = new InMemoryCache({ stdTTL: 600 });

// Mock Media Bias/Fact-Check API (replace with real API key/endpoint)
const MOCK_BIAS_API = 'https://api.mockmediabiasfactcheck.com/check';
const MOCK_CREDIBILITY_DB: Record<string, { credibility: number; bias: string; factual: string }> = {
  'cbc.ca': { credibility: 85, bias: 'center-left', factual: 'high' },
  'bbc.com': { credibility: 90, bias: 'center', factual: 'very high' },
  'reuters.com': { credibility: 92, bias: 'center', factual: 'very high' },
  'apnews.com': { credibility: 91, bias: 'center', factual: 'very high' },
  'npr.org': { credibility: 87, bias: 'center-left', factual: 'high' },
  'wsj.com': { credibility: 84, bias: 'center-right', factual: 'high' },
  'nytimes.com': { credibility: 82, bias: 'center-left', factual: 'high' },
  'washingtonpost.com': { credibility: 81, bias: 'center-left', factual: 'high' },
  'foxnews.com': { credibility: 58, bias: 'right', factual: 'mixed' },
  'cnn.com': { credibility: 72, bias: 'center-left', factual: 'mostly factual' },
  'breitbart.com': { credibility: 45, bias: 'far-right', factual: 'mixed' },
  'infowars.com': { credibility: 25, bias: 'conspiracy', factual: 'low' },
  'theonion.com': { credibility: 95, bias: 'satire', factual: 'satirical' },
  'example.com': { credibility: 20, bias: 'unknown', factual: 'low' },
};

export interface SourceAnalysis {
  credibilityScore: number;
  bias: string;
  factualRating: string;
  issues: string[];
  cached?: boolean;
  cacheTimestamp?: number;
}

// Source Credibility Service with Caching
export class SourceCredibilityService {
  static async analyzeSource(url: string): Promise<SourceAnalysis> {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const cacheKey = `source_${domain}`;
      
      // Check cache first
      const cached = cache.get<SourceAnalysis>(cacheKey);
      if (cached) {
        return {
          ...cached,
          cached: true,
          cacheTimestamp: Date.now()
        };
      }

      let result: SourceAnalysis;
      
      // Check mock database (replace with API call)
      const dbEntry = MOCK_CREDIBILITY_DB[domain];
      if (dbEntry) {
        result = {
          credibilityScore: dbEntry.credibility,
          bias: dbEntry.bias,
          factualRating: dbEntry.factual,
          issues: dbEntry.credibility < 50 ? ['Low credibility source', 'Verify claims independently'] : 
                  dbEntry.credibility < 70 ? ['Mixed factual reporting', 'Cross-reference with other sources'] : [],
        };
      } else {
        // Fallback: Mock API call (replace with real Media Bias/Fact-Check or similar)
        try {
          const response = await axios.get(MOCK_BIAS_API, { 
            params: { url },
            timeout: 5000 // 5 second timeout
          });
          const { credibility, bias, factual } = response.data;
          result = {
            credibilityScore: credibility || 50,
            bias: bias || 'unknown',
            factualRating: factual || 'unknown',
            issues: credibility < 50 ? ['Potential bias detected', 'Cross-check with primary sources'] : [],
          };
        } catch (apiError) {
          // API failed, return neutral assessment
          result = {
            credibilityScore: 50,
            bias: 'unknown',
            factualRating: 'unknown',
            issues: ['Unable to analyze source', 'Manual verification recommended'],
          };
        }
      }

      // Cache the result
      cache.set(cacheKey, result);
      
      return {
        ...result,
        cached: false,
        cacheTimestamp: Date.now()
      };
      
    } catch (error) {
      const errorResult: SourceAnalysis = {
        credibilityScore: 30,
        bias: 'unknown',
        factualRating: 'unknown',
        issues: ['Invalid URL or unable to analyze source', 'Manual verification recommended'],
      };
      
      return errorResult;
    }
  }

  // Clear cache for a specific domain
  static clearCache(url: string): boolean {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const cacheKey = `source_${domain}`;
      return cache.del(cacheKey) > 0;
    } catch {
      return false;
    }
  }

  // Clear all cache
  static clearAllCache(): void {
    cache.flushAll();
  }

  // Get cache statistics
  static getCacheStats() {
    return {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
      hitRate: cache.getStats().hits / (cache.getStats().hits + cache.getStats().misses) || 0
    };
  }

  // Educational prompt aligned with critical thinking principles
  static getEducationalPrompt(credibilityScore: number, bias: string): string {
    if (credibilityScore < 50) {
      return 'This source shows signs of low credibility. Question institutional narratives and seek primary data. What\'s the evidence behind these claims?';
    }
    if (credibilityScore < 70) {
      return 'This source has mixed reliability. Cross-reference with multiple sources and look for primary evidence. What are the underlying facts?';
    }
    if (bias === 'satire') {
      return 'This is a satirical source. While entertaining, verify any factual claims through legitimate news sources.';
    }
    return 'This source appears credible, but always verify. Use first-principles reasoning: what\'s the raw data driving this story?';
  }

  static getBiasColor(bias: string): string {
    const biasColors: Record<string, string> = {
      'far-left': 'text-red-600',
      'left': 'text-red-500',
      'center-left': 'text-blue-500',
      'center': 'text-green-600',
      'center-right': 'text-blue-600',
      'right': 'text-purple-500',
      'far-right': 'text-purple-600',
      'conspiracy': 'text-red-700',
      'satire': 'text-yellow-600',
      'unknown': 'text-gray-500',
    };
    return biasColors[bias] || 'text-gray-500';
  }

  static getCredibilityColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
}