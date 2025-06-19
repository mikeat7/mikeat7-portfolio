import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, tavusConfig, appConfig } from './config/config';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact = lazy(() => import('./components/Contact'));

// Initialize Supabase client
export const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);

// Test Supabase connection with proper error handling
async function testSupabase() {
  try {
    // Try a simple query that doesn't depend on specific tables
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') { 
      // PGRST116 is "table not found", 42P01 is PostgreSQL "relation does not exist" - both are fine
      console.warn('⚠️ Supabase connection issue:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.warn('⚠️ Supabase connection test failed:', err);
  }
}

// Updated Tavus configuration using the API key from config
const tavusApiConfig = {
  'Authorization': `Bearer ${tavusConfig.apiKey}`,
  'Content-Type': 'application/json',
};

// Test Tavus API connection
async function testTavus() {
  try {
    console.log('🔑 Testing Tavus API connection...');
    console.log('🔑 Using API key:', tavusConfig.apiKey ? `${tavusConfig.apiKey.substring(0, 8)}...` : 'Not configured');
    
    const response = await fetch('https://api.tavus.io/v2/conversations', {
      method: 'GET',
      headers: tavusApiConfig,
    });
    
    if (response.ok) {
      console.log('✅ Tavus connected successfully:', response.status);
      const data = await response.json();
      console.log('📊 Tavus response:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Tavus API error:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Tavus network error:', error.message);
    return false;
  }
}

// Enhanced Tavus CVI Integration with Better Error Handling
const initTavusCVI = async () => {
  try {
    console.log('🚀 Initializing Tavus CVI...');
    
    // Test API connection first
    const apiConnected = await testTavus();
    if (!apiConnected) {
      console.warn('⚠️ Tavus API connection failed, CVI disabled');
      return false;
    }

    // Add timeout and better error handling for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    const requestBody = {
      replica_id: tavusConfig.replicaId,
      callback_url: tavusConfig.callbackUrl,
      enable_recording: tavusConfig.enableRecording,
      conversation_name: 'Mike Portfolio Chat',
      properties: {
        max_call_duration: tavusConfig.maxDuration,
        participant_left_timeout: 300,
        enable_transcription: true,
        language: 'en'
      }
    };

    console.log('📤 Creating Tavus conversation...');
    
    const response = await fetch('https://api.tavus.io/v1/conversations', {
      method: 'POST',
      headers: tavusApiConfig,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error Response:', errorData);
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error(`Invalid Tavus API key. Please check your API key configuration.`);
      } else if (response.status === 403) {
        throw new Error('Tavus API access forbidden. Please verify your account permissions and API key validity.');
      } else if (response.status === 429) {
        throw new Error('Tavus API rate limit exceeded. Please try again later.');
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorData.message || 'Invalid request parameters'}. Check your callback URL and replica ID.`);
      } else {
        throw new Error(`Tavus API request failed: ${response.status} ${response.statusText}. ${errorData.message || 'Unknown error'}`);
      }
    }

    const responseData = await response.json();
    console.log('✅ Tavus API Response:', responseData);
    
    const { conversation_url, conversation_id } = responseData;
    console.log('✅ Tavus conversation created:', conversation_id);
    console.log('🔗 Conversation URL:', conversation_url);
    
    // Load Daily.co and initialize video call
    await loadDailyAndInitialize(conversation_url);
    
    return true;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Tavus API request timed out after 30 seconds. Please check your internet connection.');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('❌ Network error connecting to Tavus API. Please check your internet connection and try again.');
      
      if (appConfig.isDevelopment) {
        console.info(`
🔧 Network Error Troubleshooting:
1. Check your internet connection
2. Verify your API key is correct in the environment variables
3. Check browser network tab for detailed error info

Tavus CVI is temporarily disabled.
        `);
      }
    } else {
      console.error('❌ Tavus CVI initialization failed:', error.message);
      
      if (appConfig.isDevelopment) {
        console.info(`
🔧 Error Details: ${error.message}

Please verify:
1. Your API key is valid in the environment variables
2. Your account has proper permissions
3. The callback URL is accessible: ${tavusConfig.callbackUrl}

Tavus CVI is temporarily disabled.
        `);
      }
    }
    return false;
  }
};

// Separate function to handle Daily.co loading and initialization
const loadDailyAndInitialize = async (conversationUrl: string) => {
  try {
    // Check if Daily.co is already available
    if (typeof window !== 'undefined' && window.Daily) {
      await initializeDailyCall(conversationUrl);
      return;
    }

    // Load Daily.co script if not available
    console.log('📦 Loading Daily.co script...');
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    
    const loadPromise = new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Daily.co script'));
      
      // Add timeout for script loading
      setTimeout(() => reject(new Error('Daily.co script loading timed out')), 10000);
    });
    
    document.head.appendChild(script);
    await loadPromise;
    
    console.log('✅ Daily.co script loaded successfully');
    await initializeDailyCall(conversationUrl);
    
  } catch (error) {
    console.error('❌ Failed to load or initialize Daily.co:', error.message);
  }
};

// Initialize Daily.co call frame
const initializeDailyCall = async (conversationUrl: string) => {
  try {
    console.log('🎥 Initializing Daily.co video call...');
    
    const callFrame = window.Daily.createFrame({
      iframeStyle: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        height: '200px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        border: 'none'
      },
      showLeaveButton: true,
      showFullscreenButton: true,
      showLocalVideo: true,
      showParticipantsBar: false
    });

    // Join the conversation with timeout
    const joinPromise = callFrame.join({ 
      url: conversationUrl,
      userName: 'Portfolio Visitor'
    });
    
    // Add timeout for joining
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Daily.co join timeout')), 15000)
    );
    
    await Promise.race([joinPromise, timeoutPromise]);

    // Add event listeners
    callFrame.on('joined-meeting', () => {
      console.log('✅ Successfully joined Tavus CVI session');
    });

    callFrame.on('left-meeting', () => {
      console.log('👋 Left Tavus CVI session');
    });

    callFrame.on('error', (error) => {
      console.error('❌ Daily.co error:', error);
    });

    // Store call frame reference for cleanup
    window.tavusCallFrame = callFrame;
    
  } catch (error) {
    console.error('❌ Failed to initialize Daily.co call:', error.message);
  }
};

function App() {
  const [tavusReady, setTavusReady] = useState(false);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    // Test Supabase connection
    testSupabase().then(() => {
      setSupabaseReady(true);
    });

    // Initialize Tavus CVI on component mount with delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      initTavusCVI().then((success) => {
        setTavusReady(success);
        if (success) {
          console.log('✅ Tavus CVI initialized successfully');
        } else {
          console.log('❌ Tavus CVI initialization failed - running in demo mode');
        }
      });
    }, 1000);
    
    // Cleanup function
    return () => {
      clearTimeout(initTimer);
      if (window.tavusCallFrame) {
        try {
          window.tavusCallFrame.destroy();
        } catch (error) {
          console.warn('Warning: Error destroying Tavus call frame:', error);
        }
        window.tavusCallFrame = null;
      }
    };
  }, []);

  return (
    <Router>
      <div className="app-container min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        {/* Status Indicators */}
        <div className="fixed top-20 right-4 z-40 space-y-2">
          {supabaseReady && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              ✅ Supabase Connected
            </div>
          )}
          {tavusReady ? (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              🎥 Tavus CVI Active
            </div>
          ) : (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              🔧 Tavus CVI Demo Mode
            </div>
          )}
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;