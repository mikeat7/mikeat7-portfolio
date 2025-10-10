import { useState, useEffect, useCallback } from 'react';
import {
  sessionManager,
  generateSessionTitle,
  getSessionFromLocalStorage,
  setSessionInLocalStorage,
  clearSessionFromLocalStorage,
  ConversationMessage,
  ConversationSession
} from '@/lib/sessionManager';

export interface UseConversationSessionResult {
  sessionId: string | null;
  messages: ConversationMessage[];
  session: ConversationSession | null;
  isLoading: boolean;
  createNewSession: (firstMessage?: string, handshakeConfig?: ConversationSession['handshake_config']) => Promise<string>;
  loadSession: (sessionId: string) => Promise<void>;
  addMessage: (role: ConversationMessage['role'], content: string, extras?: Partial<ConversationMessage>) => Promise<void>;
  clearSession: () => void;
  refreshMessages: () => Promise<void>;
}

export function useConversationSession(): UseConversationSessionResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedSessionId = getSessionFromLocalStorage();
    if (savedSessionId) {
      loadSession(savedSessionId).catch(console.error);
    }
  }, []);

  const createNewSession = useCallback(async (
    firstMessage?: string,
    handshakeConfig?: ConversationSession['handshake_config']
  ): Promise<string> => {
    try {
      setIsLoading(true);
      const title = firstMessage ? generateSessionTitle(firstMessage) : 'New Conversation';
      const newSessionId = await sessionManager.createSession(title, handshakeConfig);

      setSessionId(newSessionId);
      setSessionInLocalStorage(newSessionId);

      const newSession = await sessionManager.getSession(newSessionId);
      setSession(newSession);
      setMessages([]);

      return newSessionId;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    extras?: Partial<ConversationMessage>
  ): Promise<void> => {
    if (!sessionId) {
      throw new Error('No active session');
    }

    try {
      const newMessage = await sessionManager.addMessage(sessionId, role, content, extras);
      setMessages(prev => [...prev, newMessage]);

      const updatedSession = await sessionManager.getSession(sessionId);
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
    session,
    messages,
    isLoading,
    createNewSession,
    loadSession,
    addMessage,
    clearSession,
    refreshMessages
  };
}
