import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, Lightbulb } from 'lucide-react';
const JargonOverloadLesson = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentSection, setCurrentSection] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState({});
    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);
    const sections = [
        {
            id: 'introduction',
            title: 'Understanding Jargon Overload',
            content: `Jargon overload occurs when someone uses overly complex or specialized language to appear authoritative, deflect scrutiny, or obscure weak logic. It's a form of intellectual intimidation that exploits our tendency to equate complexity with expertise.

**How Jargon Overload Works:**
- Creates artificial barriers to understanding
- Makes simple concepts sound more sophisticated than they are
- Intimidates audiences into accepting claims without scrutiny
- Exploits our respect for expertise and technical knowledge

**The Complexity Trap:**
We often assume that if something sounds complicated and uses technical terms, it must be:
- More accurate or scientific
- Created by someone with superior knowledge
- Too advanced for us to question
- Inherently more valuable or important

**Why It's Effective:**
Jargon overload exploits our cognitive shortcuts. When we encounter complex language, we often:
- Assume the speaker knows more than we do
- Feel embarrassed to ask for clarification
- Accept claims to avoid appearing ignorant
- Defer to apparent expertise without verification

**The Irony:**
True experts can usually explain complex concepts in simple terms. As Einstein allegedly said: "If you can't explain it simply, you don't understand it well enough."`
        },
        {
            id: 'types',
            title: 'Types of Jargon Manipulation',
            content: `**Corporate Buzzword Inflation:**
- "Leverage synergies to optimize deliverables"
- "Operationalize scalable solutions"
- "Paradigm shift in value propositions"
- Translation: Use resources to improve results

**Academic Obfuscation:**
- "Utilizing a multifaceted approach to optimize outcomes"
- "Implementing evidence-based best practices"
- "Leveraging cross-functional expertise"
- Translation: Using different methods to get better results

**Technical Intimidation:**
- "Quantum-enhanced bio-resonance optimization"
- "Algorithmic machine learning protocols"
- "Blockchain-enabled smart contracts"
- Often: Meaningless combinations of technical terms

**Medical/Scientific Misuse:**
- "Clinically proven advanced formulation"
- "Proprietary bioactive compounds"
- "Scientifically validated methodology"
- Often: Vague claims without specific evidence

**Financial Complexity:**
- "Diversified portfolio optimization strategies"
- "Risk-adjusted alpha generation mechanisms"
- "Systematic factor-based allocation models"
- Often: Simple investment advice dressed up in jargon

**The Pattern:**
Real jargon serves a purpose—it allows experts to communicate precisely with other experts. Fake jargon serves to impress, confuse, or intimidate non-experts.`
        },
        {
            id: 'practice',
            title: 'Practice: Decoding Jargon',
            content: 'Let\'s practice identifying jargon overload and translating complex language into plain English. Look for unnecessarily complex terms and consider simpler alternatives.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against Jargon Manipulation',
            content: `**The Translation Test:**
Ask yourself: "Can I restate this in simple terms?" If not, either:
- The concept is genuinely complex and needs explanation
- The speaker is using jargon to obscure meaning
- You need to ask for clarification

**The Clarification Strategy:**
- "Could you explain that in simpler terms?"
- "What do you mean by [specific jargon term]?"
- "Can you give me a concrete example?"
- "How would you explain this to someone outside your field?"

**Red Flags to Watch For:**
- **Buzzword Density**: Too many technical terms in one sentence
- **Undefined Terms**: Jargon used without explanation
- **Circular Definitions**: Jargon defined using more jargon
- **Intimidation Tactics**: Implying you should already know these terms
- **Vague Precision**: Technical-sounding but meaningless phrases

**The Expertise Test:**
Real experts can:
- Explain concepts at multiple levels of complexity
- Define their terms clearly when asked
- Use analogies and examples effectively
- Acknowledge when something is genuinely complex
- Admit the limits of their knowledge

**Remember:**
- Clarity is a sign of understanding, not simplification
- Good communication serves the audience, not the speaker's ego
- If someone can't explain their idea simply, they may not understand it themselves
- You have the right to understand what you're being told

**The Jargon Antidote:**
Demand clarity. Ask questions. Don't be intimidated by complex language. True expertise welcomes clarification requests and respects the audience's need to understand.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "We need to leverage our core competencies to synergize cross-functional deliverables and optimize our value proposition through strategic paradigm shifts.",
            question: 'What does this corporate jargon actually mean?',
            analysis: 'This is pure buzzword inflation. Translated: "We should use our strengths to work together better and improve what we offer customers by changing our approach." The jargon makes a simple concept sound sophisticated and strategic.',
            explanation: 'Corporate jargon often takes simple business concepts and wraps them in impressive-sounding language to make routine activities appear more strategic and important than they are.'
        },
        {
            id: 'example2',
            statement: "Our proprietary quantum-enhanced bio-resonance technology utilizes advanced algorithmic protocols to optimize cellular metabolic pathways through targeted frequency modulation.",
            question: 'What jargon manipulation techniques do you see here?',
            analysis: 'This combines multiple jargon manipulation techniques: 1) Scientific-sounding terms ("quantum-enhanced," "bio-resonance"), 2) Vague technical language ("algorithmic protocols"), 3) Medical terminology misuse ("cellular metabolic pathways"), 4) Meaningless precision ("targeted frequency modulation"). It\'s designed to sound scientific without meaning anything specific.',
            explanation: 'This type of pseudo-scientific jargon is often used in alternative medicine or wellness products to create an impression of scientific validity without actual scientific evidence.'
        },
        {
            id: 'example3',
            statement: "The study employed a randomized, double-blind, placebo-controlled methodology to assess the efficacy of the intervention across a demographically diverse cohort of 500 participants over a 12-week period.",
            question: 'How does this differ from jargon overload?',
            analysis: 'This is legitimate technical language that serves a purpose: 1) "Randomized, double-blind, placebo-controlled" describes specific scientific methods, 2) "Demographically diverse cohort" indicates representative sampling, 3) "500 participants over 12 weeks" provides concrete details. Each term has precise meaning in research methodology.',
            explanation: 'This demonstrates how legitimate technical language provides specific, verifiable information that experts need to evaluate research quality, unlike jargon overload which obscures rather than clarifies.'
        }
    ];
    const handleAnswerSubmit = (exampleId, answer) => {
        setUserAnswers(prev => ({ ...prev, [exampleId]: answer }));
        setShowFeedback(prev => ({ ...prev, [exampleId]: true }));
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['jargon-overload'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4", children: _jsx(FileText, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Jargon Overload" }), _jsx("p", { className: "text-lg text-gray-600", children: "When complex language is used to confuse rather than clarify" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(FileText, { className: "w-5 h-5 text-indigo-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Jargon Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowFeedback(prev => ({ ...prev, [example.id]: true })), disabled: showFeedback[example.id], className: "bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showFeedback[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showFeedback[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition", children: "Next" }))] })] }) }));
};
export default JargonOverloadLesson;
