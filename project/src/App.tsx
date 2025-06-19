import { useEffect, useState } from 'react';
import { initTavusCVI } from './tavus'; // Make sure this file exists
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey, tavusApiKey } from './config/config';

const supabase = createClient(supabaseUrl, supabaseKey);

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
