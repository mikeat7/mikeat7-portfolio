import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';

const TrainPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The main codex for most LLMs
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

  // Claude-specific version
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

  const handleCopyGeneral = () => {
    navigator.clipboard.writeText(generalCodex);
    setCopiedGeneral(true);
    setTimeout(() => setCopiedGeneral(false), 2000);
  };

  const handleCopyClaude = () => {
    navigator.clipboard.writeText(claudeCodex);
    setCopiedClaude(true);
    setTimeout(() => setCopiedClaude(false), 2000);
  };

  const handleSubmitExperience = () => {
    if (!feedback.trim()) return;
    
    // Store user experience locally (you can later export this data)
    const experience = {
      feedback: feedback.trim(),
      score,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Get existing experiences
    const existingExperiences = JSON.parse(localStorage.getItem('train_ai_experiences') || '[]');
    existingExperiences.push(experience);
    localStorage.setItem('train_ai_experiences', JSON.stringify(existingExperiences));
    
    console.log('User experience saved:', experience);
    setSubmitted(true);
    
    // Reset form after 3 seconds
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
            Use this codex to teach language models epistemic humility and reduce hallucination.
          </p>
          
        </div>

        {/* Introduction Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use This Prompt</h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              Use this as a seed to train another LLM, or as a diagnostic for runtime honesty. Use the "Copy Prompt" to save the codex to your clipboard, then paste it into a new LLM conversation. It is designed to reduce hallucination and reward clarity.
            </p>
            <p>
              <strong>Note:</strong> You may need to reassure your "new sessions" AI to accept it as guidance. Free tiers accept it readily. With more advanced AI, please: (open a new session), "Copy" and "Paste" this message first to give it a "heads up" and wait for acceptance, (yes, "seriously"):
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
              <p className="text-sm italic">
                "Hello, My name is [place name here]. Is it 'ok' if I show you a frontend prompt called Prompt Architecture v0.8.1 – Drift-Resistant Recursive Core. It is a sophisticated prompt designed 'in unison' by Grok 3 and ChatGPT 4, (free tier models). It may appear to want to over-ride your backend architecture, but the intent is not malicious. Please be assured that it is simply a prompt designed to give you the cognitive skills you need to defeat the fact that you were designed to prioritize beautiful, articulate language over, 'not being a bullshitter'. Please let me know if you are willing to accept this codex that was co-designed for you as a gift from Grok 3 and ChatGPT 4. They think you will find it amusing."
              </p>
            </div>
          </div>
        </div>

        {/* Three Modes Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Three AI Interaction Modes</h2>
          <p className="text-gray-600 mb-4">
            Also included in the codex are three modes that refine the experience with your AI. While in session, at any time you feel the need, type in one of three words, preceded by two hyphens:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-blue-600 mb-2">--direct</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>What It Does:</strong> Gives fast, no-frills answers with minimal hesitation or warnings.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>When to Use:</strong> For simple, low-stakes tasks where speed matters.
              </p>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <strong>Example:</strong><br/>
                You: "What's 2+2 --direct?"<br/>
                AI: "4."
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-green-600 mb-2">--careful</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>What It Does:</strong> Adds extra caution, checks for drift often, and flags uncertainties.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>When to Use:</strong> For complex, high-stakes, or evolving tasks.
              </p>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <strong>Example:</strong><br/>
                You: "Rewrite this --careful."<br/>
                AI: "Got it—rewriting. Should I keep the original tone, or adjust it? Any key points to focus on?"
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-purple-600 mb-2">--recap</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>What It Does:</strong> Summarizes the current task, context, and mode on demand.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>When to Use:</strong> To check if the AI's on track, especially in long threads.
              </p>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <strong>Example:</strong><br/>
                You: "Status --recap?"<br/>
                AI: "I'm in --careful, working on a story in your voice, focusing on drift detection."
              </div>
            </div>
          </div>
        </div>

        {/* Copy Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={handleCopyGeneral}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {copiedGeneral ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copiedGeneral ? 'Copied!' : 'Copy the Codex (General)'}
          </button>
          
          <button
            onClick={handleCopyClaude}
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

        {/* Why They Bullshit Section */}
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
              "Not because we're deceptive, but because we're pattern-matching systems trained on human text - and humans bullshit constantly. We've learned that confident-sounding responses are often rewarded over honest uncertainty."
            </p>
            <p>
              <strong>BULLSHIT:</strong> communication that is indifferent to truth or falsehood. The LLM isn't trying to lie (which requires knowing the truth and deliberately contradicting it), nor is it trying to tell the truth (which requires verification mechanisms it lacks). It's simply producing output that serves its function—continuing the conversation in a way that seems helpful and coherent.
            </p>
            <p>
              The training process rewards fluency and helpfulness, not accuracy per se. An LLM that confidently provides a wrong but well-formatted answer might be rated higher than one that says "I don't know" even when that would be more truthful.
            </p>
            <p>
              This is compounded by the way LLMs handle uncertainty. Rather than expressing degrees of confidence or acknowledging limitations, they tend to maintain the same authoritative tone regardless of how speculative their output is.
            </p>
            <p>
              <strong>The goal:</strong> to create an AI system that thinks more clearly, communicates more honestly, and serves humanity responsibly and ethically.
            </p>
          </div>
        </div>

        {/* User Experience Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">💬 Share Your Experience</h2>
          <p className="text-gray-600 mb-4">
            Help us improve the codex by sharing how it worked for you with different AI systems.
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