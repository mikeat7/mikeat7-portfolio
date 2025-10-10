# AWS Agent Session Memory - Competition Demo Guide

## Overview

Your AWS Bedrock Agent now has **persistent conversational memory** using Supabase. This demonstrates advanced agent capabilities beyond basic stateless interactions.

## Key Features

### 1. **Cross-Session Memory**
- Conversations survive page refreshes
- Resume chats from days/weeks ago
- View full conversation history

### 2. **Intelligent Session Management**
- Auto-generates titles from first message
- Tracks message count and last activity
- Stores handshake configuration per session

### 3. **Database-Backed Architecture**
- PostgreSQL storage via Supabase
- Row Level Security (RLS) enabled
- Auto-incrementing message counters
- Cascading deletes (session → messages)

---

## How It Works

### Architecture Flow

```
User sends message
       ↓
Frontend checks localStorage for session_id
       ↓
   ┌───┴────────────────┐
   │                    │
   No session_id    Has session_id
       ↓                ↓
  Create new        Load existing
  session in        messages from
  Supabase          Supabase
       ↓                ↓
       └────────┬───────┘
                ↓
   Send message + history to AWS Agent
                ↓
   Agent responds with context awareness
                ↓
   Save both user + assistant messages to Supabase
                ↓
   Display with full conversation context
```

### Database Schema

#### `conversation_sessions` Table
```sql
id                  uuid PRIMARY KEY
title               text (auto-generated from first message)
handshake_config    jsonb (mode, stakes, confidence, etc.)
created_at          timestamptz
updated_at          timestamptz (auto-updates on new messages)
message_count       integer (auto-increments via trigger)
metadata            jsonb (extensible for future features)
```

#### `conversation_messages` Table
```sql
id                  uuid PRIMARY KEY
session_id          uuid REFERENCES conversation_sessions
role                text (user | assistant | system | tool)
content             text (message content)
vx_frames           jsonb (VX detection results)
tool_traces         jsonb (fetch_url, etc.)
confidence_score    numeric (avg confidence of detections)
created_at          timestamptz
metadata            jsonb
```

---

## Usage Examples

### Frontend Integration

#### 1. Create a New Session
```typescript
import { sessionManager, generateSessionTitle } from '@/lib/sessionManager';

const firstMessage = "Analyze this political statement...";
const sessionId = await sessionManager.createSession(
  generateSessionTitle(firstMessage),
  {
    mode: '--careful',
    stakes: 'high',
    min_confidence: 0.7,
    cite_policy: 'force',
    omission_scan: true,
    reflex_profile: 'strict',
    codex_version: '0.9.0'
  }
);
```

#### 2. Add Messages to Session
```typescript
await sessionManager.addMessage(
  sessionId,
  'user',
  'What manipulation patterns do you see?'
);

await sessionManager.addMessage(
  sessionId,
  'assistant',
  'I detected 3 patterns: speculative authority...',
  {
    vx_frames: [...],
    confidence_score: 0.82
  }
);
```

#### 3. Resume Existing Session
```typescript
const session = await sessionManager.getSession(sessionId);
const messages = await sessionManager.getMessages(sessionId);

console.log(`Session: ${session.title}`);
console.log(`Messages: ${messages.length}`);
console.log(`Handshake: ${session.handshake_config.mode}`);
```

#### 4. List Recent Sessions
```typescript
const recentSessions = await sessionManager.listSessions(10);

recentSessions.forEach(session => {
  console.log(`${session.title} - ${session.message_count} messages`);
});
```

---

## Competition Value Proposition

### Why This Impresses Judges

#### 1. **Stateful Agent Architecture**
Most hackathon agents are stateless. This demonstrates:
- Long-term memory management
- Context preservation across sessions
- Production-ready conversation tracking

#### 2. **AWS + Database Integration**
Shows mastery of:
- AWS Bedrock for reasoning
- Supabase for persistence
- API Gateway orchestration
- Real-time data synchronization

#### 3. **Scalability Considerations**
- Indexed queries (session lookup, message ordering)
- Automatic cleanup (CASCADE deletes)
- RLS policies for security
- JSONB for flexible metadata

#### 4. **User Experience Excellence**
- Resume interrupted conversations
- Browse conversation history
- Delete unwanted sessions
- Visual session sidebar with metadata

---

## Demo Script for Video

### Part 1: Show Session Creation (30 sec)
1. Open app, start new conversation
2. Point out: "Notice no session history yet"
3. Paste text: "Experts unanimously agree climate action must happen now"
4. Send message → show agent analysis
5. **Refresh page** → conversation persists!

### Part 2: Show Multi-Turn Memory (45 sec)
1. Continue conversation: "What sources support this claim?"
2. Agent responds with context from previous message
3. Open session sidebar → show message count incrementing
4. Show handshake config stored with session

### Part 3: Show Session Management (30 sec)
1. Create second conversation with different text
2. Switch between sessions → full context preserved
3. Delete old session → cascading delete of messages
4. List sessions → ordered by recent activity

### Part 4: Technical Deep Dive (45 sec)
1. Show browser DevTools → Network tab
2. Point out: `/agent/chat` includes `sessionId`
3. Show Supabase dashboard → live message inserts
4. Explain: "AWS Agent + Supabase = stateful AI"

**Total: 2.5 minutes** (leaves 30 sec for title/credits)

---

## Testing Checklist

- [ ] Create new session → stores in Supabase
- [ ] Send message → increments message_count
- [ ] Refresh page → session persists
- [ ] Load session → messages in order
- [ ] Switch sessions → correct history loads
- [ ] Delete session → messages cascade delete
- [ ] Multi-tab → sessions sync
- [ ] Network error → graceful failure
- [ ] 10+ conversations → list pagination works

---

## Competitive Advantages

### vs. Stateless Agents
- **Them**: Every request starts from scratch
- **You**: Full conversation context, multi-turn reasoning

### vs. localStorage Only
- **Them**: Data lost if cache cleared, no cross-device
- **You**: Cloud-backed, accessible anywhere

### vs. Simple History Array
- **Them**: Memory stored in-memory, lost on crash
- **You**: Persistent database, crash-resistant

### vs. No Handshake Tracking
- **Them**: Can't replay with same settings
- **You**: Per-session configuration, reproducible

---

## Future Enhancements

1. **User Authentication**
   - Replace public RLS with user-scoped policies
   - Link sessions to auth.users table

2. **Search & Filter**
   - Full-text search across message content
   - Filter by handshake config (high stakes only)

3. **Export Functionality**
   - Download session as JSON/PDF
   - Share session via link

4. **Analytics Dashboard**
   - Most common manipulation patterns
   - Average confidence scores
   - Session length distribution

5. **Collaborative Sessions**
   - Share session with team members
   - Real-time collaboration

---

## Database Queries for Demo

### Show Recent Sessions
```sql
SELECT
  title,
  message_count,
  handshake_config->>'stakes' as stakes,
  updated_at
FROM conversation_sessions
ORDER BY updated_at DESC
LIMIT 5;
```

### Show Messages in Session
```sql
SELECT
  role,
  LEFT(content, 50) as preview,
  confidence_score,
  created_at
FROM conversation_messages
WHERE session_id = 'YOUR_SESSION_ID'
ORDER BY created_at ASC;
```

### Session Statistics
```sql
SELECT
  COUNT(*) as total_sessions,
  SUM(message_count) as total_messages,
  AVG(message_count) as avg_messages_per_session
FROM conversation_sessions;
```

---

## Deployment Notes

### Supabase Setup (Already Done ✅)
- [x] Tables created with migrations
- [x] RLS policies enabled
- [x] Triggers configured
- [x] Indexes added

### Environment Variables Required
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Frontend Changes
- [x] SessionManager component created
- [x] sessionManager utilities added
- [x] llmClient updated for session support
- [x] Types exported correctly

### Backend Changes (Optional)
Backend doesn't need changes - frontend handles persistence directly via Supabase client.

---

## Cost Analysis

### Supabase Free Tier
- 500MB database storage
- Unlimited API requests
- 50,000 monthly active users

### Estimated Usage
- Each session: ~500 bytes metadata
- Each message: ~1KB average
- 1,000 conversations × 10 messages = 10MB total

**Verdict**: Will stay free indefinitely for hackathon + demo use.

---

## Conclusion

This session persistence system demonstrates:
1. **Technical Depth** - Full-stack AWS + database integration
2. **User Value** - Conversations that persist and resume
3. **Production Quality** - RLS, indexes, error handling
4. **Scalability** - Cloud-native architecture

**Perfect for competition judging**: Shows you built a real product, not just a demo.
