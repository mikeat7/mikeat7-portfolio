import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Globe, User, Volume2, Bell } from 'lucide-react';

interface NarratorConfig {
  avatar: 'wise-owl' | 'truth-seeker' | 'logic-bot' | 'sage';
  language: 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'it' | 'de' | 'fr' | 'pt' | 'ja' | 'ru' | 'ko';
  enabled: boolean;
  chimeMuted: boolean;
  voiceEnabled?: boolean;
  narrationSpeed?: number;
}

interface NarratorSettingsProps {
  onSave: (config: NarratorConfig) => void;
  initialConfig?: Partial<NarratorConfig>;
  onClose?: () => void;
}

const NarratorSettings: React.FC<NarratorSettingsProps> = ({ 
  onSave, 
  initialConfig = {},
  onClose 
}) => {
  const [config, setConfig] = useState<NarratorConfig>({
    avatar: 'wise-owl',
    language: 'en',
    enabled: true,
    chimeMuted: true,
    voiceEnabled: false,
    narrationSpeed: 1.0,
    ...initialConfig
  });

  const avatars = [
    { 
      id: 'wise-owl' as const, 
      name: 'Aristotle (Wise Owl)', 
      tone: 'Sage',
      gender: 'Male',
      description: 'Wise and contemplative approach to analysis',
      personality: '🦉 Thoughtful, patient, and philosophical'
    },
    { 
      id: 'truth-seeker' as const, 
      name: 'Veritas (Truth Seeker)', 
      tone: 'Rigorous',
      gender: 'Female',
      description: 'Direct and analytical examination of facts',
      personality: '🔍 Precise, logical, and evidence-focused'
    },
    { 
      id: 'logic-bot' as const, 
      name: 'Logic (Logic Bot)', 
      tone: 'Systematic',
      gender: 'Neutral',
      description: 'Methodical and structured analysis',
      personality: '🤖 Systematic, thorough, and objective'
    },
    { 
      id: 'sage' as const, 
      name: 'Minerva (Sage)', 
      tone: 'Insightful',
      gender: 'Female',
      description: 'Philosophical and deep understanding',
      personality: '👑 Wise, insightful, and balanced'
    }
  ];

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸', region: 'Global' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸', region: 'Spain & Latin America' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷', region: 'France & Francophone' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪', region: 'Germany & DACH' },
    { code: 'it' as const, name: 'Italiano', flag: '🇮🇹', region: 'Italy' },
    { code: 'pt' as const, name: 'Português', flag: '🇧🇷', region: 'Brazil & Portugal' },
    { code: 'ru' as const, name: 'Русский', flag: '🇷🇺', region: 'Russia & CIS' },
    { code: 'zh' as const, name: '中文', flag: '🇨🇳', region: 'China & Taiwan' },
    { code: 'ja' as const, name: '日本語', flag: '🇯🇵', region: 'Japan' },
    { code: 'ko' as const, name: '한국어', flag: '🇰🇷', region: 'Korea' },
    { code: 'hi' as const, name: 'हिन्दी', flag: '🇮🇳', region: 'India' },
    { code: 'ar' as const, name: 'العربية', flag: '🇸🇦', region: 'Middle East & North Africa' }
  ];

  const handleSave = () => {
    onSave(config);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setConfig({
      avatar: 'wise-owl',
      language: 'en',
      enabled: true,
      chimeMuted: true,
      voiceEnabled: false,
      narrationSpeed: 1.0
    });
  };

  const selectedAvatar = avatars.find(a => a.id === config.avatar);
  const selectedLanguage = languages.find(l => l.code === config.language);

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Truth Narrator Settings</h2>
            <p className="text-sm text-gray-600">Customize your AI analysis companion</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Settings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Avatar Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-600" />
            <label className="font-semibold text-gray-700">AI Narrator Personality</label>
          </div>
          
          <div className="space-y-3">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  config.avatar === avatar.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setConfig({ ...config, avatar: avatar.id })}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 flex items-center space-x-2">
                      <span>{avatar.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        avatar.gender === 'Male' ? 'bg-blue-100 text-blue-700' :
                        avatar.gender === 'Female' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {avatar.gender} Voice
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{avatar.description}</div>
                    <div className="text-xs text-gray-500 mt-2">{avatar.personality}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    config.avatar === avatar.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {config.avatar === avatar.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language & Audio Settings */}
        <div className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <label className="font-semibold text-gray-700">Language & Region</label>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    config.language === lang.code
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setConfig({ ...config, language: lang.code })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className={`font-medium ${
                          config.language === lang.code ? 'text-blue-800' : 'text-gray-800'
                        }`}>
                          {lang.name}
                        </div>
                        <div className="text-xs text-gray-500">{lang.region}</div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      config.language === lang.code
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {config.language === lang.code && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              Currently selected: {selectedLanguage?.flag} {selectedLanguage?.name} ({selectedLanguage?.region})
            </p>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <label className="font-semibold text-gray-700">Audio Settings</label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="font-medium text-gray-700">Voice Narration</span>
                    <p className="text-xs text-gray-500">Enable text-to-speech for analysis</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.voiceEnabled}
                  onChange={(e) => setConfig({ ...config, voiceEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="font-medium text-gray-700">Audio Chimes</span>
                    <p className="text-xs text-gray-500">Play notification sounds</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!config.chimeMuted}
                  onChange={(e) => setConfig({ ...config, chimeMuted: !e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Narration Speed */}
            {config.voiceEnabled && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Narration Speed: {config.narrationSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.narrationSpeed}
                  onChange={(e) => setConfig({ ...config, narrationSpeed: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="border-t pt-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">General Settings</h3>
          
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-gray-700">Enable Truth Narrator</span>
                <p className="text-sm text-gray-500">Turn on AI-powered analysis narration</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-125"
            />
          </label>
        </div>
      </div>

      {/* Preview */}
      {config.enabled && selectedAvatar && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-700 mb-2">Preview</h4>
          <div className="text-sm text-gray-600">
            <strong>{selectedAvatar.name}</strong> will provide {selectedAvatar.tone.toLowerCase()} analysis 
            in <strong>{selectedLanguage?.name}</strong> ({selectedLanguage?.region}) using a <strong>{selectedAvatar.gender.toLowerCase()} voice</strong>
            {config.voiceEnabled && ` with voice narration at ${config.narrationSpeed}x speed`}
            {!config.chimeMuted && ` and audio notifications`}.
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </button>
        
        <div className="flex space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NarratorSettings;