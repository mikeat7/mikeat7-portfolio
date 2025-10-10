# Truth Serum + Clarity Armor — AWS Competition Submission

**Live Demo:** https://clarityarmor.com

---

## What We Built

**Truth Serum + Clarity Armor (TSCA)** is an AWS-powered autonomous AI agent that detects manipulation patterns in text using epistemic humility principles. The platform pairs **Amazon Bedrock's Claude 3.5 Sonnet** with a custom **VX Reflex Engine** (14 algorithmic pattern detectors) to create an AI that knows when language manipulates, misleads, or omits critical context—and more importantly, *admits when it's unsure*.

**Core Components:**

* **VX Reflex Engine**: 14 pattern detectors (omission, contradiction, speculative authority, emotional manipulation, false precision, vague generalization, etc.) with confidence scores and co-firing rules
* **Bedrock Agents Runtime**: Autonomous tool orchestration—agent decides when to fetch URLs, verify citations, or request clarification
* **Codex v0.9 Handshake Protocol**: Policy-governed behavior with `mode`, `stakes`, `min_confidence`, `cite_policy`, `omission_scan`, and `reflex_profile` parameters
* **Session Persistence** (Supabase PostgreSQL): Multi-turn conversational memory that survives page refreshes, enabling context-aware analysis
* **Dual Analysis Architecture**: Local VX scan (instant, client-side) + AWS agent reasoning (deep, autonomous) = fast + thorough

**How It Works:**

Paste an article, post, or abstract. We scan for persuasive patterns: emotional push, implied consensus, "experts say..." without names, absolute claims lacking evidence, missing context. When confidence falls below the stakes-dependent threshold, we hedge or ask rather than bluff. The handshake enforces citation policy and triggers omission scans when stakes are high.

**Mathematically:**

$$
\text{Decision} =
\begin{cases}
\text{Answer}, & \text{if } c \ge \tau(s)\\[2pt]
\text{Hedge/Ask}, & \text{if } c < \tau(s)\\
\end{cases}
$$

where $c$ is model confidence and $\tau(s)$ is a stakes-dependent threshold. Citations required when claims are external or confidence below policy.

---

## What We Added During Competition

This platform existed as a local pattern detector with basic Bedrock integration. **During the submission period**, we transformed it into a true autonomous agent:

**Key Enhancements:**

1. **Bedrock Agents Integration**: Autonomous tool orchestration with Lambda Action Groups (`fetch_url`, `analyze`, `chat`)—agent decides when to call tools, not hardcoded logic

2. **Session Persistence** (Supabase): Database-backed conversational memory with `conversation_sessions` and `conversation_messages` tables, Row Level Security, and auto-incrementing counters—conversations persist across refreshes

3. **Modular Backend** (TypeScript): Restructured with dedicated handlers (`chat.ts`, `analyze.ts`, `fetch_url.ts`), Bedrock SDK wrapper, HTML sanitization, proper error handling

4. **Netlify Edge Proxy**: Secure layer handling CORS, AWS credential injection, and request transformation—no client-side secrets

5. **AI-Powered Education Hub**: Epistemic Sandbox and Narrative Framing Analysis lessons with real-time assessment using VX reflexes + custom scoring (8 weighted criteria)

6. **Enhanced Codex Protocol**: Full policy governance—agent enforces confidence thresholds, citation requirements, and omission scans based on stakes

**Technical Metrics:** 4,000+ lines TypeScript/React/SQL, 15+ new files, 5 AWS services integrated, 2 database tables with RLS, comprehensive documentation with Mermaid diagrams, automated test scripts.

---

## How We Built It

**Architecture Stack:**

* **Frontend**: React 18 + Vite 7 + TypeScript 5.5, Tailwind CSS, 14 VX reflexes in `src/lib/vx/`
* **Edge Layer**: Netlify Functions (proxy + CORS)
* **AWS Core**: Bedrock Claude 3.5 Sonnet v2, Bedrock Agents Runtime, Lambda (Node.js 20), API Gateway (REST), CloudWatch (logs)
* **Data Layer**: Supabase PostgreSQL (session persistence)

**Handshake Contract (v0.9)** travels with every agent call:

```json
{
  "mode": "--careful",
  "stakes": "high",
  "min_confidence": 0.70,
  "cite_policy": "force",
  "omission_scan": true,
  "reflex_profile": "strict"
}
```

Reflex thresholds, context-decay rates, and failure semantics map to UI behavior—no silent failures. When confidence drops below threshold, the agent refuses or clarifies rather than asserting.

---

## What We Learned

**AI Awareness**: Understanding LLM behavior—its strengths (fluency, synthesis) and limitations (hallucination, overconfidence). Performance ≠ truth. Fluent outputs hide uncertainty; we must *show* confidence bands and demand evidence.

**Narrative-Driven Persuasion**: People respond to framing, consensus pressure, and rhetorical pull—not just factual accuracy. Systems must detect *how* language persuades, not only what's false.

**Operational Humility Scales**: Explicit thresholds, hedge/refuse semantics, and transparent confidence scores improve trust. Users prefer "I'm 68% confident, here's why" over "This is definitely true."

**Session Memory Matters**: Multi-turn context transforms agent capability. Without persistence, every interaction starts from zero. With database-backed sessions, the agent builds understanding across conversations.

---

## Challenges We Faced

**Video Integration Failure**: Third-party service (Tavus) collapsed mid-integration, forcing removal of demo artifacts and complete homepage/routing rebuild to realign with core mission.

**Token Loss Event**: Significant session reset required re-establishing memory and process discipline from written documentation—taught us to architect for resilience.

**Performance vs. Evidence Gates**: Keeping UI fast while enforcing citation requirements and omission scans. Solution: dual analysis (instant local VX + enriched agent results) with progressive disclosure.

**Session Persistence Complexity**: Designing schema that stores not just messages but VX frames, tool traces, and confidence scores as JSONB while maintaining query performance. Solution: indexed foreign keys, auto-incrementing counters via triggers, RLS policies for security.

---

## Why It Matters

**Clarity isn't cosmetic—it's safety.** Our goal isn't winning arguments; it's surfacing *what's doing the persuading* so you can decide for yourself. We reduce confident-sounding nonsense and elevate verifiable reasoning:

$$
\text{Trust} \propto \Pr(\text{evidence} \mid \text{claim}) \times \mathbb{1}[c \ge \tau(s)]
$$

**Real-World Impact:**

* **Media Literacy**: Detect manipulation in news, social posts, advertisements
* **Academic Research**: Analyze papers for omissions, speculative authority, citation laundering
* **Policy Analysis**: Surface framing bias, implied consensus, missing context
* **AI Safety**: Demonstrate epistemic humility—admit uncertainty rather than hallucinate confidently

**The Core Innovation**: Pairing autonomous AWS agents with algorithmic reflex checks creates AI that *knows when it doesn't know* and asks instead of bluffs. Not vibes-based detection—algorithmic thresholds with explainable rationale.

---

## Technical Differentiators

**vs. Basic LLM Wrappers:**
- **Them**: Prompt → response
- **Us**: Autonomous tools + policy governance + dual analysis

**vs. Sentiment Analysis:**
- **Them**: Positive/negative/neutral
- **Us**: 14 specific manipulation patterns with semantic understanding

**vs. Black-Box AI:**
- **Them**: "AI says this is false"
- **Us**: Structured frames with confidence, rationale, suggestions, evidence requirements

**vs. Stateless Agents:**
- **Them**: Every request starts fresh
- **Us**: Session memory, multi-turn context, resumable conversations

---

## Architecture Summary

```
User Input → Dual Analysis Path:
  1. Local VX Scan (instant) → Pattern frames
  2. AWS Agent Request → Netlify Proxy → API Gateway →
     → Bedrock Agents Runtime → Claude 3.5 Sonnet →
     → Autonomous tool calls (Lambda) → Enriched analysis

Results → Supabase (persist session) → Visual heatmap + frames → User
```

**AWS Services:**
1. Amazon Bedrock (Claude 3.5 Sonnet v2)
2. Amazon Bedrock Agents (autonomous orchestration)
3. AWS Lambda (action groups)
4. API Gateway (REST endpoints)
5. CloudWatch (monitoring)

**Documentation:** 6 comprehensive docs including Mermaid architecture diagrams, deployment guides, test scripts, and integration examples.

---

## The Bottom Line

**Truth Serum + Clarity Armor** demonstrates that AI agents can be both powerful and humble. By enforcing confidence thresholds, demanding citations, and surfacing omissions, we move from polished rhetoric toward honest reasoning.

**Less performance, more proof.** That's epistemic AI done right.

---

**Creator:** Mike Adelman
**Competition:** AWS AI Agent Hackathon 2025
**Live URL:** https://clarityarmor.com
**GitHub:** https://github.com/mikeat7/mikeat7-portfolio

**Last Updated:** 2025-10-09
