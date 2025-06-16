import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, BookOpen, Eye } from 'lucide-react';

interface FallacyDetection {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  examples: string[];
}

interface ClarityArmorProps {
  content: string;
}

const ClarityArmor: React.FC<ClarityArmorProps> = ({ content }) => {
  const [fallacies, setFallacies] = useState<FallacyDetection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeFallacies = async () => {
      if (!content || content.trim().length < 10) {
        setFallacies([]);
        return;
      }

      setLoading(true);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const detectedFallacies: FallacyDetection[] = [];
      const lowerContent = content.toLowerCase();

      // Appeal to Fear
      if (lowerContent.includes('crisis') || lowerContent.includes('threat') || lowerContent.includes('danger') || lowerContent.includes('urgent')) {
        detectedFallacies.push({
          type: 'Appeal to Fear',
          description: 'Uses fear-based language to bypass rational evaluation',
          severity: 'high',
          examples: ['crisis', 'threat', 'urgent', 'danger']
        });
      }

      // False Urgency
      if (lowerContent.includes('act now') || lowerContent.includes('limited time') || lowerContent.includes('don\'t miss out') || lowerContent.includes('before it\'s too late')) {
        detectedFallacies.push({
          type: 'False Urgency',
          description: 'Creates artificial time pressure to prevent careful consideration',
          severity: 'medium',
          examples: ['act now', 'limited time', 'don\'t miss out']
        });
      }

      // Appeal to Authority (weak)
      if (lowerContent.includes('experts say') || lowerContent.includes('studies show') || lowerContent.includes('scientists agree')) {
        detectedFallacies.push({
          type: 'Vague Authority',
          description: 'References unnamed or unspecified authorities',
          severity: 'low',
          examples: ['experts say', 'studies show', 'scientists agree']
        });
      }

      // Emotional Manipulation
      if ((content.match(/[!]{2,}/g) || []).length > 2) {
        detectedFallacies.push({
          type: 'Emotional Manipulation',
          description: 'Uses excessive punctuation to heighten emotional response',
          severity: 'medium',
          examples: ['Multiple exclamation marks', 'ALL CAPS text']
        });
      }

      // Cherry-Picking (heuristic)
      if (lowerContent.includes('according to') && !lowerContent.includes('however') && !lowerContent.includes('but')) {
        detectedFallacies.push({
          type: 'Potential Cherry-Picking',
          description: 'Presents selective information without acknowledging counterarguments',
          severity: 'low',
          examples: ['One-sided data presentation']
        });
      }

      // False Dichotomy
      if (lowerContent.includes('either') && lowerContent.includes('or') && (lowerContent.includes('only') || lowerContent.includes('must'))) {
        detectedFallacies.push({
          type: 'False Dichotomy',
          description: 'Presents only two options when more alternatives exist',
          severity: 'high',
          examples: ['either/or statements', 'binary choices']
        });
      }

      setFallacies(detectedFallacies);
      setLoading(false);
    };

    analyzeFallacies();
  }, [content]);

  if (!content || content.trim().length < 10) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
        <h4 className="font-semibold text-gray-600 mb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Clarity Armor
        </h4>
        <p className="text-sm text-gray-500">Enter content to detect rhetorical fallacies</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-rose-100 p-6 rounded-xl border-l-4 border-red-500">
        <h4 className="font-semibold text-rose-700 mb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2 animate-pulse" />
          Clarity Armor
        </h4>
        <div className="text-sm text-rose-600">Scanning for fallacies...</div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-rose-300';
      case 'medium': return 'bg-amber-200';
      case 'low': return 'bg-emerald-200';
      default: return 'bg-gray-300';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-rose-700';
      case 'medium': return 'text-amber-700';
      case 'low': return 'text-emerald-700';
      default: return 'text-gray-700';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Critical Risk';
      case 'medium': return 'Moderate Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown Risk';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
      <h4 className="font-semibold text-red-700 mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        Clarity Armor
      </h4>
      
      <div className="space-y-4">
        {fallacies.length === 0 ? (
          <div className="bg-emerald-100 p-4 rounded-lg border border-emerald-200">
            <div className="font-semibold text-emerald-700 flex items-center mb-2">
              <Eye className="w-4 h-4 mr-2" />
              No Major Fallacies Detected
            </div>
            <p className="text-sm text-emerald-600">
              This content appears to avoid common rhetorical manipulation techniques.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fallacies.map((fallacy, index) => (
              <div key={index} className="bg-rose-100 p-4 rounded-lg border border-rose-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${getSeverityColor(fallacy.severity)}`}></span>
                    <span className={`font-semibold ${getSeverityTextColor(fallacy.severity)}`}>
                      {fallacy.type}
                    </span>
                  </div>
                  <span className={`text-xs capitalize ${getSeverityTextColor(fallacy.severity)}`}>
                    {getSeverityLabel(fallacy.severity)}
                  </span>
                </div>
                <p className="text-sm text-rose-600 mb-2">{fallacy.description}</p>
                {fallacy.examples.length > 0 && (
                  <div className="text-xs text-rose-500">
                    <strong>Detected patterns:</strong> {fallacy.examples.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Educational Prompt */}
        <div className="bg-sky-100 p-4 rounded-lg border border-sky-200">
          <div className="font-semibold text-sky-700 flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Critical Thinking Prompt
          </div>
          <p className="text-sm text-sky-700 leading-relaxed">
            {fallacies.length > 0 
              ? "Notice how this content uses emotional manipulation to bypass critical thinking. Ask: 'What specific evidence supports these claims?' and 'What alternative explanations exist?'"
              : "While no major fallacies were detected, always ask: 'What's the underlying evidence?' and 'What perspectives might be missing?'"
            }
          </p>
        </div>

        {/* Quick Tips */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>🛡️ <strong>Defense tip:</strong> Slow down when you feel emotional pressure</div>
          <div>🔍 <strong>Look for:</strong> Specific evidence, named sources, and balanced perspectives</div>
        </div>
      </div>
    </div>
  );
};

export default ClarityArmor;