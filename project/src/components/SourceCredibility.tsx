import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, BookOpen, Shield, ExternalLink, Clock, Database } from 'lucide-react';
import { SourceCredibilityService, SourceAnalysis } from '../services/sourceCredibility';

interface SourceCredibilityProps {
  url: string;
}

const SourceCredibility: React.FC<SourceCredibilityProps> = ({ url }) => {
  const [result, setResult] = useState<SourceAnalysis & { educationalPrompt: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyze = async () => {
      if (!url || !url.includes('http')) {
        setResult(null);
        return;
      }

      setLoading(true);
      try {
        const analysis = await SourceCredibilityService.analyzeSource(url);
        setResult({
          ...analysis,
          educationalPrompt: SourceCredibilityService.getEducationalPrompt(analysis.credibilityScore, analysis.bias),
        });
      } catch (error) {
        setResult({
          credibilityScore: 30,
          bias: 'unknown',
          factualRating: 'unknown',
          issues: ['Analysis failed', 'Manual verification required'],
          educationalPrompt: 'Unable to analyze this source. Apply extra skepticism and verify claims independently.',
        });
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [url]);

  if (!url || !url.includes('http')) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
        <h4 className="font-semibold text-gray-600 mb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Source Analysis
        </h4>
        <p className="text-sm text-gray-500">Enter a URL to analyze source credibility</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-sky-100 p-6 rounded-xl border-l-4 border-blue-500">
        <h4 className="font-semibold text-sky-700 mb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2 animate-spin" />
          Source Analysis
        </h4>
        <div className="text-sm text-sky-600">Analyzing source credibility...</div>
      </div>
    );
  }

  if (!result) return null;

  const { credibilityScore, bias, factualRating, issues, educationalPrompt, cached } = result;
  const scoreColor = SourceCredibilityService.getCredibilityColor(credibilityScore);
  const biasColor = SourceCredibilityService.getBiasColor(bias);
  const domain = new URL(url).hostname.replace('www.', '');

  // Consistent color scheme for credibility score
  const getCredibilityIndicatorColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-300';
    if (score >= 50) return 'bg-amber-200';
    return 'bg-rose-300';
  };

  const getFactualRatingColor = (rating: string) => {
    if (rating.includes('very high') || rating.includes('high')) return 'text-emerald-700';
    if (rating.includes('mostly') || rating.includes('mixed')) return 'text-amber-700';
    return 'text-rose-700';
  };

  const getBiasIndicatorColor = () => {
    return 'bg-sky-300'; // Consistent blue for all bias types
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
      <h4 className="font-semibold text-blue-700 mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        Source Credibility Analysis
        {cached && (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
            <Database className="w-3 h-3 mr-1" />
            Cached
          </span>
        )}
      </h4>
      
      <div className="space-y-4">
        {/* Domain and Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">{domain}</span>
          </div>
          <div className="text-right flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${getCredibilityIndicatorColor(credibilityScore)}`}></span>
            <div>
              <div className={`text-2xl font-bold ${scoreColor}`}>{credibilityScore}%</div>
              <div className="text-xs text-gray-500">Credibility Score</div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-600 flex items-center">
              <span className={`w-2 h-2 rounded-full ${getBiasIndicatorColor()} mr-2`}></span>
              Political Bias
            </div>
            <div className={`font-semibold capitalize ${biasColor}`}>
              {bias.replace('-', ' ')}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-600">Factual Rating</div>
            <div className={`font-semibold capitalize ${getFactualRatingColor(factualRating)}`}>
              {factualRating.replace('-', ' ')}
            </div>
          </div>
        </div>

        {/* Cache Status */}
        {cached && (
          <div className="bg-emerald-100 p-3 rounded-lg border border-emerald-200">
            <div className="font-semibold text-emerald-700 flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Analysis Retrieved from Cache
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              This analysis was cached to improve performance. Cache expires in 10 minutes.
            </p>
          </div>
        )}

        {/* Issues Alert */}
        {issues.length > 0 && (
          <div className="bg-rose-100 p-4 rounded-lg border border-rose-200">
            <div className="font-semibold text-rose-700 flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Credibility Concerns
            </div>
            <ul className="space-y-1">
              {issues.map((issue, i) => (
                <li key={i} className="text-sm text-rose-600 flex items-start">
                  <span className="w-1.5 h-1.5 bg-rose-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Educational Prompt */}
        <div className="bg-sky-100 p-4 rounded-lg border border-sky-200">
          <div className="font-semibold text-sky-700 flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Critical Thinking Prompt
          </div>
          <p className="text-sm text-sky-700 leading-relaxed">{educationalPrompt}</p>
        </div>

        {/* Quick Tips */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>💡 <strong>Pro tip:</strong> Always cross-reference important claims with multiple sources</div>
          <div>🔍 <strong>Look for:</strong> Primary sources, data citations, and author credentials</div>
          {cached && (
            <div>⚡ <strong>Performance:</strong> Cached results improve response time and reduce API calls</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceCredibility;