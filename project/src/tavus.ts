export const initTavusCVI = async () => {
  try {
    console.log('🚀 Initializing Tavus CVI...');
    console.log('🔑 Using Tavus API key:', tavusConfig.apiKey ? `${tavusConfig.apiKey.substring(0, 8)}...` : 'Not configured');

    const response = await fetch('https://api.tavus.io/v1/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tavusConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: tavusConfig.replicaId,
        callback_url: tavusConfig.callbackUrl,
        enable_recording: tavusConfig.enableRecording,
        max_duration: tavusConfig.maxDuration,
      }),
    });

    const data = await response.json();
    const url = data?.data?.conversation_url;

    if (!url) {
      console.error('❌ Tavus API responded without a conversation URL');
      return false;
    }

    await loadDailyAndInitialize(url);
    return true;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Tavus API request timed out after 30 seconds. Please check your internet connection.');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('❌ Network error connecting to Tavus API. Please check your internet connection and try again.');
    } else {
      console.error('❌ Tavus CVI initialization failed:', error.message);
    }
    return false;
  }
};


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
    
     const data = await response.json();
    const url = data?.data?.conversation_url;

    if (!url) {
      console.error('❌ Tavus API responded without a conversation URL');
      return false;
    }

    // Load Daily.co and initialize video call
    await loadDailyAndInitialize(url);

    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Tavus API request timed out after 30 seconds. Please check your internet connection.');
    } else if (error.message?.includes('Failed to fetch')) {
      console.error('❌ Network error connecting to Tavus API. Please check your internet connection and try again.');
    } else {
      console.error('❌ Tavus CVI initialization failed:', error.message || error);
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