# Truth Serum + Clarity Armor — 3-Minute Demo Script

**Target Duration:** 3:00 minutes
**Platform:** YouTube (public, unlisted link for submission)
**Format:** Screen recording with voiceover

---

## [0:00-0:20] Opening & Hook (20 seconds)

**Visual:** Show homepage at clarityarmor.com with tagline

**Voiceover:**
> "What if AI could admit when it's unsure instead of confidently hallucinating? Truth Serum plus Clarity Armor is an AWS-powered autonomous agent that detects manipulation in text—and knows when to ask instead of bluff."

**On-screen text:**
- Truth Serum + Clarity Armor
- AWS AI Agent Competition 2025
- clarityarmor.com

**Action:** Quick scroll through homepage, hover over "Analyze" button

---

## [0:20-1:20] Demo 1: Real-Time Analysis (60 seconds)

**Visual:** Navigate to Analyze page

**Voiceover:**
> "Let me show you how it works. I'll paste a manipulative product claim: 'Studies show 87.3% of consumers prefer our brand over leading competitors.'"

**Action:**
1. Paste text into analysis box (3 sec)
2. Show handshake controls panel

**Voiceover:**
> "Before analyzing, I configure the handshake protocol—this is what makes our agent different. I'm setting stakes to HIGH and confidence threshold to 70%. This means the agent must refuse or hedge if it's less than 70% confident."

**Action:**
3. Set `stakes = high`, `min_confidence = 0.70`, `cite_policy = force`
4. Click "Analyze" button

**Voiceover:**
> "Watch what happens. Two analysis paths run in parallel..."

**Visual:** Split screen showing:
- Left: Local VX reflexes firing (instant results appearing)
- Right: AWS agent processing indicator

**Action:**
5. Local VX results appear first (1-2 seconds)
6. Show 3 detected patterns highlighting:
   - **False Precision** (0.89) - "87.3%" without source
   - **Speculative Authority** (0.76) - "Studies" unnamed
   - **Vague Generalization** (0.68) - "leading competitors" undefined

**Voiceover:**
> "Local VX reflexes detected three manipulation patterns instantly. But now the AWS Bedrock agent enriches the analysis..."

**Action:**
7. Agent results appear (animated transition)
8. Expand first frame to show detailed rationale

**Visual:** Zoom into frame showing:
- Confidence score: 0.89
- Rationale: "Uses over-specific statistic (87.3%) without citing source or methodology"
- Suggestion: "Ask: Which studies? What was the sample size? Who funded the research?"

**Voiceover:**
> "The agent doesn't just say 'this is manipulation'—it explains WHY with confidence scores, rationale, and suggests what questions to ask next. That's explainable AI."

---

## [1:20-2:20] Demo 2: Session Memory (60 seconds)

**Visual:** Scroll to conversation interface at bottom of page

**Voiceover:**
> "Now here's what makes this a true autonomous agent—conversational memory with Supabase persistence."

**Action:**
1. Type in chat: "What patterns often appear together with false precision?"
2. Send message

**Visual:** Agent thinking indicator (AWS Bedrock logo pulsing)

**Action:**
3. Agent response appears:
> "False precision (VX-FP01) frequently co-fires with speculative authority (VX-AI01) and vague generalization (VX-VG01). When manipulators cite specific statistics like '87.3%', they often pair them with unnamed 'studies' or 'experts' to create an illusion of scientific rigor without providing verifiable sources..."

**Voiceover:**
> "The agent remembers our previous analysis and builds on it. But watch this..."

**Action:**
4. Show browser refresh (press F5, screen flickers)
5. Page reloads, conversation history STILL THERE

**Visual:** Session sidebar shows:
- Current session with message count
- Previous messages preserved

**Voiceover:**
> "Session persistence through Supabase means conversations survive page refreshes. This isn't just a chatbot—it's a production-ready agent with real memory."

**Action:**
6. Continue conversation: "Can you analyze this next statement for me?"
7. Paste new text: "A growing number of doctors recommend this supplement for daily wellness."

**Visual:** Agent processing, then returns VX frame

**Action:**
8. Show detection: **Vague Generalization** (0.81) - "growing number" and "doctors" both unspecified

**Voiceover:**
> "The agent maintains context from our entire conversation while analyzing new input. That's multi-turn reasoning powered by Amazon Bedrock Agents Runtime."

---

## [2:20-2:50] Architecture Deep Dive (30 seconds)

**Visual:** Switch to ARCHITECTURE-DIAGRAM.md (show Mermaid diagram)

**Voiceover:**
> "Here's how it works under the hood. Five AWS services working together..."

**Visual:** Highlight each service as mentioned:

**Voiceover:**
> "Amazon Bedrock with Claude 3.5 Sonnet for reasoning. Bedrock Agents Runtime for autonomous tool orchestration. AWS Lambda for serverless compute. API Gateway for REST endpoints. And CloudWatch for monitoring."

**Visual:** Animate data flow:
- User → React Frontend → Netlify Edge → API Gateway → Bedrock Agent → Lambda Tools → Supabase

**Voiceover:**
> "Local VX reflexes run client-side for instant feedback. AWS agent provides deep reasoning with autonomous tool calls. And Supabase PostgreSQL stores everything for session memory."

---

## [2:50-3:00] Closing & Call to Action (10 seconds)

**Visual:** Return to homepage with all features visible

**Voiceover:**
> "Truth Serum plus Clarity Armor: AI that knows when it doesn't know. Try it live at clarityarmor.com."

**On-screen text:**
- **Live Demo:** clarityarmor.com
- **GitHub:** github.com/mikeat7/mikeat7-portfolio
- **AWS Services:** Bedrock • Bedrock Agents • Lambda • API Gateway • CloudWatch
- **Built by:** Mike Adelman

**Visual:** Fade to black with logo

---

## Recording Notes

### Technical Setup

**Screen Recording:**
- Tool: OBS Studio or QuickTime (macOS) / Xbox Game Bar (Windows)
- Resolution: 1920x1080 (1080p)
- Frame rate: 30fps minimum
- Audio: Clear voiceover (use USB mic if available)

**Browser:**
- Use Chrome/Edge for smooth recording
- Hide bookmarks bar (Ctrl+Shift+B / Cmd+Shift+B)
- Close unnecessary tabs
- Use incognito/private mode for clean session

**Demo Preparation:**
1. Clear localStorage before recording (fresh session)
2. Have sample texts ready in clipboard:
   - "Studies show 87.3% of consumers prefer our brand over leading competitors."
   - "A growing number of doctors recommend this supplement for daily wellness."
3. Pre-configure handshake settings screenshot
4. Test conversation flow before recording

### Voiceover Tips

**Pacing:**
- Speak slightly slower than normal conversation
- Pause 1-2 seconds when switching between demos
- Match voiceover timing to on-screen actions

**Tone:**
- Professional but accessible
- Confident without being sales-y
- Emphasize technical innovations: "autonomous agent," "session persistence," "explainable AI"

**Key Phrases to Emphasize:**
- "AWS-powered autonomous agent"
- "Knows when to ask instead of bluff"
- "Explainable AI"
- "Session persistence"
- "Multi-turn reasoning"
- "Production-ready"

### Post-Production

**Editing:**
- Trim any dead air or mistakes
- Add subtle background music (royalty-free: YouTube Audio Library)
- Keep music volume low (10-15% of voiceover)
- Add fade in/out transitions (0.5 sec)

**Text Overlays:**
- Use clean sans-serif font (Arial, Helvetica, Open Sans)
- White text with 50% black shadow for readability
- Bottom-third position for URLs and attribution
- Display for 3-5 seconds minimum

**Export Settings:**
- Format: MP4 (H.264)
- Resolution: 1920x1080
- Bitrate: 8-10 Mbps
- Audio: AAC, 192 kbps

### YouTube Upload

**Title:**
"Truth Serum + Clarity Armor: AWS AI Agent for Manipulation Detection | Hackathon 2025"

**Description:**
```
Truth Serum + Clarity Armor is an AWS-powered autonomous AI agent that detects manipulation patterns in text using epistemic humility principles.

🔧 AWS Services Used:
• Amazon Bedrock (Claude 3.5 Sonnet)
• Amazon Bedrock Agents Runtime
• AWS Lambda
• API Gateway
• CloudWatch

✨ Key Features:
• 14 VX pattern detectors (local + cloud)
• Autonomous tool orchestration
• Session persistence (Supabase)
• Explainable AI with confidence scores
• Policy-governed behavior (Codex v0.9)

🌐 Live Demo: https://clarityarmor.com
💻 GitHub: https://github.com/mikeat7/mikeat7-portfolio

Built for AWS AI Agent Hackathon 2025 by Mike Adelman

#AWS #Bedrock #AI #Agent #Hackathon #MachineLearning #NLP
```

**Tags:**
AWS, Bedrock, AI Agent, Machine Learning, NLP, Manipulation Detection, Claude, Autonomous Agent, Hackathon

**Visibility:**
- Set to "Unlisted" (can be viewed with link, won't appear in search)
- Or "Public" if you want broader visibility

**Thumbnail:**
- Screenshot of analysis heatmap with VX frames
- Include text overlay: "AI Agent That Admits Uncertainty"
- 1280x720 resolution

---

## Backup Script (2-Minute Version)

If you need a shorter version for time constraints:

**[0:00-0:15]** Opening hook
**[0:15-1:00]** Demo 1: Analysis only (skip handshake detail)
**[1:00-1:40]** Demo 2: Session memory (skip second analysis)
**[1:40-2:00]** Architecture (faster, show diagram only)

---

## Alternative Demonstrations

If live demo isn't smooth, pre-record these backup clips:

1. **VX reflexes firing** (3 seconds): Clean transition showing patterns appearing
2. **Agent response** (5 seconds): Detailed frame with confidence score
3. **Session refresh** (3 seconds): Before/after showing persistence
4. **Architecture diagram** (5 seconds): Animated data flow

---

## Legal Compliance Checklist

✅ No third-party trademarks (AWS is allowed as sponsor)
✅ No copyrighted music (use YouTube Audio Library or royalty-free)
✅ No third-party code shown (all original or properly licensed)
✅ Public visibility on YouTube
✅ Under 3 minutes (judges stop watching after 3:00)

---

## Final Pre-Recording Checklist

- [ ] Clear browser cache and localStorage
- [ ] Sample texts ready in clipboard
- [ ] Handshake settings configured
- [ ] Architecture diagram open in second tab
- [ ] Test microphone audio levels
- [ ] Close Slack, email, notifications (Do Not Disturb mode)
- [ ] Check internet connection stability
- [ ] Practice run-through (aim for 2:45 to allow buffer)

---

**Script Version:** 1.0
**Last Updated:** 2025-10-09
**Estimated Recording Time:** 30-45 minutes (including retakes)
**Estimated Editing Time:** 30-60 minutes

Good luck with the recording! 🎬
