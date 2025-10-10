import { supabase, ConversationSession, ConversationMessage } from './supabaseClient';

export type { ConversationSession, ConversationMessage };

export interface SessionManager {
  createSession: (title?: string, handshakeConfig?: ConversationSession['handshake_config']) => Promise<string>;
  getSession: (sessionId: string) => Promise<ConversationSession | null>;
  listSessions: (limit?: number) => Promise<ConversationSession[]>;
  deleteSession: (sessionId: string) => Promise<void>;
  addMessage: (sessionId: string, role: ConversationMessage['role'], content: string, extras?: Partial<ConversationMessage>) => Promise<ConversationMessage>;
  getMessages: (sessionId: string) => Promise<ConversationMessage[]>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
}

export const sessionManager: SessionManager = {
  async createSession(title = 'New Conversation', handshakeConfig) {
    const defaultHandshake = {
      mode: '--careful' as const,
      stakes: 'medium' as const,
      min_confidence: 0.6,
      cite_policy: 'auto' as const,
      omission_scan: 'auto' as const,
      reflex_profile: 'default' as const,
      codex_version: '0.9.0',
    };

    const { data, error } = await supabase
      .from('conversation_sessions')
      .insert({
        title,
        handshake_config: handshakeConfig || defaultHandshake,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    if (!data?.id) throw new Error('Session created but no ID returned');

    return data.id;
  },

  async getSession(sessionId: string) {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw new Error(`Failed to get session: ${error.message}`);
    return data as ConversationSession | null;
  },

  async listSessions(limit = 20) {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to list sessions: ${error.message}`);
    return (data || []) as ConversationSession[];
  },

  async deleteSession(sessionId: string) {
    const { error } = await supabase
      .from('conversation_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw new Error(`Failed to delete session: ${error.message}`);
  },

  async addMessage(sessionId: string, role: ConversationMessage['role'], content: string, extras = {}) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        vx_frames: extras.vx_frames || [],
        tool_traces: extras.tool_traces || [],
        confidence_score: extras.confidence_score,
        metadata: extras.metadata || {},
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add message: ${error.message}`);
    return data as ConversationMessage;
  },

  async getMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to get messages: ${error.message}`);
    return (data || []) as ConversationMessage[];
  },

  async updateSessionTitle(sessionId: string, title: string) {
    const { error } = await supabase
      .from('conversation_sessions')
      .update({ title })
      .eq('id', sessionId);

    if (error) throw new Error(`Failed to update session title: ${error.message}`);
  },
};

export function generateSessionTitle(firstMessage: string): string {
  const maxLength = 50;
  const cleaned = firstMessage.trim().replace(/\s+/g, ' ');

  if (cleaned.length <= maxLength) return cleaned;

  return cleaned.slice(0, maxLength - 3) + '...';
}

export function getSessionFromLocalStorage(): string | null {
  try {
    return localStorage.getItem('current_session_id');
  } catch {
    return null;
  }
}

export function setSessionInLocalStorage(sessionId: string): void {
  try {
    localStorage.setItem('current_session_id', sessionId);
  } catch (e) {
    console.warn('Failed to save session to localStorage:', e);
  }
}

export function clearSessionFromLocalStorage(): void {
  try {
    localStorage.removeItem('current_session_id');
  } catch (e) {
    console.warn('Failed to clear session from localStorage:', e);
  }
}
