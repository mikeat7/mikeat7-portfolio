import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Volume2, VolumeX, Settings, Sparkles, Brain, Eye, Zap, Crown, Lightbulb, Bot, AArrowDown as Owl } from 'lucide-react';

interface NarratorAnalysis {
  fallacies?: Array<{ type: string; severity: string; description: string }>;
  confidence?: { category: string; confidence: number; reasoning: string };
  credibility?: { credibilityScore: number; bias: string; factualRating: string };
  botScore?: number;
}

interface TruthNarratorProps {
  analysis?: NarratorAnalysis;
  isLoading?: boolean;
  avatar?: 'wise-owl' | 'truth-seeker' | 'logic-bot' | 'sage';
  language?: 'en' | 'es' | 'fr';
  chimeMuted?: boolean;
  onChimeToggle?: () => void;
}

const TruthNarrator: React.FC<TruthNarratorProps> = ({
  analysis,
  isLoading = false,
  avatar = 'wise-owl',
  language = 'en',
  chimeMuted = true,
  onChimeToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentNarration, setCurrentNarration] = useState<string>('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Avatar configurations
  const avatarConfig = {
    'wise-owl': {
      icon: Owl,
      name: 'Sophia',
      personality: 'wise and contemplative',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    'truth-seeker': {
      icon: Eye,
      name: 'Veritas',
      personality: 'direct and analytical',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    'logic-bot': {
      icon: Bot,
      name: 'Logic',
      personality: 'systematic and precise',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    'sage': {
      icon: Crown,
      name: 'Minerva',
      personality: 'philosophical and insightful',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  };

  const currentAvatar = avatarConfig[avatar];
  const AvatarIcon = currentAvatar.icon;

  // Generate chime sound
  const playChime = () => {
    if (chimeMuted || !audioContextRef.current) return;
    
    try {
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  // Initialize audio context
  useEffect(() => {
    if (!chimeMuted && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not supported:', error);
      }
    }
  }, [chimeMuted]);

  // Generate narration based on analysis
  const generateNarration = (analysisData: NarratorAnalysis): string => {
    if (!analysisData) return '';

    const { fallacies, confidence, credibility, botScore } = analysisData;
    const narratives: string[] = [];

    // Fallacy analysis narration
    if (fallacies && fallacies.length > 0) {
      const highSeverity = fallacies.filter(f => f.severity === 'high').length;
      if (highSeverity > 0) {
        narratives.push(`⚠️ I've detected ${highSeverity} critical manipulation technique${highSeverity > 1 ? 's' : ''}. This content is designed to bypass your rational thinking.`);
      } else {
        narratives.push(`🛡️ I found some rhetorical techniques that merit attention. Let's examine them critically.`);
      }
    }

    // Confidence analysis narration
    if (confidence) {
      const { category, confidence: confLevel } = confidence;
      if (category === 'unknown' || confLevel < 50) {
        narratives.push(`🤔 This content ventures into uncertain territory. Healthy skepticism is warranted here.`);
      } else if (category === 'speculated') {
        narratives.push(`💭 We're dealing with speculation and opinions. Remember to distinguish between facts and interpretations.`);
      } else {
        narratives.push(`✅ The confidence markers suggest this contains verifiable information, but always verify independently.`);
      }
    }

    // Source credibility narration
    if (credibility) {
      const { credibilityScore, bias } = credibility;
      if (credibilityScore < 50) {
        narratives.push(`🚨 This source shows significant credibility concerns. Approach with extra caution.`);
      } else if (bias !== 'center' && bias !== 'unknown') {
        narratives.push(`📊 I've detected a ${bias} editorial stance. Consider seeking diverse perspectives.`);
      }
    }

    // Bot detection narration
    if (botScore && botScore > 60) {
      narratives.push(`🤖 High automation indicators suggest this may be bot-generated content. Question the intent behind it.`);
    }

    // Default wisdom if no specific issues
    if (narratives.length === 0) {
      narratives.push(`🧠 While this content appears clean, remember: always think from first principles and verify claims independently.`);
    }

    return narratives.join(' ');
  };

  // Update narration when analysis changes
  useEffect(() => {
    if (analysis && !isLoading) {
      const narration = generateNarration(analysis);
      setCurrentNarration(narration);
      setIsNarrating(true);
      
      if (!chimeMuted) {
        playChime();
      }

      // Simulate narration timing
      const timer = setTimeout(() => {
        setIsNarrating(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (isLoading) {
      setCurrentNarration('🔍 Analyzing content for truth and manipulation patterns...');
      setIsNarrating(true);
    }
  }, [analysis, isLoading, chimeMuted]);

  // Text-to-speech functionality
  const speakNarration = () => {
    if (!currentNarration || !voiceEnabled) return;

    try {
      const utterance = new SpeechSynthesisUtterance(currentNarration.replace(/[🔍🛡️⚠️🤔💭✅🚨📊🤖🧠]/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.7;
      
      // Try to use a pleasant voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  };

  return (
    <div className={`relative transition-all duration-300 ${isExpanded ? 'mb-4' : 'mb-2'}`}>
      {/* Narrator Avatar & Toggle */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-105 ${currentAvatar.bgColor} ${currentAvatar.borderColor} border-2`}
        >
          <div className={`relative ${isNarrating ? 'animate-pulse' : ''}`}>
            <AvatarIcon className={`w-6 h-6 ${currentAvatar.color}`} />
            {isNarrating && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            )}
          </div>
          <div className="text-left">
            <div className={`font-semibold ${currentAvatar.color}`}>{currentAvatar.name}</div>
            <div className="text-xs text-gray-500">Truth Narrator</div>
          </div>
          <Sparkles className={`w-4 h-4 ${currentAvatar.color} ${isNarrating ? 'animate-spin' : ''}`} />
        </button>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          {onChimeToggle && (
            <button
              onClick={onChimeToggle}
              className={`p-2 rounded-lg transition-colors ${
                !chimeMuted 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={chimeMuted ? 'Chime muted' : 'Chime enabled'}
            >
              <Zap className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Narration Panel */}
      {isExpanded && (
        <div className={`${currentAvatar.bgColor} ${currentAvatar.borderColor} border-2 rounded-xl p-6 space-y-4`}>
          {/* Current Narration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold ${currentAvatar.color} flex items-center`}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {currentAvatar.name}'s Analysis
              </h4>
              {voiceEnabled && currentNarration && (
                <button
                  onClick={speakNarration}
                  className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  title="Speak narration"
                >
                  <Volume2 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              {currentNarration ? (
                <p className="text-gray-700 leading-relaxed">
                  {currentNarration}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Waiting for content to analyze...
                </p>
              )}
            </div>
          </div>

          {/* Narrator Personality Info */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-700">Narrator Style</span>
            </div>
            <p className="text-sm text-gray-600">
              {currentAvatar.name} approaches analysis with a {currentAvatar.personality} perspective, 
              focusing on critical thinking and epistemic humility.
            </p>
          </div>

          {/* Quick Stats */}
          {analysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {analysis.fallacies && (
                <div className="bg-white rounded-lg p-3 border text-center">
                  <div className="text-lg font-bold text-red-600">{analysis.fallacies.length}</div>
                  <div className="text-xs text-gray-500">Fallacies</div>
                </div>
              )}
              {analysis.confidence && (
                <div className="bg-white rounded-lg p-3 border text-center">
                  <div className="text-lg font-bold text-green-600">{analysis.confidence.confidence}%</div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              )}
              {analysis.credibility && (
                <div className="bg-white rounded-lg p-3 border text-center">
                  <div className="text-lg font-bold text-blue-600">{analysis.credibility.credibilityScore}%</div>
                  <div className="text-xs text-gray-500">Credibility</div>
                </div>
              )}
              {analysis.botScore !== undefined && (
                <div className="bg-white rounded-lg p-3 border text-center">
                  <div className="text-lg font-bold text-purple-600">{analysis.botScore}%</div>
                  <div className="text-xs text-gray-500">Bot Score</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TruthNarrator;