import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Session persistence disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export interface ConversationSession {
  id: string;
  title: string;
  handshake_config: {
    mode: '--direct' | '--careful' | '--recap';
    stakes: 'low' | 'medium' | 'high';
    min_confidence: number;
    cite_policy: 'auto' | 'force' | 'off';
    omission_scan: 'auto' | boolean;
    reflex_profile: 'default' | 'strict' | 'lenient';
    codex_version: string;
  };
  created_at: string;
  updated_at: string;
  message_count: number;
  metadata?: Record<string, unknown>;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  vx_frames?: unknown[];
  tool_traces?: unknown[];
  confidence_score?: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}
