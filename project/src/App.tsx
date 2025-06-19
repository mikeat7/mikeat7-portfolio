import { useEffect, useState } from 'react';
import { initTavusCVI } from './tavus'; // Adjust if different import
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);

function App() {
  const [tavusReady, setTavusReady] = useState(false);

  useEffect(() => {
    console.log('✅ Supabase connected successfully');
    console.log('🚀 Initializing Tavus CVI...');
    initTavusCVI()
      .then((success) => {
        setTavusReady(success);
        if (success) {
          console.log('✅ Tavus CVI initialized');
        } else {
          console.log('⚠️ Tavus API connection failed, CVI disabled');
        }
      })
      .catch((error) => {
        console.error('❌ Tavus CVI initialization failed - running in demo mode', error);
        setTavusReady(false);
      });
  }, []);

  // Simplified portfolio UI (replace with your actual UI)
  return (
    <div>
      {tavusReady ? (
        <div>Truth Serum Active: Conversational UI</div>
      ) : (
        <div>My Portfolio (Demo Mode)</div>
      )}
      {/* Add your portfolio content here */}
    </div>
  );
}

export default App;