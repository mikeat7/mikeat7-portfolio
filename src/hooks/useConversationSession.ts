import { useState, useEffect, useCallback } from 'react';
import {
  sessionManager,
  generateSessionTitle,
  getSessionFromLocalStorage,
  setSessionInLocalStorage,
  clearSessionFromLocalStorage,
  getUserId,
  buildCrossSessionPrompt,
  ConversationMessage,
  ConversationSession
} from '@/lib/sessionManager';

export interface UseConversationSessionResult {
  sessionId: string | null;
  userId: string;
  messages: ConversationMessage[];
  session: ConversationSession | null;
  isLoading: boolean;
  crossSessionContext: string | null;
  createNewSession: (firstMessage?: string, handshakeConfig?: ConversationSession['handshake_config']) => Promise<string>;
  loadSession: (sessionId: string) => Promise<void>;
  addMessage: (role: ConversationMessage['role'], content: string, extras?: Partial<ConversationMessage>, overrideSessionId?: string) => Promise<void>;
  clearSession: () => void;
  refreshMessages: () => Promise<void>;
  refreshCrossSessionContext: () => Promise<void>;
}

export function useConversationSession(): UseConversationSessionResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crossSessionContext, setCrossSessionContext] = useState<string | null>(null);

  // Get persistent user ID
  const userId = getUserId();

  // Load saved session and cross-session context on mount
  useEffect(() => {
    const savedSessionId = getSessionFromLocalStorage();
    if (savedSessionId) {
      loadSession(savedSessionId).catch(console.error);
    }
    // Load cross-session context for returning users
    buildCrossSessionPrompt(userId, savedSessionId || undefined)
      .then(context => setCrossSessionContext(context))
      .catch(console.error);
  }, [userId]);

  const refreshCrossSessionContext = useCallback(async () => {
    const context = await buildCrossSessionPrompt(userId, sessionId || undefined);
    setCrossSessionContext(context);
  }, [userId, sessionId]);

  const createNewSession = useCallback(async (
    firstMessage?: string,
    handshakeConfig?: ConversationSession['handshake_config']
  ): Promise<string> => {
    try {
      setIsLoading(true);
      const title = firstMessage ? generateSessionTitle(firstMessage) : 'New Conversation';
      // Pass userId for cross-session tracking
      const newSessionId = await sessionManager.createSession(title, handshakeConfig, userId);

      setSessionId(newSessionId);
      setSessionInLocalStorage(newSessionId);

      const newSession = await sessionManager.getSession(newSessionId);
      setSession(newSession);
      setMessages([]);

      // Refresh cross-session context (excludes the new session)
      const context = await buildCrossSessionPrompt(userId, newSessionId);
      setCrossSessionContext(context);

      return newSessionId;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadSession = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const [loadedSession, loadedMessages] = await Promise.all([
        sessionManager.getSession(id),
        sessionManager.getMessages(id)
      ]);

      if (!loadedSession) {
        throw new Error('Session not found');
      }

      setSessionId(id);
      setSession(loadedSession);
      setMessages(loadedMessages);
      setSessionInLocalStorage(id);
    } catch (error) {
      console.error('Failed to load session:', error);
      clearSession();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMessage = useCallback(async (
    role: ConversationMessage['role'],
    content: string,
    extras?: Partial<ConversationMessage>,
    overrideSessionId?: string
  ): Promise<void> => {
    const targetSessionId = overrideSessionId || sessionId;
    if (!targetSessionId) {
      throw new Error('No active session');
    }

    try {
      const newMessage = await sessionManager.addMessage(targetSessionId, role, content, extras);
      setMessages(prev => [...prev, newMessage]);

      const updatedSession = await sessionManager.getSession(targetSessionId);
      if (updatedSession) {
        setSession(updatedSession);
      }
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  }, [sessionId]);

  const refreshMessages = useCallback(async (): Promise<void> => {
    if (!sessionId) return;

    try {
      const [updatedSession, updatedMessages] = await Promise.all([
        sessionManager.getSession(sessionId),
        sessionManager.getMessages(sessionId)
      ]);

      if (updatedSession) setSession(updatedSession);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  }, [sessionId]);

  const clearSession = useCallback(() => {
    setSessionId(null);
    setSession(null);
    setMessages([]);
    clearSessionFromLocalStorage();
  }, []);

  return {
    sessionId,
    userId,
    session,
    messages,
    isLoading,
    crossSessionContext,
    createNewSession,
    loadSession,
    addMessage,
    clearSession,
    refreshMessages,
    refreshCrossSessionContext
  };
}
