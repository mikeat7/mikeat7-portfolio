import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Mic, Upload, Brain, Shield, Target, Bot, CheckCircle, Clock, Settings } from 'lucide-react';
import ClarityArmor from './ClarityArmor';
import TruthSerum from './TruthSerum';
import SourceCredibility from './SourceCredibility';
import BotDetection from './BotDetection';
import TruthNarrator from './TruthNarrator';
import NarratorSettings from './NarratorSettings';
import { analyzePaper } from '../services/paperAnalysis';

interface AnalysisState {
  content: string;
  url: string;
  isAnalyzing: boolean;
  lastAnalyzed: number;
}

interface NarratorConfig {
  avatar: 'wise-owl' | 'truth-seeker' | 'logic-bot' | 'sage';
  language: 'en' | 'es' | 'zh' | 'hi' | 'ar';
  enabled: boolean;
  chimeMuted: boolean;
  voiceEnabled?: boolean;
  narrationSpeed?: number;
}

const AnalysisEngine: React.FC = () => {
  const [inputContent, setInputContent] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [activeInput, setActiveInput] = useState<'url' | 'text'>('text');
  const [showNarratorSettings, setShowNarratorSettings] = useState(false);
  const [narratorConfig, setNarratorConfig] = useState<NarratorConfig>({
    avatar: 'wise-owl',
    language: 'en',
    enabled: true,
    chimeMuted: true,
    voiceEnabled: false,
    narrationSpeed: 1.0
  });
  
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    content: '',
    url: '',
    isAnalyzing: false,
    lastAnalyzed: 0
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get the current input for analysis
  const currentInput = activeInput === 'url' ? inputUrl.trim() : inputContent.trim();

  // React Query for paper analysis
  const { data: paperAnalysis, isLoading: isPaperLoading, error } = useQuery({
    queryKey: ['paperAnalysis', currentInput],
    queryFn: () => analyzePaper(currentInput),
    enabled: currentInput.length > 10, // Only run if we have substantial input
    staleTime: 10 * 60 * 1000, // 10-minute cache
    retry: 1,
  });

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Debounced analysis trigger for legacy components
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const content = inputContent.trim();
    const url = inputUrl.trim();

    if (!content && !url) {
      setAnalysisState(prev => ({
        ...prev,
        content: '',
        url: '',
        isAnalyzing: false
      }));
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      if (content !== analysisState.content || url !== analysisState.url) {
        setAnalysisState(prev => ({
          ...prev,
          content,
          url,
          isAnalyzing: true,
          lastAnalyzed: Date.now()
        }));

        // Simulate analysis completion for legacy components
        setTimeout(() => {
          setAnalysisState(prev => ({
            ...prev,
            isAnalyzing: false
          }));
        }, 1500);
      }
    }, 1000);
  }, [inputContent, inputUrl]);

  const sampleUrls = [
    'https://www.bbc.com/news/sample-article',
    'https://www.foxnews.com/politics/sample-story',
    'https://www.reuters.com/world/sample-report',
    'https://www.breitbart.com/politics/sample-piece',
    'https://www.theonion.com/sample-satire'
  ];

  const sampleTexts = [
    'AMAZING OPPORTUNITY!!! Click here NOW for GUARANTEED results! Limited time offer - don\'t miss out! Act now before it\'s too late!!!',
    'After careful analysis of the economic data, I believe we should consider multiple perspectives on this complex policy issue.',
    'Breaking: URGENT UPDATE! This changes everything! Share immediately! Time is running out! Don\'t let them hide the truth!',
    'The research suggests that while correlation exists, we cannot definitively establish causation without further longitudinal studies.',
    'Recent studies from Harvard Medical School indicate that regular exercise may reduce the risk of cardiovascular disease by up to 30%.'
  ];

  const hasAnalysisContent = analysisState.content || analysisState.url;
  const hasUserInput = inputContent.trim() || inputUrl.trim();

  // Transform paper analysis for narrator
  const narratorAnalysis = paperAnalysis ? {
    fallacies: paperAnalysis.fallacies,
    confidence: paperAnalysis.confidence,
    credibility: paperAnalysis.credibility,
    botScore: paperAnalysis.botScore
  } : undefined;

  // Handle narrator settings save
  const handleNarratorSettingsSave = (config: NarratorConfig) => {
    setNarratorConfig(config);
    setShowNarratorSettings(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Analysis Engine</h1>
        <p className="text-gray-600">AI-powered content analysis with intelligent narration</p>
      </div>

      {/* Truth Narrator */}
      {narratorConfig.enabled && (
        <TruthNarrator
          analysis={narratorAnalysis}
          isLoading={isPaperLoading}
          avatar={narratorConfig.avatar}
          language={narratorConfig.language}
          chimeMuted={narratorConfig.chimeMuted}
          onChimeToggle={() => setNarratorConfig(prev => ({ ...prev, chimeMuted: !prev.chimeMuted }))}
        />
      )}

      {/* Narrator Controls */}
      <div className="bg-white rounded-xl shadow-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={narratorConfig.enabled}
                onChange={(e) => setNarratorConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable Truth Narrator</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            {narratorConfig.enabled && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Avatar:</span>
                <select
                  value={narratorConfig.avatar}
                  onChange={(e) => setNarratorConfig(prev => ({ ...prev, avatar: e.target.value as any }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="wise-owl">Sophia (Wise Owl)</option>
                  <option value="truth-seeker">Veritas (Truth Seeker)</option>
                  <option value="logic-bot">Logic (Logic Bot)</option>
                  <option value="sage">Minerva (Sage)</option>
                </select>
              </div>
            )}
            
            <button
              onClick={() => setShowNarratorSettings(true)}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Narrator Settings Modal */}
      {showNarratorSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <NarratorSettings
              onSave={handleNarratorSettingsSave}
              initialConfig={narratorConfig}
              onClose={() => setShowNarratorSettings(false)}
            />
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveInput('text')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeInput === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Text Analysis
          </button>
          <button
            onClick={() => setActiveInput('url')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeInput === 'url'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            URL Analysis
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Text Input */}
          <div className="space-y-4">
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste text content to analyze for fallacies, bias, and bot patterns..."
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            {/* Sample Texts */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Try these sample texts:</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sampleTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => setInputContent(text)}
                    className="block w-full text-left text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors border"
                  >
                    {text.substring(0, 80)}...
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Mic className="w-4 h-4" />
                <span>Voice Input</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL to analyze (e.g., https://example.com/article)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Sample URLs */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Try these sample URLs:</p>
              <div className="flex flex-wrap gap-2">
                {sampleUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setInputUrl(url)}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {new URL(url).hostname}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Analysis Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Enhanced Analysis Status</span>
              </div>
              
              {isPaperLoading ? (
                <div className="text-sm text-blue-600 flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>AI analysis in progress...</span>
                </div>
              ) : paperAnalysis ? (
                <div className="space-y-2">
                  <div className="text-sm text-green-600 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Enhanced analysis complete</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Summary: {paperAnalysis.summary}
                  </div>
                </div>
              ) : error ? (
                <div className="text-sm text-red-600">
                  Analysis failed: {error.message}
                </div>
              ) : hasUserInput ? (
                <div className="text-sm text-yellow-600 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Preparing enhanced analysis...</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Enter content to begin enhanced analysis</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {hasAnalysisContent && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Results</h2>
            <p className="text-gray-600">Comprehensive breakdown across all detection systems</p>
          </div>

          {analysisState.isAnalyzing ? (
            <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Content</h3>
              <p className="text-gray-600 mb-4">Running comprehensive analysis across all systems...</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Fallacy Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Truth Calibration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Source Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>Bot Detection</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <ClarityArmor content={analysisState.content} />
              <TruthSerum content={analysisState.content} />
              <SourceCredibility url={analysisState.url} />
              <BotDetection 
                content={analysisState.content || analysisState.url} 
                sourceUrl={analysisState.url || undefined} 
              />
            </div>
          )}

          {/* Enhanced Analysis Summary */}
          {paperAnalysis && !isPaperLoading && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-600" />
                AI Analysis Summary
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Key Findings</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{paperAnalysis.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {paperAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-red-600">{paperAnalysis.fallacies.length}</div>
                    <div className="text-xs text-gray-500">Fallacies Found</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-green-600">{paperAnalysis.confidence.confidence}%</div>
                    <div className="text-xs text-gray-500">Confidence Level</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-blue-600">{paperAnalysis.credibility.credibilityScore}%</div>
                    <div className="text-xs text-gray-500">Source Credibility</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-purple-600">{paperAnalysis.botScore}%</div>
                    <div className="text-xs text-gray-500">Automation Risk</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisEngine;