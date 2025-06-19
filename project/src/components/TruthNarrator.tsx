import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Volume2, VolumeX, Sparkles, Brain, Eye, Crown, Lightbulb, Bot, Search } from 'lucide-react';

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
  language?: 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'it' | 'de' | 'fr' | 'pt' | 'ja' | 'ru' | 'ko';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [voiceLoadAttempts, setVoiceLoadAttempts] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const voiceLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Avatar configurations - FIXED: CORRECT GENDERS
  const avatarConfig = {
    'wise-owl': {
      icon: Search,
      name: 'Aristotle',
      personality: 'wise and contemplative',
      gender: 'male',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    'truth-seeker': {
      icon: Eye,
      name: 'Veritas',
      personality: 'direct and analytical',
      gender: 'female', // CRITICAL: Veritas is female
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    'logic-bot': {
      icon: Bot,
      name: 'Logic',
      personality: 'systematic and precise',
      gender: 'neutral',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    'sage': {
      icon: Crown,
      name: 'Minerva',
      personality: 'philosophical and insightful',
      gender: 'female',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  };

  const currentAvatar = avatarConfig[avatar];
  const AvatarIcon = currentAvatar.icon;

  // ENHANCED VOICE SELECTION WITH PROPER FEMALE VOICE DETECTION
  const selectVoiceForAvatar = (voices: SpeechSynthesisVoice[], avatarType: string): SpeechSynthesisVoice | null => {
    console.log(`🎯 Selecting voice for ${avatarType} (attempt ${voiceLoadAttempts + 1})...`);
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang}) [${(v as any).gender || 'unknown'}]`));

    const config = avatarConfig[avatarType as keyof typeof avatarConfig];
    if (!config) return voices[0] || null;

    // Language preferences
    const languageMap: Record<string, string[]> = {
      'en': ['en-US', 'en-GB', 'en-AU', 'en-CA'],
      'es': ['es-ES', 'es-MX', 'es-US'],
      'fr': ['fr-FR', 'fr-CA'],
      'de': ['de-DE', 'de-AT'],
      'it': ['it-IT'],
      'pt': ['pt-BR', 'pt-PT'],
      'ru': ['ru-RU'],
      'zh': ['zh-CN', 'zh-TW'],
      'ja': ['ja-JP'],
      'ko': ['ko-KR'],
      'hi': ['hi-IN'],
      'ar': ['ar-SA', 'ar-EG']
    };

    const targetLangs = languageMap[language] || ['en-US'];
    
    // COMPREHENSIVE GENDER-SPECIFIC VOICE PATTERNS
    let genderPatterns: string[] = [];
    
    if (config.gender === 'male') {
      // MALE VOICE PATTERNS (for Aristotle)
      genderPatterns = [
        // Explicit male indicators
        'male', 'man', 'boy', 'gentleman',
        
        // Common male voice names
        'aristotle', 'alex', 'daniel', 'david', 'mark', 'tom', 'john', 'michael',
        'james', 'robert', 'william', 'richard', 'charles', 'christopher', 'matthew',
        'anthony', 'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth',
        'kevin', 'brian', 'george', 'edward', 'ronald', 'timothy', 'jason',
        
        // Platform-specific male voices
        'google male', 'microsoft male', 'apple male', 'siri male',
        'google us male', 'microsoft david',
        'google uk english male', 'google us english male',
        
        // Language-specific male names
        'carlos', 'miguel', 'antonio', 'francisco', 'jose', 'manuel',
        'pierre', 'jean', 'michel', 'philippe', 'antoine',
        'marco', 'giuseppe', 'francesco', 'alessandro',
        
        // Voice service patterns
        'voice 1', 'voice3', 'male voice', 'man voice',
        
        // Browser-specific patterns
        'microsoft david desktop', 'apple alex', 'apple tom',
        'google deutsch male', 'google español male',
        
        // Additional patterns for better matching
        'bruce', 'fred', 'ralph', 'jorge', 'diego', 'pablo',
        'hans', 'klaus', 'wolfgang', 'giovanni', 'luigi'
      ];
    } else if (config.gender === 'female') {
      // FEMALE VOICE PATTERNS (for Veritas and Minerva) - ENHANCED
      genderPatterns = [
        // Explicit female indicators
        'female', 'woman', 'girl', 'lady',
        
        // VERITAS-SPECIFIC: Common female voice names
        'veritas', 'sophia', 'samantha', 'karen', 'susan', 'victoria', 'zira', 'helena', 'catherine',
        'sarah', 'jennifer', 'lisa', 'michelle', 'kimberly', 'donna', 'carol', 'sandra',
        'betty', 'helen', 'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen',
        'sandra', 'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura', 'sarah',
        'kimberly', 'deborah', 'dorothy', 'lisa', 'nancy', 'karen', 'betty',
        
        // Platform-specific female voices
        'google female', 'microsoft female', 'apple female', 'siri female',
        'google us female', 'microsoft zira', 'microsoft hazel',
        'google uk english female', 'google us english female',
        
        // Language-specific female names
        'maria', 'carmen', 'ana', 'isabel', 'lucia', 'elena',
        'marie', 'claire', 'sophie', 'isabelle', 'camille',
        'giulia', 'francesca', 'valentina', 'chiara',
        
        // Voice service patterns for females
        'voice 2', 'voice4', 'female voice', 'woman voice',
        
        // Browser-specific female patterns
        'microsoft zira desktop', 'apple samantha', 'apple victoria',
        'google deutsch female', 'google español female',
        
        // Additional female patterns
        'anna', 'emma', 'olivia', 'ava', 'isabella', 'mia', 'abigail',
        'emily', 'charlotte', 'harper', 'madison', 'amelia', 'elizabeth',
        'sofia', 'evelyn', 'avery', 'scarlett', 'grace', 'lily', 'chloe'
      ];
    } else {
      // Neutral - prefer clear, robotic voices
      genderPatterns = [
        'robot', 'synthetic', 'computer', 'digital',
        'voice 0', 'default', 'system'
      ];
    }

    // PRIORITY SEARCH STRATEGY
    console.log(`🔍 Searching for ${config.gender} voice patterns for ${config.name}:`, genderPatterns.slice(0, 10));

    // 1. Try exact name matches first (highest priority)
    for (const lang of targetLangs) {
      const langCode = lang.split('-')[0];
      const langVoices = voices.filter(voice => voice.lang.startsWith(langCode));
      
      // Look for exact avatar name match
      const exactNameVoice = langVoices.find(voice => 
        voice.name.toLowerCase().includes(config.name.toLowerCase())
      );
      if (exactNameVoice) {
        console.log(`✅ PERFECT MATCH - Found ${config.name} voice: ${exactNameVoice.name}`);
        return exactNameVoice;
      }
    }

    // 2. Try high-priority gender patterns
    for (const lang of targetLangs) {
      const langCode = lang.split('-')[0];
      const langVoices = voices.filter(voice => voice.lang.startsWith(langCode));
      
      // High-priority patterns based on gender
      let highPriorityPatterns: string[] = [];
      
      if (config.gender === 'male') {
        highPriorityPatterns = ['alex', 'david', 'daniel', 'mark', 'male'];
      } else if (config.gender === 'female') {
        // VERITAS PRIORITY: Female-specific high-priority patterns
        highPriorityPatterns = ['samantha', 'sophia', 'karen', 'susan', 'victoria', 'female'];
      } else {
        highPriorityPatterns = ['robot', 'synthetic', 'default'];
      }
      
      for (const pattern of highPriorityPatterns) {
        const matchingVoice = langVoices.find(voice => 
          voice.name.toLowerCase().includes(pattern.toLowerCase())
        );
        if (matchingVoice) {
          console.log(`✅ HIGH PRIORITY - Found ${config.gender} voice: ${matchingVoice.name} (pattern: ${pattern})`);
          return matchingVoice;
        }
      }
    }

    // 3. Try all gender patterns
    for (const lang of targetLangs) {
      const langCode = lang.split('-')[0];
      const langVoices = voices.filter(voice => voice.lang.startsWith(langCode));
      
      for (const pattern of genderPatterns) {
        const matchingVoice = langVoices.find(voice => 
          voice.name.toLowerCase().includes(pattern.toLowerCase())
        );
        if (matchingVoice) {
          console.log(`✅ PATTERN MATCH - Found ${config.gender} voice: ${matchingVoice.name} (pattern: ${pattern})`);
          return matchingVoice;
        }
      }
    }

    // 4. Try voices with gender property (if available)
    for (const lang of targetLangs) {
      const langCode = lang.split('-')[0];
      const langVoices = voices.filter(voice => voice.lang.startsWith(langCode));
      
      const genderVoice = langVoices.find(voice => 
        (voice as any).gender === config.gender
      );
      if (genderVoice) {
        console.log(`✅ GENDER PROPERTY - Found voice: ${genderVoice.name}`);
        return genderVoice;
      }
    }

    // 5. For female voices, try numbered patterns (often female in some systems)
    if (config.gender === 'female') {
      for (const lang of targetLangs) {
        const langCode = lang.split('-')[0];
        const langVoices = voices.filter(voice => voice.lang.startsWith(langCode));
        
        const numberedFemaleVoice = langVoices.find(voice => {
          const name = voice.name.toLowerCase();
          return name.includes('2') || name.includes('4') || name.includes('6');
        });
        if (numberedFemaleVoice) {
          console.log(`✅ NUMBERED PATTERN - Found female voice: ${numberedFemaleVoice.name}`);
          return numberedFemaleVoice;
        }
      }
    }

    // 6. For male voices, try numbered patterns (often male)
    if (config.gender === 'male') {
      for (const lang of targetLangs) {
        const langCode = lang.split('-')[0];
        const langVoices = voices.filter(voice => voice.lang.startsWith(langCode));
        
        const numberedMaleVoice = langVoices.find(voice => {
          const name = voice.name.toLowerCase();
          return name.includes('1') || name.includes('3') || name.includes('5');
        });
        if (numberedMaleVoice) {
          console.log(`✅ NUMBERED PATTERN - Found male voice: ${numberedMaleVoice.name}`);
          return numberedMaleVoice;
        }
      }
    }

    // 7. Final fallback: try to find ANY voice matching gender patterns
    const anyGenderVoice = voices.find(voice => 
      genderPatterns.some(pattern => 
        voice.name.toLowerCase().includes(pattern.toLowerCase())
      )
    );
    if (anyGenderVoice) {
      console.log(`✅ FALLBACK MATCH - Found ${config.gender} voice: ${anyGenderVoice.name}`);
      return anyGenderVoice;
    }

    // 8. Ultimate fallback
    const defaultVoice = voices[0] || null;
    console.warn(`⚠️ NO MATCH - Could not find ${config.gender} voice for ${avatarType}, using default: ${defaultVoice?.name || 'None'}`);
    return defaultVoice;
  };

  // ROBUST VOICE LOADING WITH RETRY MECHANISM
  const loadVoicesWithRetry = () => {
    const maxAttempts = 10;
    const retryDelay = 200;

    const attemptVoiceLoad = () => {
      const voices = speechSynthesis.getVoices();
      console.log(`🔄 Voice load attempt ${voiceLoadAttempts + 1}/${maxAttempts}, found: ${voices.length} voices`);
      
      if (voices.length > 0) {
        setVoicesLoaded(true);
        
        // CRITICAL: Select voice specifically for current avatar
        const voice = selectVoiceForAvatar(voices, avatar);
        setSelectedVoice(voice);
        
        const debugMsg = `✅ VOICE LOCKED: ${voice?.name || 'None'} (${voice?.lang || 'N/A'}) for ${currentAvatar.name} (${currentAvatar.gender})`;
        setDebugInfo(debugMsg);
        console.log('🎭 FINAL SELECTION:', debugMsg);
        
        // Clear timeout
        if (voiceLoadTimeoutRef.current) {
          clearTimeout(voiceLoadTimeoutRef.current);
          voiceLoadTimeoutRef.current = null;
        }
        
        return true;
      } else {
        setVoiceLoadAttempts(prev => prev + 1);
        
        if (voiceLoadAttempts < maxAttempts - 1) {
          // Schedule next attempt
          voiceLoadTimeoutRef.current = setTimeout(attemptVoiceLoad, retryDelay);
        } else {
          console.warn('⚠️ Max voice load attempts reached');
          setDebugInfo('⚠️ Voice loading failed after maximum attempts');
        }
        
        return false;
      }
    };

    return attemptVoiceLoad();
  };

  // Check speech synthesis support and load voices
  useEffect(() => {
    const checkSpeechSupport = () => {
      const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
      setSpeechSupported(supported);
      
      if (supported) {
        console.log('🎤 Speech synthesis supported, loading voices...');
        
        // Reset voice loading state
        setVoicesLoaded(false);
        setVoiceLoadAttempts(0);
        setSelectedVoice(null);
        
        // Try immediate load
        if (!loadVoicesWithRetry()) {
          // Set up voice change listener as backup
          const handleVoicesChanged = () => {
            console.log('🔄 Voices changed event triggered');
            loadVoicesWithRetry();
          };
          
          speechSynthesis.onvoiceschanged = handleVoicesChanged;
          
          // Cleanup function
          return () => {
            speechSynthesis.onvoiceschanged = null;
            if (voiceLoadTimeoutRef.current) {
              clearTimeout(voiceLoadTimeoutRef.current);
            }
          };
        }
      } else {
        console.warn('❌ Speech synthesis not supported');
        setDebugInfo('❌ Speech synthesis not supported in this browser');
      }
    };
    
    checkSpeechSupport();
    
    // Cleanup on unmount
    return () => {
      if (voiceLoadTimeoutRef.current) {
        clearTimeout(voiceLoadTimeoutRef.current);
      }
    };
  }, [avatar]); // Re-run when avatar changes

  // Generate chime sound
  const playChime = () => {
    if (chimeMuted) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
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

  // Generate narration based on analysis
  const generateNarration = (analysisData: NarratorAnalysis): string => {
    if (!analysisData) return '';

    const { fallacies, confidence, credibility, botScore } = analysisData;
    const narratives: string[] = [];

    // Fallacy analysis narration
    if (fallacies && fallacies.length > 0) {
      const highSeverity = fallacies.filter(f => f.severity === 'high').length;
      if (highSeverity > 0) {
        narratives.push(`I've detected ${highSeverity} critical manipulation technique${highSeverity > 1 ? 's' : ''}. This content is designed to bypass your rational thinking.`);
      } else {
        narratives.push(`I found some rhetorical techniques that merit attention. Let's examine them critically.`);
      }
    }

    // Confidence analysis narration
    if (confidence) {
      const { category, confidence: confLevel } = confidence;
      if (category === 'unknown' || confLevel < 50) {
        narratives.push(`This content ventures into uncertain territory. Healthy skepticism is warranted here.`);
      } else if (category === 'speculated') {
        narratives.push(`We're dealing with speculation and opinions. Remember to distinguish between facts and interpretations.`);
      } else {
        narratives.push(`The confidence markers suggest this contains verifiable information, but always verify independently.`);
      }
    }

    // Source credibility narration
    if (credibility) {
      const { credibilityScore, bias } = credibility;
      if (credibilityScore < 50) {
        narratives.push(`This source shows significant credibility concerns. Approach with extra caution.`);
      } else if (bias !== 'center' && bias !== 'unknown') {
        narratives.push(`I've detected a ${bias} editorial stance. Consider seeking diverse perspectives.`);
      }
    }

    // Bot detection narration
    if (botScore && botScore > 60) {
      narratives.push(`High automation indicators suggest this may be bot-generated content. Question the intent behind it.`);
    }

    // Default wisdom if no specific issues
    if (narratives.length === 0) {
      narratives.push(`While this content appears clean, remember: always think from first principles and verify claims independently.`);
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
      setCurrentNarration('Analyzing content for truth and manipulation patterns...');
      setIsNarrating(true);
    }
  }, [analysis, isLoading, chimeMuted]);

  // SINGLE SOURCE OF TRUTH - Create speech utterance
  const createUtterance = (text: string, isTest: boolean = false): SpeechSynthesisUtterance => {
    // Clean the text for speech
    const cleanText = text
      .replace(/[🔍🛡️⚠️🤔💭✅🚨📊🤖🧠]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // CRITICAL: Use the SAME voice for both test and analysis
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎭 ${isTest ? 'TEST' : 'ANALYSIS'} - Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for ${currentAvatar.name}`);
    } else {
      console.warn(`⚠️ No voice selected for ${currentAvatar.name} - using system default`);
    }
    
    // Avatar-specific settings with PROPER GENDER PITCH
    if (currentAvatar.gender === 'male') {
      utterance.rate = 0.85;
      utterance.volume = 0.8;
      utterance.pitch = 0.8; // LOWER PITCH FOR MALE VOICES
    } else if (currentAvatar.gender === 'female') {
      utterance.rate = 0.85;
      utterance.volume = 0.8;
      utterance.pitch = 1.2; // HIGHER PITCH FOR FEMALE VOICES (VERITAS)
    } else {
      utterance.rate = 0.85;
      utterance.volume = 0.8;
      utterance.pitch = 1.0; // NEUTRAL PITCH
    }

    return utterance;
  };

  // Text-to-speech for analysis narration
  const speakNarration = async () => {
    if (!currentNarration || !speechSupported) return;

    // Stop any current speech
    speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    try {
      if (!currentNarration.trim()) return;

      // Wait for voice to be loaded if not ready
      if (!selectedVoice && voicesLoaded) {
        console.log('🔄 Voice not selected, attempting reload...');
        loadVoicesWithRetry();
        
        // Wait a moment for voice selection
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const utterance = createUtterance(currentNarration, false); // Analysis speech
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log(`🗣️ ${currentAvatar.name} started speaking analysis`);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log(`🔇 ${currentAvatar.name} finished speaking analysis`);
      };
      
      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
      setIsSpeaking(false);
    }
  };

  // Test speech with sample text
  const testSpeech = async () => {
    const testText = `Hello, I am ${currentAvatar.name}. This is a test of my ${currentAvatar.gender} voice. I provide ${currentAvatar.personality} analysis to help you think critically.`;
    
    // Stop any current speech
    speechSynthesis.cancel();
    
    // Wait for voice to be loaded if not ready
    if (!selectedVoice && voicesLoaded) {
      console.log('🔄 Voice not selected for test, attempting reload...');
      loadVoicesWithRetry();
      
      // Wait a moment for voice selection
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const utterance = createUtterance(testText, true); // Test speech
    
    utterance.onstart = () => {
      console.log(`🧪 ${currentAvatar.name} test speech started`);
    };
    
    utterance.onend = () => {
      console.log(`🧪 ${currentAvatar.name} test speech completed`);
    };
    
    utterance.onerror = (event) => {
      console.warn('Test speech error:', event.error);
    };
    
    speechSynthesis.speak(utterance);
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
            <div className="text-xs text-gray-500">Truth Narrator ({currentAvatar.gender})</div>
          </div>
          <Sparkles className={`w-4 h-4 ${currentAvatar.color} ${isNarrating ? 'animate-spin' : ''}`} />
        </button>

        {/* REDESIGNED CONTROLS - WORDS INSTEAD OF ICONS */}
        <div className="flex items-center space-x-2">
          {/* Test Voice Button - Clear Text */}
          {speechSupported && (
            <button
              onClick={testSpeech}
              className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors font-medium text-sm"
              title={`Test ${currentAvatar.name}'s ${currentAvatar.gender} voice`}
            >
              Test Voice
            </button>
          )}
          
          {/* Chime Button - Clear Text */}
          {onChimeToggle && (
            <button
              onClick={onChimeToggle}
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                !chimeMuted 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
              }`}
              title={chimeMuted ? 'Audio notifications muted' : 'Audio notifications enabled'}
            >
              Chime
            </button>
          )}
        </div>
      </div>

      {/* SPEAK BUTTON UNDER TEXT INPUT - AS REQUESTED */}
      {speechSupported && currentNarration && (
        <div className="mb-4">
          <button
            onClick={speakNarration}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              isSpeaking
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:scale-105'
            }`}
            title={isSpeaking ? `Stop ${currentAvatar.name}` : `Hear ${currentAvatar.name} speak`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5 mr-2 inline" />
                Stop Speaking
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 mr-2 inline" />
                Speak to Me
              </>
            )}
          </button>
        </div>
      )}

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

          {/* Voice Status - ENHANCED DEBUGGING */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-700">Voice Status</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>🔊 <strong>Speech Support:</strong> {speechSupported ? 'Available' : 'Not supported'}</div>
              <div>🗣️ <strong>Voices Loaded:</strong> {voicesLoaded ? 'Yes' : `Loading... (${voiceLoadAttempts}/10 attempts)`}</div>
              <div>👤 <strong>Current Narrator:</strong> {currentAvatar.name} ({currentAvatar.gender})</div>
              <div>🌐 <strong>Language:</strong> {language.toUpperCase()}</div>
              <div>🎯 <strong>Selected Voice:</strong> {selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'Loading...'}</div>
              {speechSupported && (
                <div>📢 <strong>Available Voices:</strong> {speechSynthesis.getVoices().length}</div>
              )}
              {debugInfo && (
                <div className="mt-2 p-2 bg-blue-50 rounded border">
                  <div className="text-xs font-medium text-blue-700">🔧 Debug Info:</div>
                  <div className="text-xs text-blue-600">{debugInfo}</div>
                </div>
              )}
              {avatar === 'truth-seeker' && (
                <div className="mt-2 p-2 bg-blue-50 rounded border">
                  <div className="text-xs font-medium text-blue-700">🎭 Veritas Voice Debug:</div>
                  <div className="text-xs text-blue-600">
                    Target: Female voice for Veritas<br/>
                    Selected: {selectedVoice?.name || 'Loading...'}<br/>
                    Voice Consistency: {selectedVoice ? '✅ LOCKED' : '⏳ Loading...'}<br/>
                    Load Attempts: {voiceLoadAttempts}/10<br/>
                    BOTH test and analysis use IDENTICAL voice selection
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Narrator Personality Info */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-700">Narrator Profile</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>{currentAvatar.name}</strong> is a {currentAvatar.gender} narrator who approaches analysis with a {currentAvatar.personality} perspective, 
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