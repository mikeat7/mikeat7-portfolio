import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, BookOpen, CheckCircle, HelpCircle, XCircle } from 'lucide-react';

interface ConfidenceAnalysis {
  category: 'known' | 'speculated' | 'unknown';
  confidence: number;
  reasoning: string;
  flags: string[];
}

interface TruthSerumProps {
  content: string;
}

const TruthSerum: React.FC<TruthSerumProps> = ({ content }) => {
  const [analysis, setAnalysis] = useState<ConfidenceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeConfidence = async () => {
      if (!content || content.trim().length < 10) {
        setAnalysis(null);
        return;
      }

      setLoading(true);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const lowerContent = content.toLowerCase();
      const flags: string[] = [];
      let confidence = 70; // Base confidence
      let category: 'known' | 'speculated' | 'unknown' = 'speculated';

      // Analyze certainty indicators
      const certaintyWords = ['definitely', 'certainly', 'absolutely', 'guaranteed', 'proven', 'fact'];
      const uncertaintyWords = ['might', 'could', 'possibly', 'perhaps', 'maybe', 'likely', 'probably'];
      const hedgingWords = ['seems', 'appears', 'suggests', 'indicates', 'may', 'believe'];

      const certaintyCount = certaintyWords.filter(word => lowerContent.includes(word)).length;
      const uncertaintyCount = uncertaintyWords.filter(word => lowerContent.includes(word)).length;
      const hedgingCount = hedgingWords.filter(word => lowerContent.includes(word)).length;

      // Overconfidence detection
      if (certaintyCount > 2) {
        flags.push('Overconfident language detected');
        confidence -= 20;
        category = 'speculated';
      }

      // Appropriate uncertainty
      if (uncertaintyCount > 0 || hedgingCount > 0) {
        flags.push('Appropriate uncertainty markers present');
        confidence += 10;
        if (uncertaintyCount > hedgingCount) {
          category = 'unknown';
        }
      }

      // Source indicators
      if (lowerContent.includes('according to') || lowerContent.includes('research shows') || lowerContent.includes('study found')) {
        if (lowerContent.includes('university') || lowerContent.includes('journal') || lowerContent.includes('peer-reviewed')) {
          flags.push('Credible source indicators present');
          confidence += 15;
          category = 'known';
        } else {
          flags.push('Vague source references');
          confidence -= 10;
        }
      }

      // Prediction/speculation indicators
      if (lowerContent.includes('will') || lowerContent.includes('predict') || lowerContent.includes('forecast') || lowerContent.includes('expect')) {
        flags.push('Future predictions detected');
        confidence -= 15;
        category = 'speculated';
      }

      // Opinion vs fact indicators
      if (lowerContent.includes('i think') || lowerContent.includes('i believe') || lowerContent.includes('in my opinion')) {
        flags.push('Opinion markers present');
        confidence += 5; // Good for transparency
        category = 'speculated';
      }

      // Data/statistics indicators
      if (lowerContent.match(/\d+%/) || lowerContent.includes('data') || lowerContent.includes('statistics')) {
        if (lowerContent.includes('survey') || lowerContent.includes('sample')) {
          flags.push('Statistical data with methodology');
          confidence += 20;
          category = 'known';
        } else {
          flags.push('Statistical claims without clear methodology');
          confidence -= 5;
        }
      }

      // Emotional language that might indicate bias
      const emotionalWords = ['outrageous', 'shocking', 'incredible', 'amazing', 'terrible', 'wonderful'];
      const emotionalCount = emotionalWords.filter(word => lowerContent.includes(word)).length;
      
      if (emotionalCount > 1) {
        flags.push('High emotional language may indicate bias');
        confidence -= 10;
      }

      // Cap confidence between 0-100
      confidence = Math.max(0, Math.min(100, confidence));

      let reasoning = '';
      if (category === 'known') {
        reasoning = 'Content appears to reference verifiable facts or credible sources';
      } else if (category === 'speculated') {
        reasoning = 'Content contains predictions, opinions, or uncertain claims';
      } else {
        reasoning = 'Content deals with uncertain or unknowable information';
      }

      setAnalysis({ category, confidence, reasoning, flags });
      setLoading(false);
    };

    analyzeConfidence();
  }, [content]);

  if (!content || content.trim().length < 10) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
        <h4 className="font-semibold text-gray-600 mb-2 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Truth Serum
        </h4>
        <p className="text-sm text-gray-500">Enter content to analyze confidence levels</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-yellow-100 p-6 rounded-xl border-l-4 border-yellow-500">
        <h4 className="font-semibold text-yellow-700 mb-2 flex items-center">
          <Target className="w-5 h-5 mr-2 animate-pulse" />
          Truth Serum
        </h4>
        <div className="text-sm text-yellow-600">Calibrating confidence levels...</div>
      </div>
    );
  }

  if (!analysis) return null;

  const { category, confidence, reasoning, flags } = analysis;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'known': return <CheckCircle className="w-4 h-4" />;
      case 'speculated': return <HelpCircle className="w-4 h-4" />;
      case 'unknown': return <XCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'known': return 'text-yellow-700';
      case 'speculated': return 'text-amber-700';
      case 'unknown': return 'text-rose-700';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-yellow-700';
    if (conf >= 60) return 'text-amber-700';
    return 'text-rose-700';
  };

  const getCategoryIndicatorColor = (cat: string) => {
    switch (cat) {
      case 'known': return 'bg-yellow-300';
      case 'speculated': return 'bg-amber-200';
      case 'unknown': return 'bg-rose-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
      <h4 className="font-semibold text-yellow-700 mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2" />
        Truth Serum Analysis
      </h4>
      
      <div className="space-y-4">
        {/* Category and Confidence */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${getCategoryIndicatorColor(category)}`}></span>
            <span className={getCategoryColor(category)}>
              {getCategoryIcon(category)}
            </span>
            <span className={`font-semibold capitalize ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>{confidence}%</div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-medium text-gray-700 mb-1">Analysis</div>
          <p className="text-sm text-gray-600">{reasoning}</p>
        </div>

        {/* Flags */}
        {flags.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-gray-700">Confidence Indicators:</div>
            {flags.map((flag, index) => (
              <div key={index} className="flex items-start text-sm">
                <span className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                  flag.includes('appropriate') || flag.includes('credible') || flag.includes('present') 
                    ? 'bg-yellow-300' 
                    : flag.includes('detected') || flag.includes('vague')
                    ? 'bg-amber-200'
                    : 'bg-rose-300'
                }`}></span>
                <span className="text-gray-600">{flag}</span>
              </div>
            ))}
          </div>
        )}

        {/* Educational Prompt */}
        <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="font-semibold text-yellow-700 flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Epistemic Humility Prompt
          </div>
          <p className="text-sm text-yellow-700 leading-relaxed">
            {category === 'known' 
              ? "Even with high confidence, ask: 'What evidence supports this?' and 'What could change this conclusion?'"
              : category === 'speculated'
              ? "This involves speculation or opinion. Consider: 'What assumptions are being made?' and 'What alternative explanations exist?'"
              : "This deals with uncertain territory. Remember: 'It's okay to say we don't know' and 'What would we need to learn more?'"
            }
          </p>
        </div>

        {/* Quick Tips */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>🎯 <strong>Truth calibration:</strong> Match confidence to actual evidence</div>
          <div>🤔 <strong>Epistemic humility:</strong> It's okay to acknowledge uncertainty</div>
        </div>
      </div>
    </div>
  );
};

export default TruthSerum;