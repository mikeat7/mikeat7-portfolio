import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Bot, Target, Shield, Database } from 'lucide-react';
import useAnalysis from '../hooks/useAnalysis';
import { processData, normalizeData, processDataEnhanced } from '../utils/dataProcessor';

interface AnalysisProps {
  data: any[];
  title?: string;
  useOriginalProcessor?: boolean;
}

const SimpleAnalysisEngine: React.FC<AnalysisProps> = ({ 
  data, 
  title = "Simple Analysis Engine",
  useOriginalProcessor = false
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [processingStats, setProcessingStats] = useState<{
    original: number;
    filtered: number;
    processed: number;
  }>({ original: 0, filtered: 0, processed: 0 });
  const { analyze, loading, error } = useAnalysis();

  useEffect(() => {
    const runAnalysis = async () => {
      if (!data || data.length === 0) {
        setResults([]);
        setProcessingStats({ original: 0, filtered: 0, processed: 0 });
        return;
      }

      let processedData: string[];
      
      if (useOriginalProcessor) {
        // Use your original processData function
        const filteredObjects = processData(data);
        processedData = normalizeData(filteredObjects);
      } else {
        // Use enhanced processing
        const enhanced = processDataEnhanced(data);
        processedData = enhanced.map(item => item.content);
      }
      
      setProcessingStats({
        original: data.length,
        filtered: processedData.length,
        processed: processedData.length
      });

      const analysisResults = await analyze(processedData);
      setResults(analysisResults);
    };
    
    runAnalysis();
  }, [data, analyze, useOriginalProcessor]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fallacy': return <Shield className="w-4 h-4" />;
      case 'confidence': return <Target className="w-4 h-4" />;
      case 'credibility': return <CheckCircle className="w-4 h-4" />;
      case 'bot': return <Bot className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-500 bg-green-50 text-green-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
          <span className="text-lg font-semibold text-gray-700">Analyzing data...</span>
        </div>
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600">
            Processing {data.length} items using {useOriginalProcessor ? 'original' : 'enhanced'} processor
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <span className="text-lg font-semibold">Analysis Error</span>
        </div>
        <div className="mt-4 bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600">
              {processingStats.original} → {processingStats.processed} items • {results.length} insights
            </p>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="flex space-x-4">
          {['high', 'medium', 'low'].map(severity => {
            const count = results.filter(r => r.severity === severity).length;
            return (
              <div key={severity} className="text-center">
                <div className={`text-lg font-bold ${
                  severity === 'high' ? 'text-red-600' :
                  severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {count}
                </div>
                <div className="text-xs text-gray-500 capitalize">{severity}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Processing Info */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Database className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Data Processing ({useOriginalProcessor ? 'Original' : 'Enhanced'} Mode)
          </span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>📥 <strong>Input:</strong> {processingStats.original} items</div>
          <div>🔄 <strong>Processed:</strong> {processingStats.processed} items</div>
          <div>📊 <strong>Analysis:</strong> {results.length} findings</div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Issues Detected</h3>
            <p className="text-gray-500">
              {data.length === 0 
                ? 'Provide data array to begin analysis' 
                : 'Content appears clean - no major manipulation patterns found'
              }
            </p>
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getSeverityColor(result.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{result.title}</h3>
                    <p className="text-sm leading-relaxed">{result.description}</p>
                    
                    {/* Metadata */}
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="capitalize">
                        Category: {result.category || 'general'}
                      </span>
                      <span className="capitalize">
                        Severity: {result.severity || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Score */}
                {result.score && (
                  <div className="text-right ml-4">
                    <div className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div>💡 <strong>Analysis complete:</strong> Review findings and apply critical thinking</div>
            <div>🔍 <strong>Next steps:</strong> Verify claims independently and seek diverse perspectives</div>
            <div>⚙️ <strong>Processor:</strong> Using {useOriginalProcessor ? 'your original' : 'enhanced'} data processing</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAnalysisEngine;