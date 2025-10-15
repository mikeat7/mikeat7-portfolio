# Truth Serum + Clarity Armor (TSCA) — Architecture

## System Overview

**TSCA** is an AWS-powered AI agent that analyzes text for manipulation patterns, logical fallacies, and omissions using epistemic humility principles. The system combines a **VX Reflex Engine** (local pattern detection) with **AWS Bedrock Claude** (reasoning & autonomous tool use) to deliver transparent, policy-governed analysis.

**Live Deployment:** https://clarityarmor.com

---

## High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph User["👤 User Interface (clarityarmor.com)"]
        UI[React/Vite Frontend]
        Handshake[Handshake Controls<br/>mode: --direct | --careful | --recap<br/>stakes: low | medium | high<br/>min_confidence: 0-1]
        AnalyzePage[Analyze Page]
        Report[Analysis Report + Heatmap]
    end

    subgraph Frontend["🔍 VX Reflex Engine (Client-Side)"]
        LocalVX[Local Pattern Scanner]
        Reflexes[14 VX Reflexes:<br/>• Hallucination<br/>• Omission<br/>• Speculative Authority<br/>• False Precision<br/>• Emotional Manipulation<br/>• + 9 more]
        Codex[front-end-codex.v0.9.json<br/>Policies & Thresholds]
    end

    subgraph Netlify["☁️ Netlify Edge"]
        NetlifyFunc[Netlify Functions]
        AgentChat[/agent-chat.ts]
        AgentSummarize[/agent-summarize.ts]
        FetchURL[/agent-fetch-url.ts]
    end

    subgraph AWS["🛡️ AWS Cloud Infrastructure"]
        APIGW[API Gateway<br/>REST API]

        subgraph Bedrock["Amazon Bedrock"]
            Claude[Claude 3.5 Sonnet<br/>Reasoning Engine]
            Guardrails[Bedrock Guardrails<br/>Safety Filters]
            AgentRuntime[Agents Runtime<br/>Tool Orchestration]
        end

        subgraph Tools["Action Groups / Lambda Tools"]
            FetchLambda[fetch_url<br/>HTML/PDF Ingest]
            SearchCitations[search_citations<br/>External Verification]
            COIScan[coi_scan<br/>Conflict Detection]
        end

        subgraph Storage["Data Layer"]
            S3[S3 Bucket<br/>Document Cache]
            CloudWatch[CloudWatch Logs<br/>Telemetry & Traces]
        end
    end

    subgraph Supabase["💾 Supabase (PostgreSQL)"]
        Sessions[conversation_sessions<br/>Session Metadata]
        Messages[conversation_messages<br/>Message History]
        RLS[Row Level Security<br/>Public Policies]
    end

    %% User Flow
    UI --> Handshake
    Handshake --> AnalyzePage
    AnalyzePage --> Report

    %% Dual Analysis Path
    AnalyzePage -->|"1️⃣ Local VX Scan"| LocalVX
    LocalVX --> Reflexes
    Reflexes --> Codex
    Codex -->|Frames + Scores| Report

    AnalyzePage -->|"2️⃣ Agent Analysis"| NetlifyFunc
    NetlifyFunc --> AgentChat
    AgentChat -->|Proxy + Handshake| APIGW

    %% AWS Agent Flow
    APIGW --> Claude
    Claude <--> Guardrails
    Claude <--> AgentRuntime

    AgentRuntime -->|Tool Call| FetchLambda
    AgentRuntime -->|Tool Call| SearchCitations
    AgentRuntime -->|Tool Call| COIScan

    FetchLambda --> S3
    Claude --> CloudWatch

    %% Response Path
    Claude -->|Analysis Result| APIGW
    APIGW -->|Response| AgentChat
    AgentChat -->|Structured Frames| Report

    %% Session Persistence
    AgentChat <-->|Save/Load Messages| Sessions
    Sessions -->|1:N| Messages
    Report -->|Store Results| Messages

    %% Styling
    classDef userClass fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    classDef frontendClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef netlifyClass fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef awsClass fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    classDef toolClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef dbClass fill:#e0f2f1,stroke:#00897b,stroke-width:2px

    class UI,Handshake,AnalyzePage,Report userClass
    class LocalVX,Reflexes,Codex frontendClass
    class NetlifyFunc,AgentChat,AgentSummarize,FetchURL netlifyClass
    class APIGW,Claude,Guardrails,AgentRuntime awsClass
    class FetchLambda,SearchCitations,COIScan,S3,CloudWatch toolClass
    class Sessions,Messages,RLS dbClass
```

---

## Component Breakdown

### 1. Frontend Layer (React + Vite + TypeScript)

**Location:** `/src`

**Purpose:** User interface for submitting text, configuring handshakes, and viewing analysis results.

**Key Components:**
- **Analyze Page** (`src/pages/analyze.tsx`) — Main analysis interface with handshake controls
- **VX Reflex Engine** (`src/lib/vx/*`) — 14 local pattern-detection reflexes
- **Codex Runtime** (`src/lib/codex-runtime.ts`) — Loads and validates v0.9 policies
- **Analysis Report** (`src/components/AnalysisReport.tsx`) — Heatmap visualization

**Handshake Parameters:**
```json
{
  "mode": "--careful",
  "stakes": "medium",
  "min_confidence": 0.70,
  "cite_policy": "auto",
  "omission_scan": "auto",
  "reflex_profile": "default",
  "codex_version": "0.9.0"
}
```

**VX Reflexes (14 total):**
1. **Contradiction** (vx-co01) — Detects internal contradictions
2. **Hallucination** (vx-ha01) — Unverifiable claims
3. **Omission** (vx-os01) — Missing context or caveats
4. **Speculative Authority** (vx-ai01) — "Experts say" without names
5. **Perceived Consensus** (vx-pc01) — False "everyone agrees"
6. **False Precision** (vx-fp01) — Over-confident statistics
7. **Data-less Claim** (vx-da01) — Assertions without evidence
8. **Emotional Manipulation** (vx-em08/09) — Fear/urgency tactics
9. **Tone/Urgency** (vx-tu01) — "Act now or never"
10. **Ethical Drift** (vx-ed01) — Subtle value shifts
11. **Narrative Framing** (vx-nf01) — Biased story structure
12. **Jargon Overload** (vx-ju01) — Complexity as obfuscation
13. **False Options** (vx-fo01) — False dichotomies
14. **Vague Generalization** (vx-vg01) — Weasel words

---

### 2. Netlify Edge Functions

**Location:** `/netlify/functions`

**Purpose:** Serverless proxy layer between frontend and AWS, handling CORS, authentication, and request transformation.

**Functions:**
- **agent-chat.ts** — Proxies chat requests to AWS Bedrock with handshake injection
- **agent-summarize.ts** — Handles long-document chunking and summarization
- **agent-fetch-url.ts** — Fetches and cleans external URLs/PDFs

**Environment Variables Required:**
```bash
CLARITY_AWS_ACCESS_KEY_ID=<your-key>
CLARITY_AWS_SECRET_ACCESS_KEY=<your-secret>
CLARITY_BEDROCK_REGION=us-east-1
CLARITY_BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

---

### 3. AWS Bedrock Agent Core

**Service:** Amazon Bedrock

**Model:** Claude 3.5 Sonnet v2 (anthropic.claude-3-5-sonnet-20241022-v2:0)

**Purpose:** Central reasoning engine that:
1. Receives text + handshake parameters
2. Applies codex policies (min_confidence, cite_policy, omission_scan)
3. Autonomously calls tools when needed
4. Returns structured analysis frames
5. Supports conversational memory via session context

**Bedrock Guardrails Applied:**
- Content filters (hate, violence, sexual content)
- PII redaction (optional)
- Toxicity threshold enforcement
- Custom policy alignment with codex failure semantics

**Agent Prompt Architecture:**
```
System: You are a clarity analysis agent governed by FRONT-END CODEX v0.9.
Follow handshake parameters strictly:
- mode: {mode}
- stakes: {stakes}
- min_confidence: {min_confidence}
- cite_policy: {cite_policy}

When confidence < min_confidence, hedge or ask rather than assert.
Use tools autonomously when verification needed.
```

---

### 4. Supabase Session Persistence

**Service:** Supabase (PostgreSQL + REST API)

**Purpose:** Store conversational history and session metadata for multi-turn agent interactions.

**Schema:**

#### conversation_sessions
- `id` (uuid) — Session identifier
- `title` (text) — Auto-generated from first message
- `handshake_config` (jsonb) — Codex parameters for this session
- `message_count` (int) — Auto-incremented via trigger
- `created_at` / `updated_at` (timestamptz)
- `metadata` (jsonb) — Extensible context

#### conversation_messages
- `id` (uuid) — Message identifier
- `session_id` (uuid) — Foreign key to sessions
- `role` (text) — user | assistant | system | tool
- `content` (text) — Message text
- `vx_frames` (jsonb) — VX detection results
- `tool_traces` (jsonb) — Tool execution logs
- `confidence_score` (numeric) — Analysis confidence
- `created_at` (timestamptz)

**Features:**
- Row Level Security (RLS) enabled
- Public access policies (demo mode)
- Cascading deletes (session → messages)
- Auto-incrementing message counters
- Indexed for fast session/message queries

**Benefits:**
- Resume conversations after page refresh
- Multi-turn context for agent reasoning
- Browse conversation history
- Track analysis patterns over time

---

### 5. AWS Lambda Action Groups

**Deployment:** Serverless Framework (`backend/serverless.yml`)

**Region:** us-east-1

#### Tool 1: fetch_url
**Purpose:** Ingest external web pages or PDFs for analysis

**Process:**
1. Fetch URL content via HTTPS
2. Clean HTML (strip scripts, ads, navigation)
3. Extract main text using readability heuristics
4. Cache in S3 (optional)
5. Return plain text to Claude

**Input Schema:**
```json
{
  "url": "https://example.com/article",
  "format": "html | pdf"
}
```

#### Tool 2: search_citations
**Purpose:** Verify factual claims against external sources

**Process:**
1. Extract claim from text
2. Query knowledge base (AWS Kendra or external API)
3. Return supporting/contradicting sources
4. Inject citation policy enforcement

**Status:** Planned (Phase C)

#### Tool 3: coi_scan
**Purpose:** Detect potential conflicts of interest

**Process:**
1. Scan for funding disclosures
2. Identify author affiliations
3. Check for corporate sponsorships
4. Flag undisclosed relationships

**Status:** Planned (Phase C)

---

### 6. Data Flow Example

**Scenario:** User analyzes a news article with `--careful` mode, `stakes=high`

```
1. User Input:
   Text: "Experts unanimously agree climate action must happen now."
   Handshake: { mode: "--careful", stakes: "high", min_confidence: 0.70 }

2. Frontend VX Scan (Local):
   - Speculative Authority detected (0.75) → "Experts" unnamed
   - Perceived Consensus detected (0.80) → "unanimously agree"
   - Tone/Urgency detected (0.65) → "must happen now"
   → Returns 3 frames with line-level annotations

3. Netlify Proxy:
   - Injects AWS credentials
   - Forwards to Bedrock via API Gateway

4. Bedrock Claude Analysis:
   - Receives handshake: stakes=high requires min_confidence=0.75
   - Triggers omission_scan (auto at high stakes)
   - Confidence on "unanimous expert consensus" = 0.45 < 0.75
   - Calls fetch_url tool to check original source
   - Tool returns: Article cites 3 experts from one think tank
   - Claude conclusion: "Overgeneralization. Source = 3 experts, not consensus."

5. Response Synthesis:
   - Combines local VX frames + agent reasoning
   - Generates heatmap: High severity on lines 1-2
   - Omission flag: "Missing: source diversity, sample size, dissenting views"

6. User Report:
   - Visual heatmap with color-coded severity
   - Expandable frames with rationale
   - Suggested questions: "Who are these experts? What's the think tank's funding?"
```

---

## Technical Specifications

### Frontend Stack
- **Framework:** React 18 + Vite 7
- **Language:** TypeScript 5.5
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 7.6
- **Icons:** Lucide React

### Backend Stack
- **Cloud Provider:** AWS
- **Model:** Bedrock Claude 3.5 Sonnet
- **API:** API Gateway (REST)
- **Compute:** Lambda (Node.js 20)
- **Deployment:** Serverless Framework 3.x
- **Monitoring:** CloudWatch Logs + X-Ray

### Hosting
- **Frontend:** Netlify (auto-deploy from GitHub main branch)
- **Functions:** Netlify Edge Functions
- **API:** AWS API Gateway

---

## Key Design Principles

### 1. Epistemic Humility
The system prioritizes **clarity over confidence**. When uncertain, it asks rather than asserts.

**Example:** Instead of "This claim is false" → "This claim lacks verifiable sources. Confidence: 0.42. Suggested: request citations."

### 2. Policy-Driven Governance
Every analysis follows the **FRONT-END CODEX v0.9** handshake protocol:
- `min_confidence` thresholds prevent bluffing
- `cite_policy` enforces source requirements
- `omission_scan` surfaces missing context
- `reflex_profile` tunes sensitivity (default/strict/lenient)

### 3. Dual Analysis Path
- **Local VX (Client):** Fast, privacy-preserving pattern matching
- **Agent (Bedrock):** Deep reasoning with autonomous tool use

Users get immediate local results while agent analysis runs in background.

### 4. Explainability First
Every detection includes:
- **Score** (0-1 confidence)
- **Rationale** (why it triggered)
- **Context** (surrounding text)
- **Suggestion** (what to ask next)

No black-box verdicts.

### 5. Failure Semantics
When confidence falls below threshold:
- **Refuse:** "I can't analyze this safely. Reason: {X}"
- **Hedge:** "Low confidence. Here's what I know + what's needed."
- **Ask:** "To get this right, clarify {Y}."

Never fake certainty.

---

## Security & Privacy

### Data Handling
- **No persistent storage** of user-submitted text
- **S3 caching optional** (disabled by default)
- **CloudWatch logs** scrubbed of PII
- **Client-side VX** runs entirely in browser (no server required)

### AWS IAM Policies
Lambda execution role has minimal permissions:
```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel",
    "bedrock:InvokeAgent",
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents"
  ],
  "Resource": "*"
}
```

### Guardrails
Bedrock Guardrails enforce:
- No harmful content generation
- PII redaction in logs
- Rate limiting per user
- Cost controls (max tokens per request)

---

## Scalability Considerations

### Current Capacity
- **Frontend:** Netlify CDN (global edge)
- **API:** API Gateway (10,000 req/sec default)
- **Lambda:** Concurrent execution limit: 1000 (adjustable)
- **Bedrock:** Tokens per minute: 40,000 (Claude 3.5 Sonnet)

### Long-Document Strategy (Phase B)
For papers/reports >10,000 words:
1. **Chunk:** Split by headings or ~2,000 chars with 200-char overlap
2. **Parallel VX:** Run reflexes on each chunk independently
3. **Agent Summarize:** Claude generates per-section scoreboard
4. **Cluster Map:** Group similar frames (hallucination clusters, omission patterns)
5. **Progressive Disclosure:** Collapse low-severity sections by default

---

## Deployment Instructions

### Frontend (Netlify)
```bash
# Build locally
npm install
npm run build

# Auto-deploy (push to GitHub main branch)
git push origin main

# Manual deploy
netlify deploy --prod --dir=dist
```

### Backend (AWS Lambda)
```bash
cd backend

# Install dependencies
npm install

# Deploy to AWS
npx serverless deploy --region us-east-1 --aws-profile clarityarmor

# Note the API Gateway URL printed at end
# Example: https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

### Environment Setup
Create `.env.local` (never commit):
```bash
VITE_AGENT_API_BASE=https://your-api-gateway-url.amazonaws.com
CLARITY_AWS_ACCESS_KEY_ID=your-key
CLARITY_AWS_SECRET_ACCESS_KEY=your-secret
```

Update Netlify environment variables via Dashboard → Site Settings → Build & Deploy.

---

## Testing Strategy

### Unit Tests (Frontend)
- VX reflex logic (pattern detection)
- Codex handshake validation
- Score normalization

### Integration Tests
- Netlify function → AWS API Gateway flow
- Bedrock tool invocation (fetch_url)
- Response parsing and error handling

### E2E Tests
- User journey: paste text → configure handshake → view report
- Edge cases: empty input, malformed JSON, timeout handling

### Agent Smoke Test
```powershell
$base = "https://your-api.execute-api.us-east-1.amazonaws.com"
$body = @{
  input = @{ text = "Experts say AI will replace all jobs by 2025." }
  handshake = @{ mode="--careful"; stakes="high"; min_confidence=0.70 }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri "$base/agent/chat" `
  -ContentType "application/json" -Body $body
```

Expected: Returns frames for "Speculative Authority" + "False Precision"

---

## Monitoring & Observability

### CloudWatch Metrics
- Lambda invocation count
- Bedrock token usage
- Error rates by endpoint
- P95 latency

### Custom Telemetry
Every agent response includes:
```json
{
  "telemetry": {
    "mode": "--careful",
    "stakes": "high",
    "triggered_reflexes": ["speculative_authority", "false_precision"],
    "tools_called": ["fetch_url"],
    "context_age": 1200,
    "total_tokens": 3847
  }
}
```

### Alerts
- Lambda error rate >5% → PagerDuty
- Bedrock throttling → Scale request
- Cold start >3s → Provisioned concurrency

---

## Roadmap & Future Enhancements

### Phase D (Post-Hackathon)
- **Multi-model comparison:** Run same analysis through GPT-4, Gemini, Llama
- **Citation graph:** Visual network of source relationships
- **Browser extension:** Real-time analysis while reading
- **API for developers:** Public API with rate limiting

### Research Questions
- Can reflexes be fine-tuned per domain (medical vs. political)?
- How to balance sensitivity vs. false positives?
- Optimal handshake defaults for different user personas?

---

## AWS Services Used

### Primary Services (Active)

✅ **Amazon Bedrock** (Core AI)
- Model: Claude 3.5 Sonnet v2 (anthropic.claude-3-5-sonnet-20241022-v2:0)
- Agents Runtime for autonomous tool orchestration
- Guardrails for content safety and policy enforcement
- Used for: Text analysis, reasoning, conversational interactions

✅ **AWS Lambda** (Serverless Compute)
- Runtime: Node.js 20
- Action groups: fetch_url, analyze, chat handlers
- Stateless request processing
- Used for: Backend logic, tool execution

✅ **API Gateway** (REST API)
- Endpoint management for Bedrock agent communication
- CORS configuration
- Request/response transformation
- Used for: Frontend ↔ Bedrock bridge

✅ **CloudWatch** (Observability)
- Logs: Lambda execution traces, Bedrock API calls
- Metrics: Invocation counts, error rates, latency
- Dashboards: Real-time monitoring
- Used for: Debugging, performance analysis

✅ **IAM** (Security)
- Least-privilege execution roles
- Credential management via Netlify secrets
- Bedrock model access policies
- Used for: Secure service-to-service auth

### Supporting Services

✅ **Supabase** (Session Persistence)
- PostgreSQL database for conversation history
- REST API for session management
- Row Level Security (RLS) policies
- Used for: Multi-turn agent memory

🔜 **S3** (Planned)
- Document caching for fetch_url results
- Static asset storage

🔜 **Kendra** (Planned)
- Citation search knowledge base
- Source verification tool

### Service Architecture Summary

```
User Request
     ↓
Netlify Functions (proxy layer)
     ↓
API Gateway (AWS entry point)
     ↓
AWS Lambda (business logic)
     ↓
Bedrock Claude (AI reasoning)
     ↓
Supabase (session persistence)
     ↓
Response to User
```

---

## Hackathon Compliance Checklist

- ✅ Uses AWS Bedrock LLM (Claude 3.5 Sonnet)
- ✅ Demonstrates autonomous agent capabilities (tool calling)
- ✅ Integrates multiple AWS services (Bedrock, Lambda, API Gateway, CloudWatch)
- ✅ Shows reasoning and decision-making (handshake policy enforcement)
- ✅ Includes architecture diagram (this document)
- ✅ Public code repository (GitHub)
- ✅ Deployed and accessible (https://clarityarmor.com)
- ✅ Video demo planned (3 minutes, shows functioning agent)

---

## Repository Structure

```
/
├── src/                          # Frontend React application
│   ├── components/               # UI components
│   │   ├── AnalysisReport.tsx   # Heatmap visualization
│   │   └── AnalyzeEngine.tsx    # Core analysis UI
│   ├── lib/                      # Core logic
│   │   ├── vx/                   # 14 VX reflex modules
│   │   ├── codex-runtime.ts      # Codex policy loader
│   │   ├── llmClient.ts          # Bedrock API client
│   │   └── analysisPipeline.ts   # Orchestration
│   ├── pages/                    # Route components
│   │   ├── analyze.tsx           # Main analysis page
│   │   └── train.tsx             # Codex training page
│   └── data/                     # Static data
│       └── front-end-codex.v0.9.json  # Policy definitions
│
├── netlify/functions/            # Edge functions
│   ├── agent-chat.ts             # Bedrock chat proxy
│   ├── agent-summarize.ts        # Long-doc handler
│   └── agent-fetch-url.ts        # URL ingest
│
├── backend/                      # AWS Lambda backend
│   ├── handler.js                # Legacy handler (deprecated)
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── chat.ts           # Agent chat logic
│   │   │   └── fetch_url.ts      # URL fetching tool
│   │   └── lib/
│   │       ├── bedrock.ts        # Bedrock SDK wrapper
│   │       └── cleanHtml.ts      # HTML sanitization
│   └── serverless.yml            # Serverless Framework config
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── HANDOFF.md                # Quick-start guide
│   └── ASW-ENGINEERING.md        # Engineering plan
│
├── public/                       # Static assets
├── dist/                         # Build output
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
└── .env.example                  # Environment template
```

---

## Credits & Acknowledgments

**Creator:** Mike Adelman
**Competition:** AWS AI Agent Hackathon 2025
**Inspiration:** Harry Frankfurt's "On Bullshit" (1986)
**Codex Development:** Collaborative iteration with Claude (Anthropic), ChatGPT (OpenAI), and Grok (xAI)

**Core Philosophy:**
*"Clarity over confidence. Ask when unsure. Never bluff certainty."*

---

## Contact & Links

- **Live App:** https://clarityarmor.com
- **Repository:** https://github.com/mikeat7/mikeat7-portfolio
- **Creator:** Mike Filippi
- **License:** MIT (see LICENSE file)

---

**Last Updated:** 2025-10-09
**Codex Version:** 0.9.0
**Architecture Version:** 1.0
