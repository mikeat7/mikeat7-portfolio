import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Megaphone, CheckCircle, Brain } from 'lucide-react';
const WhyCertaintySells = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentSection, setCurrentSection] = useState(0);
    const [showAnswers, setShowAnswers] = useState({});
    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);
    const sections = [
        {
            id: 'introduction',
            title: 'The Seductive Power of Certainty',
            content: `In an uncertain world, certainty becomes seductive. Whether in politics, science, or self-help—people are drawn to confident voices, even when they may be wrong.

**Why Certainty Appeals:**
- Reduces cognitive load and mental effort
- Provides emotional comfort in uncertain times
- Signals authority and competence
- Simplifies complex decisions
- Offers clear direction for action

**The Certainty Trap:**
Certainty feels safe, but it can be dangerous. It shuts down inquiry, prevents learning, and can lead to poor decisions based on overconfidence.

**Historical Examples:**
- Political leaders who promised simple solutions to complex problems
- Medical "experts" who claimed absolute knowledge before evidence emerged
- Financial advisors who guaranteed returns before market crashes
- Religious or ideological leaders who claimed exclusive truth

**The Paradox:**
The people who sound most certain are often the least trustworthy, while those who acknowledge uncertainty are often the most reliable.`
        },
        {
            id: 'psychology',
            title: 'The Psychology Behind Certainty\'s Appeal',
            content: `**Cognitive Reasons We Crave Certainty:**

**1. Uncertainty Aversion**
- Humans are naturally uncomfortable with ambiguity
- We prefer known risks to unknown risks
- Certainty reduces anxiety and stress

**2. Cognitive Load Reduction**
- Thinking is mentally expensive
- Certainty eliminates the need for further analysis
- Simple answers are easier to remember and share

**3. Authority Heuristic**
- We use confidence as a shortcut to judge expertise
- Confident speakers seem more knowledgeable
- Certainty signals leadership and decisiveness

**4. Social Proof**
- Confident people attract followers
- Certainty creates the appearance of consensus
- We assume others have done the thinking for us

**5. Confirmation Bias**
- Certain statements that match our beliefs feel "right"
- We don't scrutinize information that confirms our views
- Certainty validates our existing opinions

**The Evolutionary Angle:**
In ancestral environments, quick, confident decisions often meant survival. Hesitation could be deadly. But in our complex modern world, this ancient wiring can lead us astray.`
        },
        {
            id: 'practice',
            title: 'Practice: Recognizing Certainty Manipulation',
            content: 'Let\'s practice identifying when certainty is being used to manipulate rather than inform. Look for overconfidence, missing nuance, and emotional appeals.',
            interactive: true
        },
        {
            id: 'building-trust',
            title: 'Building Real Trust Through Humility',
            content: `**How to Build Genuine Trust:**

**1. Acknowledge Uncertainty**
- Admit when you don't know something
- Use appropriate qualifiers ("It seems...", "Based on available evidence...")
- Distinguish between what you know and what you believe

**2. Show Your Work**
- Cite sources and evidence
- Explain your reasoning process
- Acknowledge limitations in your data or analysis

**3. Welcome Scrutiny**
- Invite questions and challenges
- Thank people for pointing out errors
- Treat criticism as an opportunity to improve

**4. Update When Wrong**
- Change your position when evidence warrants it
- Publicly acknowledge mistakes
- Explain what you learned from being wrong

**5. Embrace Complexity**
- Acknowledge when issues are genuinely complex
- Resist oversimplification for the sake of clarity
- Help others understand nuance rather than hiding it

**The Trust Dividend:**
While certainty may win in the short term, trust built through humility and honesty creates lasting influence and credibility.

**Remember Bertrand Russell's Wisdom:**
"The trouble with the world is that the stupid are cocksure and the intelligent are full of doubt."

**The Goal:**
Build trust instead of projecting certainty. Be open about uncertainty, cite sources, admit when evidence is lacking. It's slower—but more powerful in the long run.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "This investment strategy is guaranteed to make you rich. I've never seen it fail, and anyone who doesn't use it is making a huge mistake.",
            question: 'What certainty manipulation techniques do you see here?',
            analysis: 'This uses multiple certainty manipulation techniques: 1) Absolute guarantee ("guaranteed"), 2) Anecdotal evidence ("I\'ve never seen it fail"), 3) False dichotomy ("anyone who doesn\'t use it"), 4) Emotional pressure ("huge mistake"). No mention of risks, market conditions, or individual circumstances.',
            explanation: 'This statement uses certainty to bypass critical thinking about investment risks. Real financial advice acknowledges uncertainty, discusses risks, and avoids guarantees.'
        },
        {
            id: 'example2',
            statement: "The science is settled on this issue. All real experts agree, and anyone who questions it is either ignorant or has an agenda.",
            question: 'How is certainty being weaponized here?',
            analysis: 'This weaponizes certainty through: 1) False finality ("science is settled"), 2) Manufactured consensus ("all real experts"), 3) Authority gatekeeping ("real experts"), 4) Character assassination ("ignorant or has agenda"). It shuts down legitimate scientific inquiry.',
            explanation: 'Real science acknowledges ongoing questions and welcomes scrutiny. This statement uses certainty to silence debate rather than engage with evidence.'
        },
        {
            id: 'example3',
            statement: "Based on current data, this approach seems promising, though we need more research to understand its limitations and optimal applications.",
            question: 'How does this differ from certainty manipulation?',
            analysis: 'This demonstrates epistemic humility through: 1) Evidence-based language ("based on current data"), 2) Appropriate confidence ("seems promising"), 3) Acknowledging limitations ("need more research"), 4) Recognizing complexity ("optimal applications"). It invites further inquiry.',
            explanation: 'This builds trust through honesty about uncertainty while still providing useful information. It demonstrates how to be helpful without being overconfident.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['why-certainty-sells'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-red-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4", children: _jsx(Megaphone, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Why Certainty Sells" }), _jsx("p", { className: "text-lg text-gray-600", children: "Understanding the psychological appeal of confident claims and absolute answers" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Brain, { className: "w-5 h-5 text-red-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Example ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition", children: "Next" }))] })] }) }));
};
export default WhyCertaintySells;
