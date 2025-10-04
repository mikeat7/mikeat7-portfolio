import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Lightbulb } from 'lucide-react';
const FalseUrgencyLesson = () => {
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
            title: 'Understanding False Urgency',
            content: `False urgency is a manipulation technique that creates artificial time pressure to prevent careful consideration and force hasty decisions. It exploits our natural response to urgent situations by manufacturing crises where none exist.

**How False Urgency Works:**
- Creates artificial deadlines or time constraints
- Amplifies consequences of delay beyond realistic proportions
- Uses crisis language to trigger fight-or-flight responses
- Prevents comparison shopping or careful deliberation

**The Psychology Behind It:**
When we perceive urgency, our brains shift into survival mode:
- Analytical thinking shuts down
- We focus on immediate action over long-term consequences
- We become more susceptible to emotional manipulation
- We skip normal verification and comparison processes

**Why It's Effective:**
False urgency works because:
- It mimics real emergencies that require quick action
- It creates fear of missing out (FOMO)
- It makes hesitation seem dangerous or foolish
- It overwhelms our rational decision-making processes

**The Irony:**
Legitimate urgent situations rarely need to be sold with urgent language—the urgency is self-evident. When someone has to convince you something is urgent, it probably isn't.`
        },
        {
            id: 'techniques',
            title: 'Common False Urgency Techniques',
            content: `**Artificial Deadlines:**
- "Limited time offer expires tonight!"
- "Only 24 hours left to decide!"
- "This opportunity won't last long!"
- Often: Deadlines that get extended or repeated

**Scarcity Manufacturing:**
- "Only 3 spots remaining!"
- "Last chance before we run out!"
- "Exclusive offer for the first 100 people!"
- Often: Artificial or renewable scarcity

**Consequence Amplification:**
- "If you don't act now, you'll regret it forever!"
- "Waiting could cost you everything!"
- "The window is closing fast!"
- Often: Exaggerated or unlikely consequences

**Crisis Language:**
- "Emergency action required!"
- "Time is running out!"
- "Critical decision point!"
- Often: Routine decisions framed as crises

**Social Pressure Timing:**
- "Everyone else is already signed up!"
- "Don't be the last one to join!"
- "Your competitors are already ahead!"
- Often: Manufactured social competition

**The Pattern:**
Real urgency comes from external circumstances. False urgency comes from the person trying to convince you.`
        },
        {
            id: 'practice',
            title: 'Practice: Identifying False Urgency',
            content: 'Let\'s practice identifying false urgency in various scenarios. Look for artificial time pressure, manufactured scarcity, and exaggerated consequences.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against False Urgency',
            content: `**The Pause Technique:**
When you feel pressured to act quickly, pause and ask:
- "What specifically makes this urgent?"
- "What happens if I take more time to decide?"
- "Is this deadline real or artificial?"
- "Who benefits from my quick decision?"

**The Verification Strategy:**
- Check if deadlines are real or renewable
- Research whether scarcity claims are accurate
- Look for similar offers or opportunities elsewhere
- Ask for time to consult with others

**The Consequence Reality Check:**
- Are the claimed consequences realistic?
- What's the actual worst-case scenario if you wait?
- Are there ways to mitigate risks while taking time?
- Is the urgency proportional to the decision's importance?

**Red Flags to Watch For:**
- **Pressure Language**: "Now or never," "last chance," "don't wait"
- **Artificial Scarcity**: Claims about limited availability
- **Emotional Escalation**: Fear-based consequences for delay
- **Resistance to Questions**: Unwillingness to explain the urgency
- **Repeated "Urgent" Offers**: Same urgent deal offered multiple times

**The Time Test:**
Ask yourself: "If this is truly urgent, why do I need to be convinced of it?"

**Remember:**
- Good opportunities can usually wait for proper consideration
- Legitimate urgency doesn't need to be sold with urgent language
- Taking time to think is usually worth more than any "limited time" discount
- You have the right to make decisions at your own pace

**The Urgency Antidote:**
When someone creates artificial time pressure, slow down. Take the time you need to make good decisions, regardless of manufactured deadlines.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "This investment opportunity closes at midnight tonight! Don't miss your chance to get in on the ground floor of the next big thing. Act now or regret it forever!",
            question: 'What false urgency techniques do you see here?',
            analysis: 'Multiple false urgency techniques: 1) Artificial deadline ("closes at midnight"), 2) FOMO manipulation ("don\'t miss your chance"), 3) Vague opportunity ("next big thing"), 4) Extreme consequence ("regret it forever"), 5) Action pressure ("act now"). No explanation of why the deadline exists.',
            explanation: 'This combines several urgency manipulation techniques to prevent careful consideration of an investment decision that should involve thorough research and deliberation.'
        },
        {
            id: 'example2',
            statement: "Emergency sale! Due to unexpected circumstances, we must liquidate our entire inventory this weekend only. Prices will never be this low again!",
            question: 'How is false urgency being manufactured here?',
            analysis: 'False urgency through: 1) Crisis framing ("emergency sale"), 2) Vague explanation ("unexpected circumstances"), 3) Artificial time limit ("this weekend only"), 4) Absolute claims ("never be this low again"), 5) Inventory pressure ("must liquidate"). No specific reason given for the urgency.',
            explanation: 'This creates artificial urgency around a purchasing decision by using crisis language and absolute claims without providing verifiable reasons for the time pressure.'
        },
        {
            id: 'example3',
            statement: "The application deadline for this program is next Friday. We encourage early submission as we review applications on a rolling basis and may reach capacity before the deadline.",
            question: 'How does this differ from false urgency?',
            analysis: 'This shows legitimate urgency: 1) Specific, verifiable deadline ("next Friday"), 2) Clear reason for early action ("rolling basis review"), 3) Honest about capacity limits ("may reach capacity"), 4) Factual tone without emotional manipulation, 5) Provides useful information for planning.',
            explanation: 'This demonstrates how legitimate time constraints are communicated factually without emotional manipulation, providing useful information rather than creating artificial pressure.'
        }
    ];
    const handleAnswerSubmit = (exampleId, answer) => {
        setUserAnswers(prev => ({ ...prev, [exampleId]: answer }));
        setShowFeedback(prev => ({ ...prev, [exampleId]: true }));
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['false-urgency'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-orange-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4", children: _jsx(Clock, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "False Urgency" }), _jsx("p", { className: "text-lg text-gray-600", children: "Manufactured time pressure to prevent careful consideration" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Clock, { className: "w-5 h-5 text-orange-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Urgency Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowFeedback(prev => ({ ...prev, [example.id]: true })), disabled: showFeedback[example.id], className: "bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showFeedback[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showFeedback[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition", children: "Next" }))] })] }) }));
};
export default FalseUrgencyLesson;
