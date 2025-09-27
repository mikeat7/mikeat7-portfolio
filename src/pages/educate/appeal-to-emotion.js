import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, CheckCircle, Lightbulb } from 'lucide-react';
const AppealToEmotionLesson = () => {
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
            title: 'Understanding Appeal to Emotion',
            content: `Appeal to emotion becomes a logical fallacy when emotions are used to replace logical reasoning and evidence. While emotions are important and legitimate, they become problematic when they're used to bypass critical thinking entirely.

**When Emotion is Legitimate:**
- Emotions support logical arguments with evidence
- Emotional appeals are proportional to the actual stakes
- Facts and feelings work together, not in opposition
- Emotional content doesn't replace rational analysis

**When Emotion Becomes Fallacious:**
- Emotions are used instead of evidence
- Emotional intensity is disproportionate to actual stakes
- Fear, guilt, or anger are manufactured to force decisions
- Rational discussion is shut down by emotional manipulation

**The Emotion Spectrum:**
- **Legitimate**: "This policy affects real families" + data on impact
- **Questionable**: "Think of the children" without specific policy analysis
- **Fallacious**: "If you don't support this, you hate children"

**Why It Works:**
Emotions evolved to help us make quick survival decisions. When we feel strong emotions, our analytical thinking can shut down in favor of immediate action. Manipulators exploit this ancient wiring.`
        },
        {
            id: 'types',
            title: 'Types of Emotional Manipulation',
            content: `**Fear Appeals:**
- "If we don't act now, disaster will strike!"
- "This threatens everything we hold dear!"
- "The consequences will be catastrophic!"
- Often: Exaggerated or unlikely threats

**Guilt Manipulation:**
- "Think of the children who will suffer!"
- "How can you be so selfish?"
- "Good people would support this!"
- Often: Manufactured moral obligations

**Anger Amplification:**
- "This is an outrage that demands action!"
- "They're trying to control you!"
- "We can't let them get away with this!"
- Often: Tribal us-vs-them framing

**Pity Appeals:**
- "These poor victims need your help!"
- "Don't abandon them in their time of need!"
- "You're their only hope!"
- Often: Emotional manipulation without practical solutions

**Hope Exploitation:**
- "This is your chance for a better life!"
- "Finally, the solution you've been waiting for!"
- "Your dreams can come true!"
- Often: Unrealistic promises based on desires

**Pride Manipulation:**
- "Smart people like you understand..."
- "You deserve better than this!"
- "Join the elite who know the truth!"
- Often: Flattery combined with exclusivity claims

**The Pattern:**
Legitimate emotional appeals enhance logical arguments. Fallacious emotional appeals replace logical arguments.`
        },
        {
            id: 'practice',
            title: 'Practice: Identifying Emotional Manipulation',
            content: 'Let\'s practice distinguishing between legitimate emotional content and manipulative appeals to emotion. Look for disproportionate emotional intensity and missing logical support.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against Emotional Manipulation',
            content: `**The Emotional Awareness Check:**
When you feel a strong emotional response, pause and ask:
- "What emotion am I feeling right now?"
- "Is this emotion helping me think clearly?"
- "What would I think about this if I weren't feeling this way?"
- "Is the emotional intensity proportional to the actual situation?"

**The Evidence Separation:**
- Strip away emotional language and restate the core claim
- "So you're saying that [neutral restatement]?"
- Look for the logical argument beneath the emotional appeal
- Ask: "What evidence supports this beyond the emotional content?"

**The Proportionality Test:**
- Are the claimed stakes realistic?
- Is the emotional intensity appropriate to the actual consequences?
- Are there less dramatic ways to address the same concerns?
- Is the emotion being used to prevent careful consideration?

**Red Flags to Watch For:**
- **Extreme Language**: "Catastrophic," "devastating," "outrageous"
- **Moral Absolutes**: "Good people," "anyone with sense," "obviously right"
- **Time Pressure**: Emotional urgency without logical urgency
- **Tribal Language**: "Us vs them," "real Americans," "true believers"
- **Consequence Inflation**: Exaggerated outcomes for disagreement

**The Reframe Strategy:**
- "I understand this is important to you. Can you help me understand the specific evidence?"
- "What would convince someone who doesn't share this emotional response?"
- "How would you explain this to someone who needs logical reasons?"

**Questions for Self-Reflection:**
- "Am I being asked to act based on emotion or evidence?"
- "Would this argument be convincing without the emotional content?"
- "Is my emotional response being manipulated?"
- "What would I advise a friend in this situation?"

**Remember:**
- Emotions are valid and important, but they shouldn't replace thinking
- Strong emotions can be a signal to slow down, not speed up
- Good arguments can be made with appropriate emotional content
- You can care deeply about something while still thinking clearly about it

**The Emotional Balance:**
Honor your emotions while maintaining your critical thinking. Don't let feelings be weaponized against your reasoning, but don't ignore legitimate emotional considerations either.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "If you don't donate to our cause right now, innocent children will continue to suffer while you live in comfort. How can you sleep at night knowing you could have helped?",
            question: 'What emotional manipulation techniques do you see here?',
            analysis: 'Multiple emotional manipulation techniques: 1) Guilt induction ("children will suffer"), 2) Personal responsibility transfer ("you could have helped"), 3) Moral shaming ("how can you sleep"), 4) False urgency ("right now"), 5) Comfort vs. suffering contrast. No information about how donations are used or organizational effectiveness.',
            explanation: 'This uses guilt and moral shaming to pressure immediate donation without providing information about the organization\'s effectiveness, how funds are used, or whether immediate action is actually necessary.'
        },
        {
            id: 'example2',
            statement: "This radical policy will destroy our way of life and turn our children against everything we believe in. We must fight back before it's too late!",
            question: 'How is emotion being used to bypass logic here?',
            analysis: 'Emotional manipulation through: 1) Catastrophic language ("destroy our way of life"), 2) Family threat ("turn our children against"), 3) Tribal identity ("everything we believe"), 4) Combat framing ("fight back"), 5) False urgency ("before it\'s too late"). No specific policy analysis or evidence provided.',
            explanation: 'This uses fear and tribal identity to create opposition to a policy without actually discussing what the policy does, its evidence base, or realistic consequences.'
        },
        {
            id: 'example3',
            statement: "This policy change affects 50,000 families who depend on these services. While the fiscal concerns are understandable, we should consider the human impact alongside the budget implications.",
            question: 'How does this differ from emotional manipulation?',
            analysis: 'This shows legitimate emotional content: 1) Specific numbers (50,000 families), 2) Acknowledges other concerns (fiscal), 3) Balanced framing (human impact AND budget), 4) Proportional emotion (concern, not outrage), 5) Invites consideration rather than demanding action. Emotions support rather than replace logical analysis.',
            explanation: 'This demonstrates how emotional considerations can be included appropriately in policy discussions, providing specific information while acknowledging multiple legitimate concerns rather than using emotion to shut down analysis.'
        }
    ];
    const handleAnswerSubmit = (exampleId, answer) => {
        setUserAnswers(prev => ({ ...prev, [exampleId]: answer }));
        setShowFeedback(prev => ({ ...prev, [exampleId]: true }));
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['appeal-to-emotion'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-pink-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4", children: _jsx(Heart, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Appeal to Emotion" }), _jsx("p", { className: "text-lg text-gray-600", children: "How feelings are weaponized against reason" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Heart, { className: "w-5 h-5 text-pink-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Emotional Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowFeedback(prev => ({ ...prev, [example.id]: true })), disabled: showFeedback[example.id], className: "bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showFeedback[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showFeedback[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition", children: "Next" }))] })] }) }));
};
export default AppealToEmotionLesson;
