
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

> If you changed `.env` or `.env.local`, restart `npm run dev`.

**Environment file** (`.env` - see `.env.example` for template):

```
# Supabase (auto-configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AWS Bedrock (REQUIRED for agent chat/summarize functions)
CLARITY_AWS_ACCESS_KEY_ID=your-access-key
CLARITY_AWS_SECRET_ACCESS_KEY=your-secret-key

# Optional: Frontend agent API base (leave empty for relative paths)
VITE_AGENT_API_BASE=
```

**IMPORTANT:** The AI agent requires AWS Bedrock credentials. Without these:
- The "Chat with Our Agent" tab will fail
- "Generate Report" will fail
- Local VX analysis (on the Analyze tab) works fine without AWS

Get AWS credentials from IAM Console with Bedrock permissions.

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

**Netlify Environment Variables:**

For production deploys, set these in Netlify Dashboard → Site Settings → Environment Variables:

- `CLARITY_AWS_ACCESS_KEY_ID` (required)
- `CLARITY_AWS_SECRET_ACCESS_KEY` (required)
- `VITE_SUPABASE_URL` (auto-configured by Bolt)
- `VITE_SUPABASE_ANON_KEY` (auto-configured by Bolt)

The Netlify functions need AWS credentials to call Bedrock. Without them, the agent features will fail with "AWS credentials not configured" errors.

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
