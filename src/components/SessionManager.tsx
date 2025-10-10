import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Plus, Clock } from 'lucide-react';
import { sessionManager, ConversationSession } from '@/lib/sessionManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SessionManagerProps {
  currentSessionId?: string;
  onSessionSelect: (sessionId: string | null) => void;
  onNewSession: () => void;
}

export function SessionManager({ currentSessionId, onSessionSelect, onNewSession }: SessionManagerProps) {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const data = await sessionManager.listSessions(10);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(sessionId: string) {
    if (!confirm('Delete this conversation?')) return;

    try {
      await sessionManager.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        onSessionSelect(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Recent Conversations
        </h3>
        <Button
          onClick={onNewSession}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No conversations yet. Start a new one!
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                currentSessionId === session.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {session.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {session.message_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.updated_at)}
                    </span>
                  </div>
                  {session.handshake_config && (
                    <div className="flex gap-1 mt-2">
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded">
                        {session.handshake_config.mode}
                      </span>
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded">
                        {session.handshake_config.stakes}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(session.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Delete conversation"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
