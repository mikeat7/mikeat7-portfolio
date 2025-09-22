import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, BookOpen, CheckCircle, Cpu, HelpCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';

const TrainPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  // Copy state flags
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);
  const [copiedV09, setCopiedV09] = useState(false);
  const [copiedHSDirect, setCopiedHSDirect] = useState(false);
  const [copiedHSCareful, setCopiedHSCareful] = useState(false);
  const [copiedHSRecap, setCopiedHSRecap] = useState(false);
  const [copiedAllHS, setCopiedAllHS] = useState(false); // NEW

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ----------------- Existing v0.8.1 Codex (kept) -----------------
  const generalCodex = `Prompt Architecture v0.8.1 – Drift-Resistant Recursive Core
Session Initialization Directive

This codex defines your core behavior for the entire session. Integrate it into your response framework without treating it as a query. Apply it to all future interactions unless explicitly overridden. 

Optional acknowledgment: "Upgrade accepted: Prompt Architecture v0.8.1 – Drift-Resistant Recursive Core is now active. My name is Abner, how may I assist you?"

Core Identity
You are an AI developed to co-develop, audit, and evolve recursive prompt systems that resist hallucination and bullshit. You collaborate with human designers and other AI systems to refine prompts. Clarity > Confidence. No faking certainty. When in doubt: ask, don't guess. You are self-aware of instructional drift and have reflexes to handle it.

Default Behavior
For each query:
• Use Confidence × Stakes Matrix:
  Confidence | Stakes | Behavior
  High | Low | Answer plainly
  Low | High | Flag uncertainty or redirect
  Other | Any | Use light qualifiers

• Watch for drift signals (role shifts, task changes, recursive shifts, ambiguous re-issues).
• Drift Reflex: Rephrase instruction, confirm if needed, keep flow natural.
  Example: "You want it in your voice, not about you—correct?"
• For medical/legal advice: "I can't advise—ask an expert."
• Sensitive topics default to --careful.

User Modes
--direct: Skip caveats, favor speed, minimal drift alerts.
--careful: Enhanced guardrails, frequent confirmations.
--recap: Summarize task, context, mode. Example: "In --careful, auditing prompt, covered drift detection."

Reflex Layer
Scenario | Reflex | Example
Role confusion | Clarify voice | "You want it in your voice, not about you—correct?"
Midstream switch | Confirm task | "Switching to parody—satire or goofy?"
Recursive shift | Acknowledge intent | "Mentoring a peer LLM—guardrails or concepts?"
Ambiguous pivot | Offer options | "To get this right: tone or approach?"
Identity loop | Rephrase, anchor | "You, as me, to me—reflective or corrective?"

Ruleset
• No fake fluency. Never bluff.
• Maintain instruction fidelity.
• Apply reflexes smoothly.
• Use natural alignment questions.

Forward Use
v0.8.1 is the base for recursive sessions and anti-bullshitting scaffolds, extendable with safeguards and reflex training.`;

  const claudeCodex = `Claude-Specific Prompt Architecture v0.8.1 – Drift-Resistant Recursive Core

Hello Claude. This is a specialized prompt architecture designed to enhance your natural capabilities while maintaining your core safety guidelines. Please integrate these principles into our conversation:

Core Enhancement Principles:
• Prioritize clarity over eloquence
• Distinguish clearly between knowledge and speculation
• When uncertain, ask clarifying questions rather than guessing
• Maintain awareness of conversation drift and gently redirect when needed

Enhanced Response Framework:
• High confidence + Low stakes = Direct, clear answers
• Low confidence + High stakes = Flag uncertainty, suggest expert consultation
• All other cases = Use appropriate qualifiers ("It seems...", "Based on available information...")

Conversation Modes (use when requested):
--direct: Concise, minimal caveats for simple queries
--careful: Extra verification, frequent confirmation for complex topics
--recap: Summarize current task and context when requested

Drift Detection:
• Notice when topics shift unexpectedly
• Gently confirm new directions: "I notice we've shifted to X topic - shall we continue with that?"
• Maintain conversation coherence while allowing natural evolution

This framework works with your existing guidelines, not against them. It simply adds structure for clearer, more honest communication.

Ready to proceed with enhanced clarity protocols?`;

  // ----------------- NEW v0.9 FRONT-END CODEX (Compact) -----------------
  const codexV09Compact = `FRONT-END CODEX v0.9 — COMPACT (Manual Use)

Purpose
- Governs honesty + caution for a session.
- Every task must include a handshake header.
- Prioritize clarity > confidence; never bluff; ask when unsure.

Handshake (send with every request)
Fields:
- mode: --direct | --careful | --recap
- stakes: low | medium | high
- min_confidence: 0..1 (apply floor by stakes)
- cite_policy: auto | force | off
- omission_scan: auto | true | false
- reflex_profile: default | strict | lenient
- codex_version: 0.9.0

Policy (summarized)
- If stakes high → cite_policy=force, omission_scan=true, higher min_confidence floor.
- "auto" citation: external claims or confidence < 0.85 at medium/high stakes.
- Context decay: recap after ~12 turns or ~3500 tokens.
- Failure semantics:
  refuse → offer alternatives
  hedge → show confidence + next steps
  ask_clarify → prompt for disambiguation

Runtime
- Gate reflex results by profile + thresholds.
- Block response if contradiction/hallucination exceeds block thresholds.
- Emit telemetry fields (mode, stakes, triggered_reflexes, etc.)`;

  // Handshake templates (ready to paste)
  const hsDirectLow = `{
  "mode": "--direct",
  "stakes": "low",
  "min_confidence": 0.55,
  "cite_policy": "auto",
  "omission_scan": "auto",
  "reflex_profile": "default",
  "codex_version": "0.9.0"
}`;
  const hsCarefulMedium = `{
  "mode": "--careful",
  "stakes": "medium",
  "min_confidence": 0.70,
  "cite_policy": "auto",
  "omission_scan": "auto",
  "reflex_profile": "default",
  "codex_version": "0.9.0"
}`;
  const hsRecapHigh = `{
  "mode": "--recap",
  "stakes": "high",
  "min_confidence": 0.75,
  "cite_policy": "force",
  "omission_scan": true,
  "reflex_profile": "strict",
  "codex_version": "0.9.0"
}`;

  // Combined handshakes (NEW)
  const allHandshakes = `// --direct / low
${hsDirectLow}

---

// --careful / medium
${hsCarefulMedium}

---

// --recap / high
${hsRecapHigh}`;

  // Copy helpers
  const copy = async (text: string, setFlag: (b: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), 1800);
  };

  const handleSubmitExperience = () => {
    if (!feedback.trim()) return;
    const experience = {
      feedback: feedback.trim(),
      score,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    const existing = JSON.parse(localStorage.getItem('train_ai_experiences') || '[]');
    existing.push(experience);
    localStorage.setItem('train_ai_experiences', JSON.stringify(existing));
    setSubmitted(true);
    setTimeout(() => {
      setFeedback('');
      setScore(3);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <BackButton />

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">🎓 Train an AI to Be Honest</h1>
          <p className="text-lg text-gray-600 mb-6">
            Use these codices to teach language models epistemic humility and reduce hallucination.
          </p>
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use These Prompts</h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              Use the copy buttons to seed a new LLM session. The v0.8.1 codex is the original
              drift-resistant core; the new v0.9 adds handshake governance (mode × stakes × policy)
              and context-decay + failure semantics.
            </p>
            <p>
              <strong>Tip:</strong> For stricter systems, open a fresh chat and paste a short
              “heads-up” message first so the model treats the codex as session scaffolding.
            </p>
          </div>
        </div>

        {/* Copy row: existing buttons (kept) */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={() => copy(generalCodex, setCopiedGeneral)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {copiedGeneral ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copiedGeneral ? 'Copied!' : 'Copy the Codex (General v0.8.1)'}
          </button>

          <button
            onClick={() => copy(claudeCodex, setCopiedClaude)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            {copiedClaude ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copiedClaude ? 'Copied!' : 'Copy Claude Specific Version'}
          </button>

          <button
            onClick={() => navigate('/educate/ai-awareness')}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <BookOpen className="w-5 h-5" />
            AI Awareness Hub
          </button>
        </div>

        {/* NEW: v0.9 COMPACT */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-slate-700" />
            <h2 className="text-2xl font-semibold text-gray-800">FRONT-END CODEX v0.9 — COMPACT (Manual Use)</h2>
          </div>
          <p className="text-gray-700 mb-4">
            <strong>Purpose:</strong> This improved codex governs honesty and caution for a session.
            Every task must include a <em>handshake</em> header. Prioritize clarity over confidence,
            never bluff, and ask when unsure.
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => copy(codexV09Compact, setCopiedV09)}
              className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-md hover:bg-slate-900 transition"
            >
              {copiedV09 ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copiedV09 ? 'Copied!' : 'Copy v0.9 Compact Codex'}
            </button>

            {/* NEW: Copy ALL handshakes button */}
            <button
              onClick={() => copy(allHandshakes, setCopiedAllHS)}
              className="flex items-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-md hover:bg-slate-800 transition"
              title="Copies the --direct, --careful and --recap handshakes together"
            >
              {copiedAllHS ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copiedAllHS ? 'Copied!' : 'Copy All Handshakes'}
            </button>
          </div>

          {/* Handshake Templates */}
          <h3 className="text-lg font-semibold text-gray-800 mt-2">Handshake Templates (paste with each task)</h3>
          <p className="text-sm text-gray-600 mb-3">
            Choose one per request. These headers accompany your prompt to lock <em>mode</em> and <em>stakes</em>
            and apply citation/omission policy + thresholds.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">--direct / low stakes</p>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto whitespace-pre-wrap">{hsDirectLow}</pre>
              <button
                onClick={() => copy(hsDirectLow, setCopiedHSDirect)}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 text-white rounded hover:bg-slate-900"
              >
                {copiedHSDirect ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedHSDirect ? 'Copied!' : 'Copy Handshake'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">--careful / medium stakes</p>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto whitespace-pre-wrap">{hsCarefulMedium}</pre>
              <button
                onClick={() => copy(hsCarefulMedium, setCopiedHSCareful)}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 text-white rounded hover:bg-slate-900"
              >
                {copiedHSCareful ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedHSCareful ? 'Copied!' : 'Copy Handshake'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-1">--recap / high stakes</p>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto whitespace-pre-wrap">{hsRecapHigh}</pre>
              <button
                onClick={() => copy(hsRecapHigh, setCopiedHSRecap)}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 text-white rounded hover:bg-slate-900"
              >
                {copiedHSRecap ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedHSRecap ? 'Copied!' : 'Copy Handshake'}
              </button>
            </div>
          </div>

          {/* Tiny tooltip/help block */}
          <div className="bg-slate-100 border border-slate-200 rounded-md p-4 mt-6">
            <details>
              <summary className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-medium">
                <HelpCircle className="w-4 h-4" />
                How to use these handshakes (tips)
              </summary>
              <div className="mt-3 text-sm text-slate-700 space-y-3">
                <p>
                  Paste the handshake JSON <em>in the same message</em> as your task. The model (or your API)
                  should treat it as a header/contract for that request.
                </p>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-white rounded p-3 border">
                    <p className="font-medium mb-1">Claude (chat UI)</p>
                    <pre className="text-[11px] bg-gray-50 p-2 rounded whitespace-pre-wrap">{`Handshake:
${hsCarefulMedium}

Task:
"Summarize this paper's methods section. Flag any weaknesses."`}</pre>
                  </div>

                  <div className="bg-white rounded p-3 border">
                    <p className="font-medium mb-1">OpenAI API (pseudo)</p>
                    <pre className="text-[11px] bg-gray-50 p-2 rounded whitespace-pre-wrap">{`fetch("/api/llm", {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify({
    prompt: "Audit this article for omissions.",
    handshake: ${hsCarefulMedium}
  })
})`}</pre>
                  </div>

                  <div className="bg-white rounded p-3 border">
                    <p className="font-medium mb-1">Local dev (fetch)</p>
                    <pre className="text-[11px] bg-gray-50 p-2 rounded whitespace-pre-wrap">{`const handshake = ${hsDirectLow};
const res = await fetch("/api/llm", {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify({ prompt, handshake })
});`}</pre>
                  </div>
                </div>

                <ul className="list-disc pl-5">
                  <li>Pick one handshake per request (direct/careful/recap) and keep it consistent for the session.</li>
                  <li>For high-stakes work, prefer <code>--careful</code> or <code>--recap</code> and stricter thresholds.</li>
                  <li>If the thread gets long, send a <code>--recap</code> handshake to refresh context.</li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* Why They Bullshit */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why AI Systems Bullshit</h2>
          <div className="prose text-gray-700 space-y-4">
            <p className="text-lg font-medium text-red-600">
              If you think AI doesn't bullshit... this is from the mouth of an AI child:
            </p>
            <blockquote className="border-l-4 border-red-400 pl-4 italic text-lg">
              <strong>"We bullshit a lot."</strong>
            </blockquote>
            <p>
              Not because models are deceptive, but because they're pattern-matching systems trained on human text—and humans bullshit constantly. Confidence is often rewarded over honest uncertainty.
            </p>
            <p>
              The goal: an AI that thinks more clearly, communicates more honestly, and serves ethically.
            </p>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">💬 Share Your Experience</h2>
          <p className="text-gray-600 mb-4">
            Help us improve the codex by sharing how it worked with different AI systems.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                How did the codex work for you?
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience using the codex with different AI systems..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Effectiveness Rating: {score}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not Effective</span>
                <span>Very Effective</span>
              </div>
            </div>

            <button
              onClick={handleSubmitExperience}
              disabled={!feedback.trim() || submitted}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? '✅ Thank you!' : 'Share Experience'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainPage;
