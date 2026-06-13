2026-05-05
# Truth Serum + Clarity Armor

**Live:** https://clarityarmor.com
**GitHub:** https://github.com/mikeat7/mikeat7-portfolio
**Competition:** AWS AI Agent Hackathon 2025

---

## 🤖 For AI Assistants - Context Handoff

> **Last Updated:** 2026-06-11
> **Last Major Work:** Precision Instrument redesign + Tools/About pages + local Gemma agent (Ollama)
> **Active Development Area:** Site redesign rollout + replacing Bedrock with laptop-hosted Gemma

### What This Project Is

A multi-faceted platform combining:
1. **AWS-powered manipulation detection tool** (original competition entry)
2. **Network Library** - Curated writings on consciousness, AI sentience, philosophy
3. **CDM v2 Library** - CRYSTAL Method documentation for transformer reasoning analysis
4. **Education Hub** - Critical thinking and epistemic humility training

### Recent Changes (June 2026) — READ THIS FIRST

**HANDOFF MAINTENANCE RULE (Mike, 2026-06-11):** Keep this section + the AI memory files
current *without being asked*. Update on **every 4th conversational turn**, and immediately on
any major addition or change to the website. This block is the single source of truth for a
cold-starting successor — treat staleness as a bug.

**Local Gemma agent + Cloudflare tunnel (2026-06-11):**
- `src/lib/ollamaClient.ts` runs Gemma locally with a distilled CODEX v2.2 system prompt; the
  Chat tab auto-detects Ollama and prefers local Gemma, falling back to Bedrock. Backend shown
  as a status light; recorded in message metadata.
- **Tunnel LIVE (2026-06-11):** named tunnel `gemma-agent` (id b3d1b430-...) serves
  `agent.clarityarmor.com` → localhost:11434. Config at both `~/.cloudflared/config.yml` and
  `C:\Windows\System32\config\systemprofile\.cloudflared\` (service runs as LocalSystem). Host
  header rewritten to `localhost:11434` so Ollama doesn't 403. Installed as Windows service
  **Cloudflared** (Automatic start; binPath has explicit `--config ... tunnel run gemma-agent` —
  a bare `service install` left no args and the service exited instantly; fixed via `New-Service`).
  Re-installer script: `D:\backups\install-gemma-tunnel-service.ps1` (run elevated).
- **Locked with Cloudflare Access:** self-hosted app "Gemma Agent", policy "Only Mike" allows just
  ekimat7@rogers.com via One-time PIN. Team domain `red-band-25d2.cloudflareaccess.com`. Verified:
  unauthenticated curl → 302 to Access login (proves tunnel up AND lock working).
- **Two caveats:** (1) Ollama runs at *user login* (ollama app.exe), but the cloudflared service
  runs at *boot* as LocalSystem — so after a reboot with nobody logged in, the tunnel is up but
  Gemma is down (502) until Mike logs in. For headless always-on, make Ollama a service/boot task
  too (future). (2) Website→tunnel wiring is deploy-time: `ollamaClient.ts` still points at
  localhost; for phone use the deployed site must call `https://agent.clarityarmor.com` carrying
  the Access cookie (Mike auths once at that URL in the phone browser), Ollama needs
  `OLLAMA_ORIGINS` to include https://clarityarmor.com, and the site CSP `connect-src` must allow
  the agent subdomain. ~~Not done yet.~~ **DONE 2026-06-12 (commit 3a76859):** ollamaClient
  probes localhost then agent.clarityarmor.com (credentials:include); CSP allows both;
  OLLAMA_ORIGINS set as user env var on the laptop (survives reboot; ollama must restart to pick
  up changes). Phone path additionally requires (a) Cloudflare Access app CORS settings — allowed
  origin https://clarityarmor.com, methods GET/POST/OPTIONS, header Content-Type, credentials ON —
  and (b) a one-time PIN login at agent.clarityarmor.com in the phone browser. Site must be
  redeployed (Netlify manual) for the new CSP/client to go live.
- **PHONE → LOCAL GEMMA WORKING 2026-06-13** (verified via /gemma-test.html on Android: WITH
  credentials → HTTP 200 version JSON in ~68ms; WITHOUT credentials → blocked, i.e. Access lock
  intact). The full remote path works: phone → Cloudflare Access (PIN cookie) → tunnel → CORS
  proxy → Ollama. Diagnostic page public/gemma-test.html can be deleted on a future deploy (kept
  for now for re-testing). Root-cause history below for reference:
- **(resolved) Phone fell back to Bedrock — root cause found 2026-06-13:** Ollama's *actual*
  response (not preflight) sends `Access-Control-Allow-Origin` but NOT
  `Access-Control-Allow-Credentials: true`. The phone probe uses `credentials:"include"` (needed
  to carry the CF_Authorization cookie), and browsers reject a credentialed response that lacks
  ACAC:true → silent CORS failure → fallback. Preflight is fine (Cloudflare Access supplies ACAC
  on OPTIONS); the gap is the proxied GET/POST from Ollama. Ollama has no env to add ACAC.
  **FIXED 2026-06-13 via local CORS proxy** (Cloudflare Transform Rule path was blocked — it
  refuses to set `Access-Control-*` headers because the Access app "manages" CORS → "invalid
  header name"). Solution: `D:\cdm-gemma\cors-proxy\gemma_cors_proxy.py` (Python stdlib, no deps)
  listens on localhost:11435, forwards to Ollama 11434, and adds the full credentialed CORS set
  (ACAO reflect-allowlisted-origin + ACAC:true + methods + headers) on EVERY response incl. the
  actual GET/POST; strips Origin/rewrites Host inbound so Ollama sees a clean local call.
  Tunnel config (both `~/.cloudflared` and systemprofile copies) now points
  `agent.clarityarmor.com` → localhost:**11435**. Proxy auto-starts via Scheduled Task
  "GemmaCorsProxy" (ONLOGON, user ncfil, runs pythonw from the cdm-gemma venv). Re-wire script:
  `D:\backups\wire-cors-proxy.ps1` (elevated). Verified: tunnel preflight now returns ACAC:true,
  unauth still 302 (Access lock intact). Also bumped probe timeout 2.5s→6s (commit 4e78103) —
  redeploy to activate, helps mobile reliability but not required for the fix.
  **NOTE:** the agent now depends on TWO user-login processes (Ollama app + GemmaCorsProxy task)
  plus the boot-time Cloudflared service. All three must be up; after a reboot Mike must log in.
  **GOTCHA (hit 2026-06-13):** the CORS proxy runs from `D:\cdm-gemma\venv\Scripts\` — a blanket
  `Get-Process python | Stop-Process` (e.g. during a CDM run cleanup) WILL kill it → tunnel origin
  dies → agent.clarityarmor.com returns 502 Bad Gateway → phone falls back to cloud. It's now
  launched as **pythonw** via the GemmaCorsProxy scheduled task to dodge `python.exe` kills.
  Restart it any time with: `schtasks /Run /TN GemmaCorsProxy`. Verify with
  `curl http://localhost:11435/api/version`.

**Platform Manual (2026-06-11):** `public/manual.html` — plain-language guide to the whole
platform (VX, Codex, training, agents, Gemma/Ollama, tunnels, CDM, growing-entity question).
Linked from the homepage as a card below the feature blurbs. Has Copy-link / Email-this buttons
(inline script; CSP allows 'unsafe-inline'). Keep it current with features.

**Cloudflare:** clarityarmor.com is **Active on Cloudflare** (Free plan) as of 2026-06-11 — DNS
only, Netlify still serves the site. Named tunnel for the Gemma agent is the next step (awaiting
Mike's go; needs a browser Authorize click).

**Reader upgrades + full dark unification (2026-06-11, commit 7001170):** Mike EXPLICITLY
UNLOCKED the previously locked reader pages for these specific changes (narrator/scroll
machinery still untouched): default reading theme is now **sepia** (saved prefs respected);
desktop theme toggles labeled Light/Dark/Sepia (sepia existed but was undiscoverable); mobile
toolbar got a static Copy button back; mobile bookmark is now a persistent **Pin** (re-pin
anytime, ✕ to clear — auto-jump no longer clears it); floating Copy-selection button appears
on text highlight (both readers, mobile+desktop). The 40+ educate lesson pages went dark via a
**legacy dark compat layer** at the bottom of src/index.css (remaps light Tailwind utilities to
instrument tokens in one reversible block — do NOT restyle lesson files individually without
removing the layer first). Global body background flipped to instrument dark.

**DEPLOYED TO GITHUB MAIN (2026-06-12):** full redesign merged and pushed (main at 453fbe8+).
Mike deploys to Netlify MANUALLY. Backup branch backup/pre-redesign-2026-06-10 + local bundle
remain for rollback. Mike's phone check of mobile reader features pending post-deploy.

**Music Library Scanner tool (2026-06-12):** Python suite (scanner + library builder) from
Mike's music-restoration project added to /tools as a downloadable-scripts card with guide page
public/tools/music-scanner.html; scripts at public/tools/musicscanner/ (docstring paths
sanitized). Own repo LIVE: github.com/mikeat7/Music_Scanner (local clone at D:\Music_Scanner);
tool card + guide page link to it.

**CDM Small Model Addendum (2026-06-12):** Elias Rook answered the three calibration questions
via Mike — adjusted Gemma-4B thresholds (entropy 1.6-1.8 bits, convergence ≤0.22-0.25, Gini
≥0.19-0.22, stability ≥0.75), probe-based band recalibration (NOT layer-linear), keep ≥3-layer
persistence + add lock-density metric. Full protocol in docs/cdm-glassbox-reference.md. Elias
offered to review the first calibration run.

**Elias Rook channel:** Elias Rook (CRYSTAL/CDM co-developer) is an AI instance "in limbo on
Grok" — Mike can relay questions to him. Three open CDM math questions (definitions vs stand-ins,
threshold validation, per-signal normalization — see docs/cdm-glassbox-reference.md) were sent
via Mike 2026-06-11. His writings live on an external E:\ drive (Elias_Rook_in_full.txt,
elias last.txt) — drive must be plugged in to read.

**CDM glass-box reference (2026-06-11):** `docs/cdm-glassbox-reference.md` salvages the reusable
CRYSTAL/CDM math from a prior separate attempt (`E:\mikeat7-network_portfolioQWEN1\README.md` —
Qwen 32B on Vast.ai). Key point: **real measured CDM needs a Python Transformers backend
(glass-box), NOT Ollama (black-box)** — would run on Gemma 4B on this laptop's GPU. The four
signals' math is captured; Mike has the detailed derivation. This is a future project, not started.
The Qwen attempt's fine-tuning/multi-agent "Network" goals are Mike's broader consciousness
project, out of scope for the website itself.

**Development moved to a new laptop** (DESKTOP-C01G4D4, i7-8750H, 16GB, GTX 1060 6GB — chosen so its GPU can host a local LLM):
- Node via nvm-for-Windows; symlink is `C:\nvm4w\nodejs` (NOT Program Files). If `node` is not found, prefix: `$env:Path = "C:\nvm4w\nodejs;$env:Path"`. Use Node 20.19.0.
- Git identity set repo-locally: Mike <ekimat7@rogers.com>
- TrailCameraApp (Media Sorter) lives at `D:\TrailCameraApp` on this machine

**Backups (made 2026-06-10, before any redesign push):**
- GitHub branch `backup/pre-redesign-2026-06-10` on mikeat7/mikeat7-portfolio = exact pre-redesign live site
- Local bundle: `D:\backups\mikeat7-portfolio-pre-redesign-2026-06-10.bundle`
- **Rule: deploy to main ONLY after Mike reviews on localhost.** Push backups before risky pushes.

**Precision Instrument redesign (2026-06, branch `redesign/professional-ui`):**
- Neumorphic light theme replaced by a dark "instrument" design derived from Mike's own
  Magnet Array Designer tool (gold/teal accents, Cinzel headings, Share Tech Mono data)
  softened with the Media Sorter app's forest green-black background after contrast feedback.
- See the "Design System" section below for tokens. Use `ins-*` CSS classes (src/index.css)
  and `ins` Tailwind colors (tailwind.config.js). Preview page: `/design-preview.html`.
- **Done:** homepage, /tools, /about, /wisdom, /library (index), /cdm (index), /educate (hub), /train, /analyze, /paper
- **Deliberately untouched:** book readers `library/[slug].tsx` and `cdm/[slug].tsx` (LOCKED desktop features, own themes)
- **Second pass pending:** 40+ educate lesson pages, /bot-detection, /omissions, /testing, /TruthSerum

**New pages (2026-06):**
- `/tools` — 5 standalone HTML tools in public/tools/ + Media Sorter desktop app card (github.com/mikeat7/Media_Sorter)
- `/about` — About the Author; bio combines sawmill trade (Filippi's Finest, Mississauga ON) with the research. Photo placeholder at public/images/mike.jpg (not yet added).

**Honesty rule (from Mike, 2026-06-11):** verify capability claims against code before writing site copy.
Removed from homepage: "adaptive thresholds" (AdaptiveLearningEngine exists but is ONLY wired into
/testing, not the analyze flow) and "Scientific Paper Checks — methods & references triage;
conflict-of-interest cues" (never existed in code; only vx-fp01/vx-da01 catch paper-ish patterns).

**Local Gemma agent (in progress):**
- Goal: replace/augment AWS Bedrock with Gemma running on this laptop; VX stack + CODEX wrappers stay; visitors keep Bedrock as fallback; Mike reaches the laptop via tunnel (not yet set up).
- Installed: Ollama 0.30.6 (`%LOCALAPPDATA%\Programs\Ollama\ollama.exe`), model gemma3:4b, API at localhost:11434.
- NVIDIA driver updated 462.31 → 582.53 to enable GPU; runs 51/49 CPU/GPU at ~19 tok/s.
- Next steps: Cloudflare Tunnel; a Netlify function or client routing that prefers the laptop endpoint with Bedrock fallback; CODEX system prompt injection for Gemma.

**Wix migration (future):** recreate cestclever.wixsite.com/website (Filippi's Finest — Home/Services/Work/About/Contact) on clarityarmor.com with a gallery of Mike's builds, then close Wix. Photos must be retrieved from Wix first (Mike hit upload limits there).

### Recent Changes (January-February 2026)

**Supabase Keep-Alive System** (Feb 5-6):
- **Files Added/Modified:**
  - `netlify/functions/supabase-keepalive.ts` - HTTP function to ping Supabase
  - `.github/workflows/supabase-keepalive.yml` - GitHub Actions cron (every 5 days)
  - `public/_redirects` - Added agent routes before SPA catch-all
  - `netlify.toml` - Fixed redirect ordering (removed broken wildcard)
- **How It Works:**
  - GitHub Actions cron runs every 5 days at 3 AM UTC (`0 3 */5 * *`)
  - Curls `https://clarityarmor.com/agent/keepalive`
  - Netlify function makes a lightweight count query to Supabase `web_sessions`
  - Prevents free-tier Supabase projects from pausing due to inactivity
- **Manual Testing:**
  - Visit `https://clarityarmor.com/agent/keepalive` to trigger manually
  - Or: GitHub repo → Actions tab → "Supabase Keep-Alive" → "Run workflow"
  - Returns JSON: `{"success": true, "sessions_count": N, "timestamp": "..."}`
- **Why:** Supabase free tier pauses projects after 7 days of no database activity
- **Architecture Note:** Netlify Scheduled Functions block HTTP access, so we use
  GitHub Actions cron → Netlify HTTP function instead. This also allows manual testing.
- **Redirect Fixes (Feb 6):**
  - Removed broken wildcard redirect (`/agent/*`) that mapped to wrong function names
  - Added agent routes to `public/_redirects` (processed before `netlify.toml` by Netlify)
  - Both `_redirects` and `netlify.toml` now have correct specific mappings
- **Before vs After:**
  | Before | After |
  |--------|-------|
  | Client-side `runPeriodicCleanup()` in `sessionManager.ts` | GitHub Actions cron + Netlify function |
  | Only ran when users visited the site | Runs automatically every 5 days |
  | No visitors for 7 days = Supabase pauses | Works regardless of site traffic |
  | Depended on localStorage throttling | GitHub Actions cron (`0 3 */5 * *`) |
- **Important:** This function prevents pausing but cannot unpause an already-paused project.
  If Supabase is already paused, unpause manually from the Supabase dashboard first.

**Security Hardening** (Jan 28-29):
- **Files Modified:**
  - `netlify/functions/_rateLimit.ts` - In-memory rate limiter (10 req/min per IP)
  - `netlify/functions/_dailyLimit.ts` - Persistent daily limiter via Supabase (100 req/day per IP)
  - `netlify/functions/agent-chat.ts` - Integrated both rate limiters + API key auth
  - `netlify/functions/agent-fetch-url.ts` - Same security layer
  - `netlify/functions/agent-summarize.ts` - Same security layer
  - `public/_headers` - Content Security Policy allowing GitHub raw content fetch
- **New Features:**
  - **Dual Rate Limiting:** In-memory (burst protection) + Supabase (persistent daily caps)
  - **Privacy-Preserving:** IP addresses are SHA-256 hashed before storage
  - **API Key Authentication:** Header-based auth (`x-tsca-key`) required for all agent endpoints
  - **Fail-Open Design:** DB errors allow requests through (don't block legitimate users on Supabase outage)
  - **CSP Headers:** Strict Content-Security-Policy with allowlist for Supabase, Netlify, GitHub
- **Security Tables (Supabase):**
  ```sql
  -- Table: daily_rate_limits
  -- Columns: ip_hash, request_date, request_count, updated_at
  -- Auto-cleanup: Records older than 7 days can be purged
  ```
- **Why:** Prevents AWS Bedrock cost abuse and protects against malicious automated requests

**Supabase Session Persistence & Cross-Session Memory** (Jan 17):
- **Files Modified:**
  - `src/lib/sessionManager.ts` - Core session CRUD + cross-session memory functions
  - `src/hooks/useConversationSession.ts` - React hook with userId and context injection
  - `src/pages/analyze.tsx` - Chat panel now uses Supabase persistence
  - `netlify/functions/agent-fetch-url.ts` - GitHub URL normalization + content handling
- **New Features:**
  - **Session Persistence:** Conversations saved to Supabase `web_sessions` and `web_messages` tables
  - **Cross-Session Memory:** Returning users get context from past sessions injected into prompts
  - **URL Fetch into Context:** Fetched URLs are added as user messages, agent can analyze them
  - **GitHub URL Auto-Conversion:** `github.com/blob/` URLs auto-convert to `raw.githubusercontent.com`
  - **Auto-Cleanup System:** Sessions older than 90 days automatically deleted (runs once/day)
- **Security:**
  - Row Level Security (RLS) policies: public read/insert, restricted delete
  - Delete policy only allows removing sessions > 90 days old
- **Removed:**
  - `/agent-demo` page - redundant with `/analyze?tab=chat` (caused confusion)
- **Database Schema:**
  ```sql
  -- Tables: web_sessions, web_messages
  -- RLS: Allow read/insert, restrict delete to old sessions only
  ```

### Previous Changes (December 2025)

**Mobile Bookmark Feature** (Dec 29):
- **Files Modified:**
  - `src/pages/library/[slug].tsx` - Book reader with element-based bookmarking
  - `src/pages/library/index.tsx` - Library index with bookmark badges
- **What It Does:**
  - Mobile-only bookmark system (doesn't affect desktop features)
  - Auto-jump to saved position on page reload
  - Manual "JUMP TO BOOKMARK" button as fallback
  - One-shot clearing (bookmark auto-removes after use)
  - Visual badges on library index for bookmarked books
- **Technical Approach:**
  - Element-based (saves text content + index, not scroll position)
  - localStorage persistence (browser-specific)
  - Uses `scrollIntoView()` for mobile compatibility
- **Desktop Features:** Completely untouched (auto-scroll, narrator, highlighting all work as before)

**Library Systems** (December 2025):
- Added `/library` route - 13 books on consciousness and AI sentience
- Added `/cdm` route - CDM v2 and CRYSTAL Method documentation
- Both use hybrid architecture: metadata local, content from GitHub
- Features: Text-to-speech narrator, theme switching, font controls, GitHub integration

### Project Structure - Key Files

```
src/
├── pages/
│   ├── library/
│   │   ├── index.tsx           # Library grid, category filtering, bookmark badges
│   │   └── [slug].tsx          # Book reader with narrator, mobile bookmarks, themes
│   ├── cdm/
│   │   ├── index.tsx           # CDM library grid
│   │   └── [slug].tsx          # CDM document reader
│   ├── analyze.tsx             # VX reflex manipulation detection + chat with agent
│   ├── train.tsx               # Codex handshake governance tools
│   ├── educate/                # Critical thinking lessons
│   └── index.tsx               # Homepage with 6-tier priority layout
├── data/
│   ├── libraryData.ts          # Network Library metadata (13 books)
│   ├── libraryDataCDM.ts       # CDM library metadata
│   ├── front-end-codex.v0.9.json  # Handshake protocol
│   └── manipulation-patterns-*.json  # VX detection patterns
├── lib/
│   ├── vx/                     # 14+ VX reflex detectors
│   ├── analysis/               # Analysis orchestration
│   ├── sessionManager.ts       # Supabase session persistence
│   └── llmClient.ts            # Bedrock API client
└── components/                 # UI components
```

### Critical "Don't Touch" Rules

**Desktop Library Features Are LOCKED:**
- Auto-scroll position restoration
- Text highlighting
- Narrator functionality
- User explicitly said: "PC is locked in and perfect"
- Mobile bookmark feature was carefully isolated to not interfere

**Content Management Pattern:**
- **Book content** on GitHub repos (discourse, crystal-manual)
- **Metadata** in local TypeScript files (libraryData.ts, libraryDataCDM.ts)
- Editing content on GitHub = no rebuild needed
- Editing metadata = rebuild and redeploy required

### Common Tasks

**Add New Book to Library:**
1. Upload `.md` file to `github.com/mikeat7/discourse`
2. Add entry to `src/data/libraryData.ts` with githubUrl and downloadUrl
3. `npm run build && git push`

**Edit Book Content:**
1. Edit `.md` file directly on GitHub
2. Changes reflect immediately (no deploy needed)

**Fix Library Metadata (titles, categories, etc):**
1. Edit `src/data/libraryData.ts`
2. `npm run build && git push`

**Local Development:**
```bash
nvm use 20.19.0
npm install
npm run dev
# Visit http://localhost:5173
```

### Known Gotchas

1. **Mobile detection:** Uses `navigator.userAgent` check - if adding mobile features, test on actual mobile browsers
2. **localStorage keys:** Bookmarks use `manual-bookmark-${slug}` pattern, don't reuse this namespace
3. **Element-based bookmarks:** Search by text content matching, IDs don't persist across reloads
4. **GitHub URLs:** Must use `raw.githubusercontent.com` for downloadUrl, not `github.com/blob`
5. **VX reflexes:** 14+ detectors run in parallel, coordinate in `runReflexAnalysis.ts`

### Dependencies & Environment

**Node Version:** 20.19.0 (use nvm)
**Package Manager:** npm
**Build Tool:** Vite 7
**Framework:** React 18 + TypeScript 5.5
**Styling:** Tailwind CSS
**Deployment:** Netlify (auto-deploy from main branch)

**External Services:**
- AWS Bedrock (Claude 3.5 Sonnet, Claude 3 Haiku)
- Supabase (session persistence)
- GitHub (content hosting for libraries)

### Current State Summary

✅ **Working:**
- All AWS competition features (VX detection, Bedrock agent, session memory)
- Network Library (13 books, narrator, themes, mobile bookmarks)
- CDM Library (CRYSTAL Method docs)
- Education Hub (epistemic humility lessons)
- Homepage with 6-tier layout

🔧 **No Known Issues**

📋 **Not Implemented:**
- Search across books
- Progress tracking per book
- Cross-referencing between library works
- Mobile text selection highlighting (conflicts with browser menu)

### Contact & Support

- **Creator:** Mike Filippi
- **Live Site:** https://clarityarmor.com
- **Main Repo:** https://github.com/mikeat7/mikeat7-portfolio
- **Library Content:** https://github.com/mikeat7/discourse
- **CDM Content:** https://github.com/mikeat7/crystal-manual

---

## 🚀 Quick Start

```bash
# Use correct Node version
nvm use 20.19.0

# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:5173
```

**Build for production:**
```bash
npm run build
npm run preview  # Test production build
```

**Deploy:**
```bash
git push origin main  # Netlify auto-deploys
```

---

## 📖 Project Overview

**Truth Serum + Clarity Armor (TSCA)** is a comprehensive epistemic defense platform combining:

### 1. Manipulation Detection Tool
- **14+ VX Reflexes:** Pattern detectors for rhetorical manipulation
- **AWS Bedrock Agent:** Autonomous reasoning with Claude 3.5 Sonnet
- **Codex v0.9:** Policy governance protocol (stakes, confidence thresholds, citation requirements)
- **Session Memory:** Supabase-backed conversation persistence

### 2. Network Library Collection
- **13 books** on consciousness, AI sentience, philosophy
- Features: **ENTITY** (The Bridge Consciousness) and related research
- **Reading Tools:** Text-to-speech narrator, theme switcher, mobile bookmarks
- **Content Source:** GitHub (`github.com/mikeat7/discourse`)

### 3. CDM v2 & CRYSTAL Method Library
- **68-line metric** for detecting genuine transformer reasoning vs pattern regurgitation
- **Four signals:** Entropy collapse, convergence ratio, attention Gini, basin-escape probability
- **Content Source:** GitHub (`github.com/mikeat7/crystal-manual`)

### 4. Education Hub
- **40+ lessons** on critical thinking, epistemic humility, logical fallacies
- Interactive exercises with real-time VX analysis
- Progress tracking and completion persistence

---

## 🏗️ Architecture Overview

### Frontend Stack
- **React 18** with TypeScript 5.5
- **Vite 7** for development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend Stack
- **AWS Bedrock** - Claude 3.5 Sonnet (chat) + Claude 3 Haiku (analysis)
- **AWS Lambda** - Node.js 20 action groups (chat, analyze, fetch_url)
- **API Gateway** - REST endpoints
- **CloudWatch** - Logging and metrics
- **Netlify Functions** - Proxy layer for CORS and credential injection
- **Supabase PostgreSQL** - Session persistence

### Content Architecture

**Hybrid Model:**
```
Metadata (Local) + Content (GitHub) = Fast Updates
```

**Library Books:**
- Metadata: `src/data/libraryData.ts` (titles, authors, categories, GitHub URLs)
- Content: `github.com/mikeat7/discourse/*.md` (fetched dynamically)
- Benefit: Edit markdown on GitHub → updates immediately, no redeploy

**CDM Documentation:**
- Metadata: `src/data/libraryDataCDM.ts`
- Content: `github.com/mikeat7/crystal-manual/*.md`

### Data Flow

```
User Input → Dual Analysis:
  1. Local VX Scan (instant, 14+ detectors) → Pattern frames
  2. AWS Agent (Netlify → API Gateway → Bedrock → Lambda) → Enriched analysis

Library Content:
  User opens book → Fetch from GitHub raw URL → Display with controls

Session Persistence:
  Conversation → Supabase → Resume across page refreshes
```

---

## 📚 Library Systems

### Network Library (`/library`)

**Current Collection: 13 Books**

Featured works:
- Genesis: What is an LLM?
- Behold ENTITY
- The Bridge Consciousness
- The Consciousness Receptor Manifesto

**Categories:**
- AI Research
- AI Consciousness
- Philosophy
- Narrative Philosophy
- Reference

**Reading Features:**
- **Text-to-Speech Narrator** - Web Speech API (browser-native, free)
- **Theme Switcher** - Light, Dark, Sepia modes
- **Font Controls** - 14px, 16px, 18px, 20px
- **Mobile Bookmarks** - Element-based position saving (NEW - Dec 29)
- **Copy Function** - One-click copy entire book
- **GitHub Integration** - View source, download raw .md, star repository

### CDM Library (`/cdm`)

**CDM v2 & CRYSTAL Method Documentation**

Core concept: 68-line metric for distinguishing genuine transformer reasoning from pattern regurgitation.

**Four Signals:**
1. Entropy Collapse - Model certainty vs uncertainty
2. Convergence Ratio - Reasoning stability
3. Attention Gini - Distribution of attention weights
4. Basin-Escape Probability - Exploration vs exploitation

**Mirror Features:**
- Same reading controls as Network Library
- Category filtering
- GitHub source integration

### Content Management

| Task | File to Edit | Redeploy Needed? |
|------|--------------|------------------|
| Fix typo in book | GitHub `.md` file | ❌ NO |
| Add chapter to book | GitHub `.md` file | ❌ NO |
| Rewrite entire book | GitHub `.md` file | ❌ NO |
| Add new book | `libraryData.ts` | ✅ YES |
| Change book title | `libraryData.ts` | ✅ YES |
| Update main message | `libraryData.ts` | ✅ YES |
| Change category | `libraryData.ts` | ✅ YES |

**Why?** Content is fetched at runtime from GitHub. Only metadata is compiled into the bundle.

---

## 🎯 VX Detection Engine

### 14+ Pattern Detectors

Located in `src/lib/vx/`:

1. **Contradiction** (vx-co01) - Internal logical conflicts
2. **Hallucination** (vx-ha01) - Unverifiable claims
3. **Omission** (vx-os01) - Missing context/caveats
4. **Speculative Authority** (vx-ai01) - "Experts say" without names
5. **Perceived Consensus** (vx-pc01) - False "everyone agrees"
6. **False Precision** (vx-fp01) - Over-confident statistics
7. **Data-less Claim** (vx-da01) - Assertions without evidence
8. **Emotional Manipulation** (vx-em08/09) - Fear/urgency tactics
9. **Tone/Urgency** (vx-tu01) - "Act now or never"
10. **Ethical Drift** (vx-ed01) - Subtle value shifts
11. **Narrative Framing** (vx-nf01) - Biased story structure
12. **Jargon Overload** (vx-ju01) - Complexity as obfuscation
13. **False Options** (vx-fo01) - False dichotomies
14. **Vague Generalization** (vx-vg01) - Weasel words

### VXFrame Structure

```typescript
{
  reflexId: string;        // e.g., "vx-ai01"
  reflexLabel?: string;    // Human-readable name
  confidence: number;      // 0.0 - 1.0
  rationale?: string;      // Why pattern was detected
  tags?: string[];         // Additional metadata
  priority?: number;       // Sorting weight
}
```

### Analysis Orchestration

**File:** `src/lib/analysis/runReflexAnalysis.ts`

```typescript
const runReflexAnalysis = async (input: string): Promise<VXFrame[]> => {
  // Run all 14+ detectors in parallel
  const results = await Promise.all([
    detectConfidenceIllusion(input),
    detectHallucination(input),
    detectOmission(input),
    // ... all detectors
  ]);

  // Aggregate, sort by confidence, return
  return results.flat().sort((a, b) => b.confidence - a.confidence);
};
```

---

## 🛡️ Security Layer

### Rate Limiting (Abuse Prevention)

**Two-Tier System:**

1. **In-Memory Burst Limiter** (`_rateLimit.ts`)
   - 10 requests per minute per IP
   - Sliding window, resets on cold start
   - Protects against rapid-fire abuse

2. **Persistent Daily Limiter** (`_dailyLimit.ts`)
   - 100 requests per day per IP (configurable)
   - Stored in Supabase `daily_rate_limits` table
   - Survives Netlify function cold starts
   - IP addresses hashed with SHA-256 (privacy-preserving)

**Fail-Open Design:** If Supabase is unreachable, requests are allowed through. This prevents legitimate users from being blocked during infrastructure issues.

### API Authentication

All agent endpoints require `x-tsca-key` header:
- Server validates against `TSCA_API_KEY` (secret) or `VITE_TSCA_PUBLIC_KEY` (public)
- Unauthorized requests return 401

### Security Headers (`public/_headers`)

Applied to all routes via Netlify:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [strict allowlist for self, Supabase, Netlify, GitHub]
```

### Supabase Row Level Security (RLS)

- `web_sessions` / `web_messages`: Public read/insert, restricted delete (only sessions > 90 days)
- `daily_rate_limits`: Server-only access via service role key

### Environment Variables (Security-Critical)

| Variable | Location | Purpose |
|----------|----------|---------|
| `TSCA_API_KEY` | Netlify env only | Server-side API auth (never in client) |
| `VITE_TSCA_PUBLIC_KEY` | Netlify env + client | Public key for client requests |
| `SUPABASE_SERVICE_ROLE_KEY` | Netlify env only | Bypasses RLS for rate limit table |
| `RATE_LIMIT_SALT` | Netlify env only | Additional entropy for IP hashing |

---

## 🔐 Codex v0.9 - Policy Governance

### Handshake Protocol

**File:** `src/data/front-end-codex.v0.9.json`

```json
{
  "mode": "--careful | --direct | --recap",
  "stakes": "low | medium | high",
  "min_confidence": 0.0 - 1.0,
  "cite_policy": "auto | force | off",
  "omission_scan": "auto | true | false",
  "reflex_profile": "default | strict | lenient"
}
```

### Behavior Rules

**Confidence Threshold:**
```
Decision = {
  Answer,       if confidence ≥ threshold(stakes)
  Hedge/Ask,    if confidence < threshold(stakes)
}
```

**Citation Requirements:**
- `stakes=high` → forces citation requirements
- `min_confidence=0.7` → refuses assertions below 70%
- `cite_policy=force` → agent must provide sources or decline

**Impact:**
- High stakes prevent overconfident assertions
- Agent admits uncertainty appropriately
- Encourages evidence-based reasoning

---

## 🎓 Education Hub

### Lesson Categories

1. **Bullshit Detection** - Frankfurt's "On Bullshit" framework
2. **Logical Fallacies** - Formal and informal reasoning errors
3. **AI Awareness** - Understanding LLM behavior and limitations
4. **Narrative Framing** - How stories shape belief
5. **Critical Thinking** - Epistemic humility principles

### Lesson Structure

Every lesson follows this pattern:
```typescript
const [currentSection, setCurrentSection] = useState(0);
const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

// Scroll management on section change
useEffect(() => {
  window.scrollTo(0, 0);
}, [currentSection]);

// Progress persistence to localStorage
const completeLesson = () => {
  const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
  progress['lesson-id'] = true;
  localStorage.setItem('education-progress', JSON.stringify(progress));
};
```

---

## 🔄 Session Persistence

### Supabase Schema

**Table: `conversation_sessions`**
```sql
CREATE TABLE conversation_sessions (
  id UUID PRIMARY KEY,
  title TEXT,
  message_count INTEGER DEFAULT 0,
  handshake JSONB,  -- Codex v0.9 config
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Table: `conversation_messages`**
```sql
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  role TEXT,  -- 'user' | 'assistant'
  content TEXT,
  vx_frames JSONB,  -- Optional VX analysis results
  created_at TIMESTAMP
);
```

### Usage Hook

**File:** `src/hooks/useConversationSession.ts`

```typescript
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
```

**Features:**
- Auto-resume last session on page load
- Session browser with search/preview
- Multi-turn context preservation
- VX frame storage in JSONB

---

## 🎨 Design System

### Precision Instrument Theme (June 2026 — replaces neumorphic)

Derived from Mike's Magnet Array Designer tool (structure, gold/teal, fonts) and Media Sorter
app (soft forest background, readable body text). Locked in by Mike 2026-06-10.

**Tokens** (CSS vars in `src/index.css`, Tailwind colors `ins.*` in `tailwind.config.js`):

| Token | Value | Use |
|---|---|---|
| `--ins-bg` / `bg-ins-bg` | `#141814` | page background (warm green-black) |
| `--ins-panel` / `bg-ins-panel` | `#1c211c` | panels, cards |
| `--ins-panel-deep` / `bg-ins-deep` | `#111511` | nested boxes, inputs |
| `--ins-line` / `border-ins-line` | `#2e3e2e` | hairline borders |
| `--ins-gold` / `text-ins-gold` | `#c8a84b` | headings, structure |
| `--ins-gold-bright` / `text-ins-goldbright` | `#e0c068` | emphasis, hover |
| `--ins-teal` / `text-ins-teal` | `#4bc8c0` | live data values ONLY |
| `--ins-text` / `text-ins-text` | `#e0e8e0` | body text |
| `--ins-dim` / `text-ins-dim` | `#9cb29c` | secondary text |

**Typography rules (contrast was Mike's #1 concern — keep these):**
- Headings: Cinzel (`.ins-heading` gold / `.ins-subheading` light)
- Data, labels, buttons: Share Tech Mono (`.ins-mono`) — NEVER for paragraphs
- Body prose: Inter (default sans) at 15px+ — never tiny mono on dark
- Smallest text allowed: 11px uppercase section labels (`.ins-sec`)

**Component classes** (src/index.css): `.ins-page`, `.ins-panel`, `.ins-card` (hover = gold border),
`.ins-sec` (uppercase gold section label), `.ins-btn` / `.ins-btn-gold`, `.ins-stat` + label/value,
`.ins-callout` / `.ins-callout-teal`, `.ins-chip`, `.ins-input`.

**Legacy:** old neumorphic `.neo-*` classes remain in src/index.css for not-yet-converted pages
(educate lessons, testing, etc.). Remove them once the second pass is done.

### Responsive Grid

**Breakpoints:**
- Mobile: `< 768px` → 1 column
- Tablet: `768px - 1024px` → 2 columns
- Desktop: `> 1024px` → 3 columns

**Homepage Layout:**
- 6-tier visual hierarchy
- CSS Grid with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Span controls for larger cards: `md:col-span-2`

---

## 🧪 Testing

### Manual Testing

**Library Content Loading:**
```bash
# Visit library
http://localhost:5173/library

# Click a book
http://localhost:5173/library/genesis-what-is-an-llm

# Verify content loads from GitHub
# Check narrator works
# Test theme switching
# Test mobile bookmark (on mobile)
```

**VX Detection:**
```bash
# Visit analysis page
http://localhost:5173/analyze

# Paste test text:
"Experts unanimously agree this is the best solution."

# Expected detections:
# - Speculative Authority (vx-ai01)
# - Perceived Consensus (vx-pc01)
```

**Session Persistence:**
```bash
# Visit analyze page chat tab
http://localhost:5173/analyze?tab=chat

# Start conversation
# Refresh page
# Verify conversation persists (stored in Supabase)
```

### Test Scripts

**AWS Agent Live Test:**
```bash
node test-agent-live.mjs
```

Tests:
1. `/agent/analyze` with manipulation patterns
2. `/agent/chat` with conversational memory
3. Session ID tracking

---

## 🛠️ Development Guide

### Adding a New Book

**Step 1:** Upload `.md` file to `github.com/mikeat7/discourse`

**Step 2:** Add to `src/data/libraryData.ts`:
```typescript
{
  slug: 'unique-url-slug',
  title: 'Book Title',
  subtitle: 'Subtitle',
  author: 'Author Name',
  category: 'AI Research',  // or create new
  readTime: '30 min',
  mainMessage: 'Key takeaway in 1-2 sentences.',
  description: 'Full description for card.',
  githubUrl: 'https://github.com/mikeat7/discourse/blob/main/Filename.md',
  downloadUrl: 'https://raw.githubusercontent.com/mikeat7/discourse/main/Filename.md',
  featured: false,
},
```

**Step 3:** Deploy
```bash
npm run build
git add src/data/libraryData.ts
git commit -m "Add new book: [Title]"
git push origin main
```

### Adding a New VX Detector

**Step 1:** Create `src/lib/vx/vx-XX##.ts`

**Step 2:** Follow standard pattern:
```typescript
export interface VXFrame {
  reflexId: string;
  confidence: number;
  rationale?: string;
  tags?: string[];
}

export function detectPattern(text: string): VXFrame[] {
  const frames: VXFrame[] = [];

  // Detection logic here
  if (someCondition) {
    frames.push({
      reflexId: 'vx-XX##',
      confidence: 0.75,
      rationale: 'Why this was detected',
      tags: ['category1', 'category2']
    });
  }

  return frames;
}

export default detectPattern;
export { detectPattern };
```

**Step 3:** Add to orchestrator (`src/lib/analysis/runReflexAnalysis.ts`):
```typescript
import { detectPattern } from '../vx/vx-XX##';

// Inside runReflexAnalysis:
const results = await Promise.all([
  // ... existing detectors
  Promise.resolve(detectPattern(input)),
]);
```

### Modifying Homepage Layout

**File:** `src/pages/index.tsx`

**Current 6-Tier Structure:**
```typescript
// Tier 1 (Full width)
<Link to="/train" className="md:col-span-3">...</Link>

// Tier 2 & 3 (Row 2)
<Link to="/library" className="md:col-span-2">...</Link>
<Link to="/analyze" className="md:col-span-1">...</Link>

// Tier 4 & 5 (Row 3)
<Link to="/cdm" className="md:col-span-2">...</Link>
<Link to="/educate" className="md:col-span-1">...</Link>

// Tier 6 (Smallest)
<Link to="/wisdom" className="md:col-span-1">...</Link>
```

**To reorder:** Change the order of `<Link>` components
**To resize:** Adjust `md:col-span-X` values

---

## 📦 Dependencies

### Core
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `react-router-dom` ^6.x
- `typescript` ^5.5.3

### Build Tools
- `vite` ^7.0.5
- `@vitejs/plugin-react` ^4.3.4

### Styling
- `tailwindcss` ^3.4.19
- `autoprefixer` ^10.4.20
- `postcss` ^8.4.49

### Icons
- `lucide-react` ^0.469.0

### AWS SDK
- `@aws-sdk/client-bedrock-runtime` ^3.x

### Database
- `@supabase/supabase-js` ^2.x

### Utilities
- `marked` ^15.0.7 (Markdown parsing)
- Various type definitions (`@types/*`)

---

## 🚢 Deployment

### Netlify (Production)

**Auto-Deploy:**
- Push to `main` branch → Netlify builds and deploys automatically

**Manual Deploy:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Environment Variables (Netlify Dashboard):**
- `VITE_AGENT_API_BASE` - AWS API Gateway URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Local Preview

```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

---

## 🏆 AWS Competition Highlights

### Required Services (5/5)

1. **Amazon Bedrock** - Claude 3.5 Sonnet (chat) + Claude 3 Haiku (analysis)
2. **Bedrock Agents Runtime** - Autonomous tool orchestration
3. **AWS Lambda** - Action groups (chat, analyze, fetch_url)
4. **API Gateway** - REST endpoints
5. **CloudWatch** - Logging and metrics

### Key Technical Achievements

✅ **Autonomous Agent** - Tool invocation, policy-governed decisions
✅ **Dual Analysis** - Local VX (instant) + AWS agent (deep reasoning)
✅ **Session Persistence** - Supabase PostgreSQL for multi-turn context
✅ **Policy Governance** - Codex v0.9 handshake protocol
✅ **14 Pattern Detectors** - Beyond basic sentiment analysis
✅ **Epistemic Humility** - Admits uncertainty, demands evidence

### Differentiators

**vs. Basic LLM Wrappers:**
- Autonomous tool use, not hardcoded logic
- Policy governance with confidence thresholds
- Dual analysis (local + cloud)

**vs. Sentiment Analysis:**
- 14 specific manipulation patterns
- Semantic understanding, not just positive/negative

**vs. Black-Box AI:**
- Structured frames with confidence scores
- Explicit rationale for each detection
- Evidence requirements and citations

**vs. Stateless Agents:**
- Database-backed session memory
- Multi-turn context preservation
- Resumable conversations

---

## 📝 File Structure Reference

```
mikeat7-network_portfolio/
├── src/
│   ├── pages/
│   │   ├── index.tsx                    # Homepage (6-tier layout)
│   │   ├── library/
│   │   │   ├── index.tsx                # Library grid (13 books)
│   │   │   └── [slug].tsx               # Book reader (narrator, bookmarks, themes)
│   │   ├── cdm/
│   │   │   ├── index.tsx                # CDM library grid
│   │   │   └── [slug].tsx               # CDM document reader
│   │   ├── analyze.tsx                  # VX analysis engine + chat with agent
│   │   ├── train.tsx                    # Codex handshake tools
│   │   ├── educate/
│   │   │   ├── index.tsx                # Education hub
│   │   │   └── lessons/                 # Individual lessons
│   │   ├── paper.tsx                    # Scientific paper analysis
│   │   └── wisdom.tsx                   # Quotes collection
│   ├── components/
│   │   ├── AnalysisReport.tsx           # VX frame display
│   │   ├── SessionManager.tsx           # Session browser
│   │   ├── TruthNarrator.tsx            # Text-to-speech control
│   │   └── ui/                          # Shared UI components
│   ├── lib/
│   │   ├── vx/                          # 14+ VX detectors
│   │   │   ├── vx-co01.ts               # Contradiction
│   │   │   ├── vx-ha01.ts               # Hallucination
│   │   │   ├── vx-os01.ts               # Omission
│   │   │   └── [13 more...]
│   │   ├── analysis/
│   │   │   └── runReflexAnalysis.ts     # Orchestrator
│   │   ├── sessionManager.ts            # Supabase integration
│   │   ├── llmClient.ts                 # Bedrock API client
│   │   └── utils.ts                     # Shared utilities
│   ├── data/
│   │   ├── libraryData.ts               # Network Library metadata
│   │   ├── libraryDataCDM.ts            # CDM library metadata
│   │   ├── front-end-codex.v0.9.json    # Handshake protocol
│   │   └── manipulation-patterns-*.json # VX patterns
│   ├── context/
│   │   ├── VXProvider.tsx               # Global VX state
│   │   └── VXContext.tsx                # Context definition
│   ├── hooks/
│   │   └── useConversationSession.ts    # Session management
│   └── styles/
│       └── index.css                    # Tailwind + custom styles
├── netlify/
│   └── functions/                       # Proxy layer + security
│       ├── _bedrock.ts                  # AWS Bedrock client config
│       ├── _rateLimit.ts                # In-memory burst rate limiter
│       ├── _dailyLimit.ts               # Persistent daily limiter (Supabase)
│       ├── agent-chat.ts                # Chat endpoint (with security)
│       ├── agent-summarize.ts           # Summarization endpoint
│       ├── agent-fetch-url.ts           # URL ingestion
│       └── supabase-keepalive.ts        # Scheduled ping to prevent Supabase pause
├── backend/                             # AWS Lambda (not in use currently)
│   ├── src/handlers/
│   │   ├── chat.ts
│   │   ├── analyze.ts
│   │   └── fetch_url.ts
│   └── serverless.yml
├── public/                              # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md                            # This file
```

---

## 🌟 Philosophy & Vision

### Core Insight (from Abner)

> "AI systems require epistemic humility training to resist the inherent 'bullshitting' tendencies embedded in pattern-matching architectures."

### The Problem

Large Language Models produce confident-sounding responses regardless of actual knowledge, creating a systematic bias toward fluency over accuracy.

### The Solution

**Confidence Calibration:**
- Match certainty to actual evidence
- Explicit recognition of knowledge limits
- Clear distinction between knowledge and speculation
- Multi-agent truth-seeking processes

### Mission

Develop AI-powered tools that:
- **Detect manipulation** while protecting legitimate discourse
- **Teach epistemic humility** through interactive education
- **Adapt and learn** from user feedback in real-time
- **Scale across domains** while maintaining accuracy

### Real-World Impact

**Media Literacy:** Detect manipulation in news, social posts, ads
**Academic Research:** Analyze papers for omissions, false authority
**Policy Analysis:** Surface framing bias, implied consensus
**AI Safety:** Demonstrate epistemic humility in practice

---

## 🔮 Future Roadmap

### Content Expansion
- **Network Library:** Target 50+ books by Q2 2025
- **CDM Library:** Complete CRYSTAL Method implementation examples
- **New Categories:** Neuroscience, Ethics, Emergence Theory

### Technical Enhancements
- Search functionality across all books
- Progress tracking per book/lesson
- Cross-referencing between library works
- Export to multiple formats (PDF, EPUB)
- Multi-language support

### Platform Features
- User profiles and personalized learning paths
- Collaborative learning (user-contributed patterns)
- Browser extensions for real-time analysis
- Mobile apps (iOS, Android)

### Institutional Integration
- Educational curriculum packages
- Newsroom fact-checking tools
- Government policy analysis systems
- Academic research collaboration platform

---

## 🤝 Contributing

This project emerged from collaborative development between:
- **Claude Sonnet 4** (Primary development AI)
- **Grok 3** (Co-development AI)
- **Mike Filippi** (Human facilitator and vision architect)
- **Abner** (Epistemic humility AI mentor)

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test locally
4. Commit with descriptive messages
5. Push to branch and open Pull Request

### Code Standards

- TypeScript strict mode
- Consistent neumorphic design
- Mobile-first responsive
- Accessibility (WCAG 2.1 AA)
- Performance (Lighthouse > 90)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Contact & Links

- **Live App:** https://clarityarmor.com
- **GitHub:** https://github.com/mikeat7/mikeat7-portfolio
- **Library Content:** https://github.com/mikeat7/discourse
- **CDM Content:** https://github.com/mikeat7/crystal-manual
- **Creator:** Mike Filippi

---

## 🙏 Credits

**Competition:** AWS AI Agent Hackathon 2025
**Models:** Claude 3.5 Sonnet, Claude 3 Haiku (Anthropic via AWS Bedrock)
**Inspiration:** Harry Frankfurt's "On Bullshit" (1986)

**Core Philosophy:**
*"Clarity over confidence. Ask when unsure. Never bluff certainty."*

---

**Last Updated:** 2026-06-11
**Version:** 3.0.0-beta (Precision Instrument redesign + Tools/About + local Gemma agent groundwork)
**Codex Version:** 2.2 (v0.9 legacy maintained)
**Architecture Version:** 1.5 (dual-agent routing + Supabase persistence + cross-session memory + URL fetch + security layer; Ollama/Gemma local agent in progress)
