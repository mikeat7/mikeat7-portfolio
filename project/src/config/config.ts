export const supabaseConfig = {
  supabaseUrl: 'https://vcjxwlruvtstyvjytnaj.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjanh3bHJ1dnRzdHl2anl0bmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzk5MzcsImV4cCI6MjA2NTg1NTkzN30.v6oFtLNM1me_LIY_XKyl58Ngt0Fm5qGiJAjBvhDzbgo',
};

export const tavusConfig = {
  apiKey: import.meta.env.VITE_TAVUS_API_KEY || '7698c5a86bb04015bedc3849cde52438',
  callbackUrl: import.meta.env.VITE_TAVUS_CALLBACK_URL || 'https://webhook.site/4613529c-3d26-4957-858c-d76a35c3d697',
  replicaId: import.meta.env.VITE_TAVUS_REPLICA_ID || 'r_stock_001',
  enableRecording: import.meta.env.VITE_TAVUS_ENABLE_RECORDING === 'true',
  maxDuration: parseInt(import.meta.env.VITE_TAVUS_MAX_DURATION || '1800'),
};

export const appConfig = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Legacy export for backward compatibility
export const config = {
  ...supabaseConfig,
  ...tavusConfig,
  ...appConfig,
  tavusApiKey: tavusConfig.apiKey, // Your preferred format
};