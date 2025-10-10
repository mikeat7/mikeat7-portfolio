# Session Persistence Integration Example

## Quick Start: Add to Agent Demo Page

Here's how to integrate session persistence into your agent demo page:

### 1. Import the Hook

```tsx
import { useConversationSession } from '@/hooks/useConversationSession';
import { SessionManager } from '@/components/SessionManager';
```

### 2. Use in Component

```tsx
export default function AgentDemo() {
  const {
    sessionId,
    session,
    messages,
    isLoading,
    createNewSession,
    loadSession,
    addMessage,
    clearSession
  } = useConversationSession();

  const [input, setInput] = useState('');

  async function handleSend() {
    if (!input.trim()) return;

    // Create session if none exists
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      activeSessionId = await createNewSession(input);
    }

    // Save user message to database
    await addMessage('user', input);

    // Call AWS Agent
    const response = await callAgentChat({
      messages: messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })),
      sessionId: activeSessionId
    });

    // Save agent response to database
    await addMessage('assistant', response.reply);

    setInput('');
  }

  return (
    <div className="flex gap-4">
      {/* Session Sidebar */}
      <aside className="w-64 border-r p-4">
        <SessionManager
          currentSessionId={sessionId}
          onSessionSelect={loadSession}
          onNewSession={clearSession}
        />
      </aside>

      {/* Chat Area */}
      <main className="flex-1">
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <div className="inline-block p-3 rounded bg-gray-100">
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button onClick={handleSend} className="px-6 py-2 bg-blue-600 text-white rounded">
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
```

### 3. Features Automatically Enabled

✅ **Auto-save**: Every message saved to Supabase
✅ **Auto-resume**: Page refresh loads last session
✅ **Session history**: Browse all past conversations
✅ **Handshake tracking**: Each session stores its config
✅ **Message count**: Automatically increments
✅ **Timestamps**: Track conversation timeline

---

## Alternative: Manual Integration

If you prefer direct control:

```tsx
import { sessionManager } from '@/lib/sessionManager';

// Create session
const sessionId = await sessionManager.createSession('My conversation');

// Add messages
await sessionManager.addMessage(sessionId, 'user', 'Hello');
await sessionManager.addMessage(sessionId, 'assistant', 'Hi there!');

// Load later
const messages = await sessionManager.getMessages(sessionId);
console.log(messages); // Full conversation history
```

---

## Test It

1. **Start conversation** → enters database
2. **Refresh page** → conversation loads
3. **Continue chatting** → context preserved
4. **Open DevTools** → see Supabase network calls
5. **Check Supabase Dashboard** → see live data

---

## Database Verification

Check data in Supabase:

```sql
-- View all sessions
SELECT id, title, message_count, created_at
FROM conversation_sessions
ORDER BY created_at DESC;

-- View messages in a session
SELECT role, content, created_at
FROM conversation_messages
WHERE session_id = 'YOUR_SESSION_ID'
ORDER BY created_at ASC;
```

---

## Competition Talking Points

**"Our agent has true conversational memory"**
- Not just in-memory context
- Persistent across sessions
- Database-backed for reliability

**"Resume conversations days later"**
- Show refresh persistence
- Show session switching
- Show history browsing

**"Production-ready architecture"**
- RLS security enabled
- Indexed for performance
- Auto-incrementing counters
- Cascading deletes

**"Scalable design"**
- PostgreSQL backend
- Cloud-native (Supabase)
- Free tier sufficient
- No vendor lock-in
