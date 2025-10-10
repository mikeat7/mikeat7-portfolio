/*
  # Conversation Sessions for AWS Agent Memory

  ## Purpose
  Enables persistent conversational memory across page refreshes and sessions.
  Stores multi-turn dialogue history for the AWS Bedrock Agent with full codex v0.9 handshake context.

  ## New Tables

  ### `conversation_sessions`
  Stores individual conversation sessions with metadata
  - `id` (uuid, primary key) - Unique session identifier
  - `title` (text) - Auto-generated or user-provided session title
  - `handshake_config` (jsonb) - Codex v0.9 handshake parameters (mode, stakes, etc.)
  - `created_at` (timestamptz) - Session creation timestamp
  - `updated_at` (timestamptz) - Last activity timestamp
  - `message_count` (integer) - Total messages in conversation
  - `metadata` (jsonb) - Additional context (user agent, tags, etc.)

  ### `conversation_messages`
  Stores individual messages within a conversation
  - `id` (uuid, primary key) - Unique message identifier
  - `session_id` (uuid, foreign key) - Links to conversation_sessions
  - `role` (text) - Message role: 'user', 'assistant', 'system', 'tool'
  - `content` (text) - Message text content
  - `vx_frames` (jsonb) - VX detection frames if applicable
  - `tool_traces` (jsonb) - Tool execution traces (fetch_url, etc.)
  - `confidence_score` (numeric) - Average confidence of detections
  - `created_at` (timestamptz) - Message timestamp
  - `metadata` (jsonb) - Additional context

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for demo/hackathon purposes
  - Full write access for all users (can be restricted later with auth)

  ## Indexes
  - Session lookup by created_at (recent sessions first)
  - Message lookup by session_id and created_at (conversation order)
*/

-- Create conversation_sessions table
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Conversation',
  handshake_config jsonb NOT NULL DEFAULT '{
    "mode": "--careful",
    "stakes": "medium",
    "min_confidence": 0.6,
    "cite_policy": "auto",
    "omission_scan": "auto",
    "reflex_profile": "default",
    "codex_version": "0.9.0"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create conversation_messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content text NOT NULL,
  vx_frames jsonb DEFAULT '[]'::jsonb,
  tool_traces jsonb DEFAULT '[]'::jsonb,
  confidence_score numeric(3,2),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_created_at 
  ON conversation_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_session_id 
  ON conversation_messages(session_id, created_at ASC);

-- Enable Row Level Security
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read/write for hackathon demo
-- NOTE: In production, restrict to authenticated users only

CREATE POLICY "Public can view all sessions"
  ON conversation_sessions FOR SELECT
  USING (true);

CREATE POLICY "Public can create sessions"
  ON conversation_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update sessions"
  ON conversation_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete sessions"
  ON conversation_sessions FOR DELETE
  USING (true);

CREATE POLICY "Public can view all messages"
  ON conversation_messages FOR SELECT
  USING (true);

CREATE POLICY "Public can create messages"
  ON conversation_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update messages"
  ON conversation_messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete messages"
  ON conversation_messages FOR DELETE
  USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session timestamp when messages added
CREATE TRIGGER update_session_timestamp
  BEFORE UPDATE ON conversation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-increment message_count
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversation_sessions
  SET message_count = message_count + 1,
      updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment count when message inserted
CREATE TRIGGER increment_session_message_count
  AFTER INSERT ON conversation_messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_message_count();
