# Truth Serum + Clarity Armor

**Live:** https://clarityarmor.com
**GitHub:** https://github.com/mikeat7/mikeat7-portfolio
**Competition:** AWS AI Agent Hackathon 2025

---

## 🤖 For AI Assistants - Context Handoff

> **Last Updated:** 2025-12-29
> **Last Major Work:** Mobile bookmark feature for library books
> **Active Development Area:** Library reading experience

### What This Project Is

A multi-faceted platform combining:
1. **AWS-powered manipulation detection tool** (original competition entry)
2. **Network Library** - Curated writings on consciousness, AI sentience, philosophy
3. **CDM v2 Library** - CRYSTAL Method documentation for transformer reasoning analysis
4. **Education Hub** - Critical thinking and epistemic humility training

### Recent Changes (December 2025)

**Mobile Bookmark Feature** (Most Recent - Dec 29):
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
│   ├── analyze.tsx             # VX reflex manipulation detection engine
│   ├── train.tsx               # Codex handshake governance tools
│   ├── educate/                # Critical thinking lessons
│   ├── agent-demo.tsx          # AWS Bedrock agent demonstration
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

### Neumorphic Theme

**Base Color:** `#e9eef5` (light blue-gray)

**Shadow System:**
```css
/* Raised (interactive) */
box-shadow: 8px 8px 16px rgba(163,177,198,0.6),
            -8px -8px 16px rgba(255,255,255,0.9);

/* Inset (pressed/active) */
box-shadow: inset 4px 4px 8px rgba(163,177,198,0.6),
            inset -4px -4px 8px rgba(255,255,255,0.9);
```

**Accent Colors:**
- Gold: `#ffd700` (featured badges, icons)
- Blue gradients: `from-blue-500 to-indigo-600`
- Slate: `slate-600` to `slate-900` (text)

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
# Visit agent demo
http://localhost:5173/agent-demo

# Start conversation
# Refresh page
# Verify conversation persists
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
│   │   ├── analyze.tsx                  # VX analysis engine
│   │   ├── train.tsx                    # Codex handshake tools
│   │   ├── educate/
│   │   │   ├── index.tsx                # Education hub
│   │   │   └── lessons/                 # Individual lessons
│   │   ├── agent-demo.tsx               # AWS agent demo
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
│   └── functions/                       # Proxy layer
│       ├── agent-chat.ts                # Chat endpoint
│       ├── agent-analyze.ts             # Analysis endpoint
│       └── agent-fetch-url.ts           # URL ingestion
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

**Last Updated:** 2025-12-29
**Version:** 2.1 (with mobile bookmarks)
**Codex Version:** 0.9.0
**Architecture Version:** 1.2 (dual-agent routing + session persistence + library systems)
