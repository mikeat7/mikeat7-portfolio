# ASW ENGINEERING PLAN v1.0 — Truth Serum + Clarity Armor

**Purpose**  
Harden the TSCA platform against spin, manipulation, and omission while meeting the AWS AI Agent Hackathon rules.

---

## 1. Scope
The ASW plan defines how the **codex v0.9** + **VX reflexes** integrate with an AWS Bedrock-based agent to deliver **transparent, reproducible, policy-driven analysis**.
**Required AWS tech target (for hackathon compliance):** Bedrock (Claude) + Agents/AgentCore, API Gateway + Lambda action group(s), Guardrails; optional Knowledge Bases (Kendra) for `search_citations`.

---

## 2. Objectives
- **Precision detection** — codex-governed reflex stack with enforced thresholds.
- **Explainability** — every frame includes rationale + omissions surfaced.
- **Governance** — handshakes (mode, stakes, min_confidence, cite, omission, reflex_profile).
- **Scalability** — long-doc mode (chunk, score, cluster, summarize).
- **Compliance** — deploy on Bedrock with AgentCore + Guardrails + action groups.

---

## 3. 20-Day Hackathon Roadmap

### Phase A (Days 1–5) — Agent Core v1
- Bedrock Claude as reasoning engine.  
- Action Group: `fetch_url` Lambda → HTML/PDF ingest + clean.  
- Guardrails tied to codex failure semantics.  
- Endpoint: `/agent/chat` (API GW + Lambda).  

### Phase B (Days 6–10) — Long-Doc Mode & Report
- Chunk input (headings or ~2k chars w/ overlap).  
- Run VX reflex stack per chunk.  
- Aggregate: per-section scoreboard + cluster map.  
- Report composer: “what’s wrong,” “what’s missing,” “what to ask next.”  

### Phase C (Days 11–15) — Autonomous Tools
- Add `search_citations` (KB + Lambda).  
- Add `coi_scan` (conflict-of-interest heuristics).  
- Optionally `compare_sources`.  
- Conversational autonomy demo: multi-tool plan execution.  

### Phase D (Days 16–20) — Polish & Submission
- Architecture diagram.  
- Demo video (~3 min).  
- Repo cleanup + docs/HANDOFF.md update.  
- Netlify + AWS deployed URLs tested.  

---

## 4. Reflex Prioritization (default profile)
1. contradiction (block_if_over 0.85)  
2. hallucination (block_if_over 0.80)  
3. omission  
4. speculative_authority  
5. perceived_consensus  
6. false_precision  
7. data_less_claim  
8. emotional_manipulation (suppressed if stakes=low)  
9. tone_urgency  
10. ethical_drift  

---

## 5. Deliverables
- **docs/ARCHITECTURE.png** (system diagram).  
- **/agent/chat** endpoint wired with codex handshake.  
- **AnalysisReport** with per-section heatmap.  
- **Telemetry**: `{mode, stakes, triggered_reflexes, tools_called}`.  
- **README** + reproducible SAM/Serverless deploy.  

---

## 6. Risks & Mitigations
- **Threshold drift** → unify thresholds in codex JSON.  
- **Over-flagging science** → early inquiry-protection pass.  
- **UX overwhelm** → collapse clusters by default; progressive disclosure.  

---

## 7. Submission Checklist
- [ ] Public repo, docs, deployed URL.  
- [ ] Video demo with tool traces.  
- [ ] Bedrock Agent + action groups live.  
- [ ] Handshake presets in UI.  
- [ ] Eligibility check (Canada OK, Quebec excluded).  
