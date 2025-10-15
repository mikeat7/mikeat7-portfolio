# TSCA Architecture Diagram (Submission Version)

This is the simplified, visual-friendly architecture diagram for hackathon submission.
For the complete technical documentation, see `ARCHITECTURE.md`.

---
flowchart TB
  %% ===== User Interface =====
  subgraph USER["👤 User Interface (clarityarmor.com)"]
    UI[React/Vite Frontend]
    Handshake[Handshake Controls (mode, stakes, min_confidence)]
    AnalyzePage[Analyze Page]
    AgentChatUI[Chat with Agent]
    Report[Analysis Report and Heatmap]
  end

  %% ===== Frontend VX Engine =====
  subgraph FRONTEND["🔍 VX Reflex Engine (Client-Side)"]
    LocalVX[Local Pattern Scanner]
    Reflexes[Reflex Library — 14 patterns (hallucination, omission, speculative authority, false precision, emotional manipulation, ...)]
    Codex[Codex v0.9 (policies and thresholds)]
  end

  %% ===== API Edge (AWS) =====
  subgraph AWS["🛡️ AWS API Edge"]
    APIGW[API Gateway /agent/*]
    subgraph LAM["AWS Lambda Handlers"]
      ChatFn[/backend/src/handlers/chat.ts (/agent/chat)/]
      AnalyzeFn[/backend/src/handlers/analyze.ts (/agent/analyze)/]
      FetchFn[/backend/src/handlers/fetch_url.ts (/agent/fetch-url)/]
    end
  end

  %% ===== Bedrock Models (split per endpoint) =====
  subgraph BEDROCK["Amazon Bedrock (On-Demand)"]
    Sonnet[Claude 3.5 Sonnet 20240620 — chat reasoning]
    Haiku[Claude 3 Haiku 20240307 — fast analysis]
    Guardrails[Guardrails (safety and policies)]
  end

  %% ===== Persistence & Observability =====
  subgraph DATA["💾 Persistence and Observability"]
    Supa[Supabase (sessions, messages, VX frames)]
    CW[CloudWatch Logs]
  end

  %% ===== User Flow =====
  UI --> Handshake
  Handshake --> AnalyzePage
  Handshake --> AgentChatUI
  AnalyzePage --> Report

  %% Dual path
  AnalyzePage -->|"1) Local scan"| LocalVX
  LocalVX --> Reflexes --> Codex -->|"Frames and scores"| Report

  %% Chat path
  AgentChatUI -->|"POST /agent/chat"| APIGW --> ChatFn --> Sonnet
  Sonnet <--> Guardrails
  ChatFn -. auto-tool on URLs .-> FetchFn
  FetchFn --> CW

  %% Analyze path (Bedrock-backed)
  AnalyzePage -->|"POST /agent/analyze"| APIGW --> AnalyzeFn --> Haiku
  Haiku <--> Guardrails

  %% Persistence
  ChatFn --> Supa
  AnalyzeFn --> Supa
  Report --> Supa
  ChatFn --> CW
  AnalyzeFn --> CW


---

## Key Technologies

### Frontend
- **React 18** + **Vite 7** + **TypeScript 5.5**
- **Tailwind CSS** for styling
- **14 VX Reflexes** for local pattern detection

### Backend (AWS)
- **Amazon Bedrock** - Claude 3.5 Sonnet LLM
- **Bedrock Agents** - Autonomous tool orchestration
- **AWS Lambda** - Serverless compute for action groups
- **API Gateway** - REST API endpoints
- **CloudWatch** - Monitoring and logs

### Edge Layer
- **Netlify Edge Functions** - Proxy & CORS handling

### Data Persistence
- **Supabase PostgreSQL** - Session memory & conversation history

---

## How It Works

1. **User submits text** with handshake parameters (mode, stakes, confidence thresholds)

2. **Dual Analysis Path:**
   - **Local VX Scan** (client-side): Instant pattern detection using 14 reflexes
   - **Agent Analysis** (AWS): Deep reasoning with autonomous tool use

3. **AWS Bedrock Agent:**
   - Applies codex policies (min_confidence, cite_policy, omission_scan)
   - Autonomously calls Lambda tools when verification needed
   - Enforces Guardrails for safety

4. **Lambda Action Groups:**
   - `fetch_url`: Ingest external web pages/PDFs
   - `search_citations`: Verify factual claims
   - `coi_scan`: Detect conflicts of interest

5. **Session persistence** (Supabase): All messages saved for multi-turn context

6. **Results combined** into visual heatmap with explainable frames

---

## Core Innovation

**Policy-Governed Epistemic Analysis**

Every analysis follows the FRONT-END CODEX v0.9 handshake protocol:
- When confidence < threshold → hedge or ask, never bluff
- Autonomous tool use for verification
- Explainable results with rationale for every detection
- Dual local + cloud analysis for speed + depth

**Live Demo:** https://clarityarmor.com

---

**Creator:** Mike Adelman
**Competition:** AWS AI Agent Hackathon 2025
**Last Updated:** 2025-10-09
