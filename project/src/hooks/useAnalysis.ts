import { useState } from 'react';

interface AnalysisResult {
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
  category?: 'fallacy' | 'confidence' | 'credibility' | 'bot';
  score?: number;
}

const useAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (data: any[]): Promise<AnalysisResult[]> => {
    setLoading(true);
    setError(null);
    try {
      // Enhanced analysis logic that integrates with the current system
      const results: AnalysisResult[] = [];
      
      data.forEach((item, index) => {
        if (typeof item === 'string') {
          // Text analysis
          const content = item.toLowerCase();
          
          // Fallacy detection
          if (content.includes('crisis') || content.includes('urgent') || content.includes('act now')) {
            results.push({
              title: `Manipulation Pattern ${index + 1}`,
              description: `Detected fear-based or urgency manipulation in: "${item.substring(0, 50)}..."`,
              severity: 'high',
              category: 'fallacy',
              score: 85
            });
          }
          
          // Confidence analysis
          if (content.includes('definitely') || content.includes('absolutely')) {
            results.push({
              title: `Overconfidence Signal ${index + 1}`,
              description: `High certainty language detected: "${item.substring(0, 50)}..."`,
              severity: 'medium',
              category: 'confidence',
              score: 70
            });
          }
          
          // Bot detection
          const exclamationCount = (item.match(/!/g) || []).length;
          if (exclamationCount > 3) {
            results.push({
              title: `Automation Indicator ${index + 1}`,
              description: `Excessive punctuation suggests bot-generated content: ${exclamationCount} exclamation marks`,
              severity: 'medium',
              category: 'bot',
              score: 60
            });
          }
          
        } else if (item && typeof item === 'object') {
          // Object analysis
          results.push({
            title: `Data Analysis ${index + 1}`,
            description: `Processed structured data with ${Object.keys(item).length} properties`,
            severity: 'low',
            category: 'credibility',
            score: 75
          });
        }
      });
      
      // If no specific patterns found, provide general analysis
      if (results.length === 0) {
        results.push({
          title: 'Clean Analysis',
          description: `Analyzed ${data.length} items - no major manipulation patterns detected`,
          severity: 'low',
          category: 'fallacy',
          score: 90
        });
      }
      
      return results;
    } catch (err) {
      setError('Analysis failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error };
};

export default useAnalysis;