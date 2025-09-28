
```markdown
# HANDOFF — Truth Serum + Clarity Armor (TSCA)

**Purpose**: A 5-minute boot for any new collaborator or AI assistant.  
If you only read one file, read this.

---

## Project Quick Facts
- **App**: TSCA – Voice-free (text) epistemic analysis UI with VX reflex engine
- **Codex**: `src/data/front-end-codex.v0.9.json` (handshake & policies)
- **Frontend**: React + Vite + Tailwind, TypeScript
- **Agent (AWS)**: Lambda + API Gateway (Serverless Framework)
- **Production**: https://clarityarmor.com
- **Staging/Local**: `npm run dev` → http://localhost:5173

---

## Handshake Defaults (Codex v0.9)
The UI sends a **handshake** with each analysis request.

```

mode=--careful | --direct | --recap
stakes=low | medium | high
min_confidence ∈ [0,1] (floors via mode/stakes)
cite_policy=auto | force | off
omission_scan=auto | true | false
reflex_profile=default | strict | lenient
codex_version=0.9.0

````

UI toggles reflect these and show the **effective handshake line**.  
When in doubt, switch to `--recap`.

---

## Local Dev (Windows friendly)
```powershell
# Node
nvm use 20.19.0

# Install deps
npm install

# Start dev server
npm run dev  # http://localhost:5173
````

> If you changed `.env.local`, restart `npm run dev`.

**Environment file** (not committed):

```
.env.local
VITE_AGENT_API_BASE=https://<api-id>.execute-api.us-east-1.amazonaws.com
```

---

## AWS Agent (Lambda) — Deploy & Smoke Test

Backend lives in `backend/`.

Deploy:

```powershell
cd backend
npx serverless deploy --region us-east-1 --aws-profile clarityarmor
# note POST /agent/analyze URL printed at end
```

Smoke test (PowerShell):

```powershell
$base = "https://<api-id>.execute-api.us-east-1.amazonaws.com"
$body = @{
  input     = @{ text = "Experts say we must act now or never." }
  handshake = @{ mode="--careful"; stakes="medium" }
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri "$base/agent/analyze" -ContentType "application/json" -Body $body
```

Wire the UI:

```
VITE_AGENT_API_BASE=https://<api-id>.execute-api.us-east-1.amazonaws.com
```

---

## Build & Deploy (Netlify)

```powershell
npm run build
# Netlify auto-deploys main → https://clarityarmor.com
```

If you want to stop auto-publishing in Netlify, **Lock deploys**; you can still build without publishing.

---

## Files You’ll Look For

* UI entry: `src/main.tsx` (codex validate/init + telemetry)
* Handshake client: `src/lib/llmClient.ts`
* Local VX runner: `src/lib/analysis/runReflexAnalysis.ts`
* Analyze UI: `src/pages/analyze.tsx` (full handshake controls)
* Train page: `src/pages/train.tsx` (v0.8 + **FRONT-END CODEX v0.9** + handshakes)
* Report: `src/components/AnalysisReport.tsx`

Legacy reference (kept):

* `TRUTH_SERUM_STARTER_PACK.md` — background & narrative pack

---

## Release Checklist (fast)

* [ ] `npm run build` passes locally
* [ ] Analyze page: toggles produce sensible handshake line
* [ ] Agent smoke test returns frames
* [ ] Commit + push → Netlify green

---

## Known Sharp Edges

* If agent returns empty frames, UI automatically falls back to local VX.
* Big paste (papers) may need pagination and summarization agent (future).
* Citations/omission policy is handshake-driven; judges may expect links.

---

## Handoff Memo Template (paste into any new AI session)

```
Project: Truth Serum + Clarity Armor (TSCA)
Repo: https://github.com/mikeat7/mikeat7-portfolio
App: React/Vite/TS; Agent: AWS Lambda/APIGW (serverless)
Codex: src/data/front-end-codex.v0.9.json
Local: npm run dev (Node 20.19.0)
Agent base (.env.local): VITE_AGENT_API_BASE=...
Goal today: <bullet list>
Open tasks: <bullet list>
```

— End —
