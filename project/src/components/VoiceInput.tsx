import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onFileContent: (content: string, filename: string) => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onFileContent, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError('Failed to start speech recognition');
      console.error('Speech recognition start error:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('processing');
    setError(null);

    try {
      // Check file type
      const allowedTypes = [
        'text/plain',
        'text/html',
        'text/markdown',
        'application/json',
        'text/csv'
      ];

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md|html|json|csv)$/i)) {
        throw new Error('Unsupported file type. Please upload text files (.txt, .md, .html, .json, .csv)');
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 5MB.');
      }

      const content = await file.text();
      
      if (content.trim().length === 0) {
        throw new Error('File appears to be empty');
      }

      onFileContent(content, file.name);
      setUploadStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => setUploadStatus('idle'), 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read file';
      setError(errorMessage);
      setUploadStatus('error');
      
      // Reset after 5 seconds
      setTimeout(() => setUploadStatus('idle'), 5000);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getUploadButtonContent = () => {
    switch (uploadStatus) {
      case 'processing':
        return (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Uploaded!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </>
        );
    }
  };

  const getUploadButtonClass = () => {
    const baseClass = "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium";
    
    switch (uploadStatus) {
      case 'processing':
        return `${baseClass} bg-blue-500 text-white cursor-wait`;
      case 'success':
        return `${baseClass} bg-green-500 text-white`;
      case 'error':
        return `${baseClass} bg-red-500 text-white hover:bg-red-600`;
      default:
        return `${baseClass} bg-gray-100 text-gray-600 hover:bg-gray-200`;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Input Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600'
              : isSupported
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>
            {isListening ? 'Stop Recording' : isSupported ? 'Voice Input' : 'Voice Not Available'}
          </span>
        </button>

        {/* File Upload Button */}
        <button
          onClick={triggerFileUpload}
          disabled={uploadStatus === 'processing'}
          className={getUploadButtonClass()}
        >
          {getUploadButtonContent()}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.html,.json,.csv,text/plain,text/html,text/markdown,application/json,text/csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Live Transcript Display */}
      {isListening && transcript && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Live Transcript:</span>
          </div>
          <p className="text-sm text-blue-800 italic">"{transcript}"</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Error:</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">How to Use:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>🎤 <strong>Voice Input:</strong> Click "Voice Input" and speak clearly. Works in Chrome, Edge, Safari</div>
          <div>📁 <strong>File Upload:</strong> Upload text files (.txt, .md, .html, .json, .csv) up to 5MB</div>
          <div>🔒 <strong>Privacy:</strong> All processing happens locally in your browser</div>
          <div>⚡ <strong>Tip:</strong> Speak slowly and clearly for best voice recognition results</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;