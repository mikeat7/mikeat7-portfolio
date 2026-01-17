import { supabase, ConversationSession, ConversationMessage } from './supabaseClient';

export type { ConversationSession, ConversationMessage };

export interface SessionManager {
  createSession: (title?: string, handshakeConfig?: ConversationSession['handshake_config'], userId?: string) => Promise<string>;
  getSession: (sessionId: string) => Promise<ConversationSession | null>;
  listSessions: (limit?: number) => Promise<ConversationSession[]>;
  deleteSession: (sessionId: string) => Promise<void>;
  addMessage: (sessionId: string, role: ConversationMessage['role'], content: string, extras?: Partial<ConversationMessage>) => Promise<ConversationMessage>;
  getMessages: (sessionId: string) => Promise<ConversationMessage[]>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
}

export const sessionManager: SessionManager = {
  async createSession(title = 'New Conversation', handshakeConfig, userId?: string) {
    const defaultHandshake = {
      mode: '--careful' as const,
      stakes: 'medium' as const,
      min_confidence: 0.6,
      cite_policy: 'auto' as const,
      omission_scan: 'auto' as const,
      reflex_profile: 'default' as const,
      codex_version: '0.9.0',
    };

    // Include user_id in metadata for cross-session memory
    const metadata = userId ? { user_id: userId } : {};

    const { data, error } = await supabase
      .from('web_sessions')
      .insert({
        title,
        handshake_config: handshakeConfig || defaultHandshake,
        metadata,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    if (!data?.id) throw new Error('Session created but no ID returned');

    return data.id;
  },

  async getSession(sessionId: string) {
    const { data, error } = await supabase
      .from('web_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw new Error(`Failed to get session: ${error.message}`);
    return data as ConversationSession | null;
  },

  async listSessions(limit = 20) {
    const { data, error } = await supabase
      .from('web_sessions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to list sessions: ${error.message}`);
    return (data || []) as ConversationSession[];
  },

  async deleteSession(sessionId: string) {
    const { error } = await supabase
      .from('web_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw new Error(`Failed to delete session: ${error.message}`);
  },

  async addMessage(sessionId: string, role: ConversationMessage['role'], content: string, extras = {}) {
    const { data, error } = await supabase
      .from('web_messages')
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
      .from('web_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to get messages: ${error.message}`);
    return (data || []) as ConversationMessage[];
  },

  async updateSessionTitle(sessionId: string, title: string) {
    const { error } = await supabase
      .from('web_sessions')
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

// --- Cross-Session Memory System ---

const USER_ID_KEY = 'tsca_user_id';

/**
 * Get or create a persistent user ID for cross-session memory
 */
export function getUserId(): string {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch {
    // Fallback for SSR or localStorage unavailable
    return `anon_${Date.now()}`;
  }
}

/**
 * Get past sessions for a user (excluding current session)
 */
export async function getPastSessionsForUser(
  userId: string,
  currentSessionId?: string,
  limit = 5
): Promise<ConversationSession[]> {
  let query = supabase
    .from('web_sessions')
    .select('*')
    .eq('metadata->>user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (currentSessionId) {
    query = query.neq('id', currentSessionId);
  }

  const { data, error } = await query;

  if (error) {
    console.warn('Failed to get past sessions:', error.message);
    return [];
  }

  return (data || []) as ConversationSession[];
}

/**
 * Get key messages from past sessions for context injection
 */
export async function getCrossSessionContext(
  userId: string,
  currentSessionId?: string,
  maxMessages = 10
): Promise<{ summary: string; topics: string[]; messageCount: number }> {
  const pastSessions = await getPastSessionsForUser(userId, currentSessionId, 3);

  if (pastSessions.length === 0) {
    return { summary: '', topics: [], messageCount: 0 };
  }

  // Get messages from past sessions
  const sessionIds = pastSessions.map(s => s.id);
  const { data: messages, error } = await supabase
    .from('web_messages')
    .select('role, content, session_id, created_at')
    .in('session_id', sessionIds)
    .order('created_at', { ascending: false })
    .limit(maxMessages * 2); // Get more, will filter

  if (error || !messages?.length) {
    return { summary: '', topics: [], messageCount: 0 };
  }

  // Extract user questions and key topics
  const userMessages = messages
    .filter(m => m.role === 'user')
    .slice(0, maxMessages);

  const topics = userMessages
    .map(m => {
      // Extract first line or first 100 chars as topic
      const content = m.content.trim();
      const firstLine = content.split('\n')[0];
      return firstLine.length > 100 ? firstLine.slice(0, 97) + '...' : firstLine;
    })
    .filter((t, i, arr) => arr.indexOf(t) === i); // Dedupe

  // Build summary
  const sessionCount = pastSessions.length;
  const totalMessages = pastSessions.reduce((sum, s) => sum + (s.message_count || 0), 0);

  const summary = `This user has ${sessionCount} previous session(s) with ${totalMessages} total messages. Recent topics discussed: ${topics.slice(0, 5).join('; ')}`;

  return {
    summary,
    topics: topics.slice(0, 5),
    messageCount: totalMessages,
  };
}

/**
 * Build the cross-session context prompt injection
 */
export async function buildCrossSessionPrompt(
  userId: string,
  currentSessionId?: string
): Promise<string | null> {
  const context = await getCrossSessionContext(userId, currentSessionId);

  if (context.messageCount === 0) {
    return null; // First-time user, no context
  }

  return `[CROSS-SESSION CONTEXT]
You have interacted with this user before. Here is relevant context:
- ${context.summary}
- Previous topics: ${context.topics.join(', ')}
Use this context to provide more personalized, continuous assistance. Reference past topics naturally if relevant to the current question.
[END CROSS-SESSION CONTEXT]

`;
}

// --- Auto-Cleanup System ---

const CLEANUP_INTERVAL_KEY = 'tsca_last_cleanup';
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // Run cleanup at most once per day
const SESSION_MAX_AGE_DAYS = 90; // Delete sessions older than 90 days
const MAX_MESSAGES_PER_SESSION = 100; // Cap messages per session

/**
 * Check if cleanup should run (throttled to once per day)
 */
function shouldRunCleanup(): boolean {
  try {
    const lastCleanup = localStorage.getItem(CLEANUP_INTERVAL_KEY);
    if (!lastCleanup) return true;

    const elapsed = Date.now() - parseInt(lastCleanup, 10);
    return elapsed > CLEANUP_INTERVAL_MS;
  } catch {
    return false; // Don't run cleanup if localStorage unavailable
  }
}

/**
 * Mark cleanup as completed
 */
function markCleanupComplete(): void {
  try {
    localStorage.setItem(CLEANUP_INTERVAL_KEY, Date.now().toString());
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Delete sessions older than maxAgeDays
 */
export async function cleanupOldSessions(maxAgeDays = SESSION_MAX_AGE_DAYS): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

  const { data, error } = await supabase
    .from('web_sessions')
    .delete()
    .lt('updated_at', cutoffDate.toISOString())
    .select('id');

  if (error) {
    console.warn('Failed to cleanup old sessions:', error.message);
    return 0;
  }

  return data?.length || 0;
}

/**
 * Trim messages in a session to keep only the most recent ones
 */
export async function trimSessionMessages(
  sessionId: string,
  maxMessages = MAX_MESSAGES_PER_SESSION
): Promise<number> {
  // Get all message IDs ordered by creation
  const { data: messages, error: fetchError } = await supabase
    .from('web_messages')
    .select('id, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (fetchError || !messages || messages.length <= maxMessages) {
    return 0;
  }

  // Delete messages beyond the limit (keep newest)
  const idsToDelete = messages.slice(maxMessages).map(m => m.id);

  const { error: deleteError } = await supabase
    .from('web_messages')
    .delete()
    .in('id', idsToDelete);

  if (deleteError) {
    console.warn('Failed to trim session messages:', deleteError.message);
    return 0;
  }

  return idsToDelete.length;
}

/**
 * Run periodic cleanup (call on app init, throttled internally)
 */
export async function runPeriodicCleanup(): Promise<{
  ran: boolean;
  sessionsDeleted?: number;
}> {
  if (!shouldRunCleanup()) {
    return { ran: false };
  }

  try {
    const sessionsDeleted = await cleanupOldSessions();
    markCleanupComplete();

    if (sessionsDeleted > 0) {
      console.log(`Cleanup: removed ${sessionsDeleted} old session(s)`);
    }

    return { ran: true, sessionsDeleted };
  } catch (e) {
    console.warn('Cleanup failed:', e);
    return { ran: true, sessionsDeleted: 0 };
  }
}
