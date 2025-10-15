# TSCA Architecture Diagram (Submission Version)

This is the simplified, visual-friendly architecture diagram for hackathon submission.
For the complete technical documentation, see `ARCHITECTURE.md`.

---
```mermaid
graph TB
    subgraph users[" "]
        direction TB
        U[👤 User<br/>clarityarmor.com]
        style U fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    end

    subgraph frontend["🎨 FRONTEND LAYER"]
        direction TB
        UI[React + Vite + TypeScript<br/>Tailwind CSS]
        VX[VX Reflex Engine<br/>14 Pattern Detectors<br/>Local Client-Side Analysis]
        Codex[FRONT-END CODEX v0.9<br/>Policy Rules & Thresholds]

        UI --> VX
        VX --> Codex

        style UI fill:#fff3e0,stroke:#f57c00,stroke-width:2px
        style VX fill:#fff3e0,stroke:#f57c00,stroke-width:2px
        style Codex fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    end

    subgraph netlify["☁️ NETLIFY EDGE"]
        direction TB
        NF[Edge Functions<br/>agent-chat<br/>agent-summarize<br/>agent-fetch-url]

        style NF fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    end

    subgraph aws["🛡️ AWS CLOUD"]
        direction TB

        subgraph bedrock["Amazon Bedrock"]
            Claude[Claude 3.5 Sonnet<br/>Reasoning Engine]
            Guards[Bedrock Guardrails<br/>Safety Filters]
            Agent[Agents Runtime<br/>Tool Orchestration]
        end

        subgraph tools["Lambda Action Groups"]
            T1[fetch_url<br/>Web/PDF Ingest]
            T2[search_citations<br/>Fact Checking]
            T3[coi_scan<br/>Conflict Detection]
        end

        APIGW[API Gateway<br/>REST API]
        CW[CloudWatch<br/>Logs & Metrics]

        APIGW --> Claude
        Claude --> Guards
        Claude --> Agent
        Agent --> T1
        Agent --> T2
        Agent --> T3
        Claude --> CW

        style APIGW fill:#fff9c4,stroke:#f9a825,stroke-width:2px
        style Claude fill:#fff9c4,stroke:#f9a825,stroke-width:3px
        style Guards fill:#fff9c4,stroke:#f9a825,stroke-width:2px
        style Agent fill:#fff9c4,stroke:#f9a825,stroke-width:2px
        style T1 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        style T2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        style T3 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        style CW fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    end

    subgraph database["💾 SUPABASE"]
        direction TB
        DB[PostgreSQL Database<br/>conversation_sessions<br/>conversation_messages<br/>Session Persistence]
        style DB fill:#e0f2f1,stroke:#00897b,stroke-width:2px
    end

    subgraph output[" "]
        direction TB
        Report[📊 Analysis Report<br/>Heatmap + Frames<br/>Explainable Results]
        style Report fill:#e1f5ff,stroke:#0288d1,stroke-width:3px,color:#000
    end

    U -->|Submit Text + Handshake| UI
    Codex -->|Local Frames| Report
    UI -->|Agent Request| NF
    NF -->|Proxy + Auth| APIGW
    Claude -->|Structured Analysis| NF
    NF -->|Agent Frames| Report
    NF <-->|Save/Load Sessions| DB
    Report -->|Store Messages| DB
    Report -->|View Results| U

    style users fill:none,stroke:none
    style output fill:none,stroke:none
    style frontend fill:#fafafa,stroke:#757575,stroke-width:2px
    style netlify fill:#fafafa,stroke:#757575,stroke-width:2px
    style aws fill:#fafafa,stroke:#757575,stroke-width:2px
    style database fill:#fafafa,stroke:#757575,stroke-width:2px
    style bedrock fill:#fffde7,stroke:#f9a825,stroke-width:2px,stroke-dasharray: 5 5
    style tools fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,stroke-dasharray: 5 5
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
