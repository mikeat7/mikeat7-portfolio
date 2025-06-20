// src/config/config.ts

export const supabaseConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export const tavusConfig = {
  apiKey: import.meta.env.VITE_TAVUS_API_KEY,
  callbackUrl: import.meta.env.VITE_TAVUS_CALLBACK_URL,
  replicaId: 'r89d84ea6160', // Your active Tavus replica
  enableRecording: import.meta.env.VITE_TAVUS_ENABLE_RECORDING === 'true',
  maxDuration: Number(import.meta.env.VITE_TAVUS_MAX_DURATION || 1800),
};

