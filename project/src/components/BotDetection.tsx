import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bot, BookOpen, Shield } from 'lucide-react';
import { BotDetectionService, BotAnalysis } from '../services/botDetection';

interface BotDetectionProps {
  content: string;
  sourceUrl?: string;
}

const BotDetection: React.FC<BotDetectionProps> = ({ content, sourceUrl }) => {
  const [result, setResult] = useState<BotAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyze = async () => {
      if (!content || content.trim().length < 5) {
        setResult(null);
        return;
      }

      setLoading(true);
      try {
        const analysis = await BotDetectionService.analyzeContent(content, sourceUrl);
        setResult(analysis);
      } catch (error) {
        setResult({
          botScore: 30,
          flags: ['Analysis failed'],
          confidence: 'Low',
          educationalPrompt: 'Unable to analyze content for bot patterns. Apply extra scrutiny and verify claims independently.',
        });
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [content, sourceUrl]);

  if (!content || content.trim().length < 5) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
        <h4 className="font-semibold text-gray-600 mb-2 flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          Bot Detection
        </h4>
        <p className="text-sm text-gray-500">Enter content to analyze for automated patterns</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-violet-100 p-6 rounded-xl border-l-4 border-purple-500">
        <h4 className="font-semibold text-violet-700 mb-2 flex items-center">
          <Bot className="w-5 h-5 mr-2 animate-pulse" />
          Bot Detection
        </h4>
        <div className="text-sm text-violet-600">Analyzing for bot patterns...</div>
      </div>
    );
  }

  if (!result) return null;

  const { botScore, flags, confidence, educationalPrompt } = result;
  const scoreColor = BotDetectionService.getBotScoreColor(botScore);
  const confidenceColor = BotDetectionService.getConfidenceColor(confidence);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
      <h4 className="font-semibold text-purple-700 mb-4 flex items-center">
        <Bot className="w-5 h-5 mr-2" />
        Bot Detection Analysis
      </h4>
      
      <div className="space-y-4">
        {/* Score and Confidence */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${scoreColor}`}>{botScore}%</div>
              <div className="text-xs text-gray-500">Bot Score</div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-semibold ${confidenceColor}`}>{confidence}</div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
          </div>
        </div>

        {/* Bot Flags */}
        {flags.length > 0 && (
          <div className="bg-rose-100 p-4 rounded-lg border border-rose-200">
            <div className="font-semibold text-rose-700 flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Automated Patterns Detected
            </div>
            <ul className="space-y-1">
              {flags.map((flag, i) => (
                <li key={i} className="text-sm text-rose-600 flex items-start">
                  <span className="w-1.5 h-1.5 bg-rose-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Educational Prompt */}
        <div className="bg-violet-100 p-4 rounded-lg border border-violet-200">
          <div className="font-semibold text-violet-700 flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Critical Thinking Prompt
          </div>
          <p className="text-sm text-violet-700 leading-relaxed">{educationalPrompt}</p>
        </div>

        {/* Quick Tips */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>🤖 <strong>Bot indicators:</strong> Repetitive language, excessive punctuation, generic phrases</div>
          <div>🔍 <strong>Human verification:</strong> Look for personal experiences, nuanced opinions, authentic engagement</div>
        </div>
      </div>
    </div>
  );
};

export default BotDetection;