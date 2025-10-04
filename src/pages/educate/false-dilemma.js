import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Split, CheckCircle, Lightbulb } from 'lucide-react';
const FalseDilemma = () => {
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
            title: 'Understanding False Dilemma',
            content: `A false dilemma is a specific type of false dichotomy that presents a choice between two undesirable options, making it seem like you must choose the "lesser of two evils" when better alternatives actually exist.

**How False Dilemma Works:**
- Presents two negative options as the only choices
- Makes both options seem undesirable but necessary
- Hides better alternatives that would solve the problem differently
- Forces acceptance of harm by claiming it's unavoidable

**The Structure:**
"We must choose between bad option A or terrible option B" (ignoring good option C)

**Why It's Manipulative:**
- Makes people accept unnecessary harm
- Prevents exploration of creative solutions
- Creates resignation and learned helplessness
- Justifies poor decisions by claiming no alternatives exist

**False Dilemma vs. False Dichotomy:**
- **False Dichotomy**: "Either we do X or Y" (neutral options)
- **False Dilemma**: "Either we suffer X or endure Y" (both negative)

**The Trap:**
False dilemmas make us feel like we're being realistic about hard choices, when we're actually being manipulated into accepting unnecessary limitations.`
        },
        {
            id: 'examples',
            title: 'False Dilemma Patterns',
            content: `**Political Examples:**
- "Either we raise taxes and hurt the economy, or we cut services and hurt the poor"
- "Either we go to war or we appear weak to our enemies"
- "Either we restrict freedoms or we accept terrorist attacks"
- Reality: Creative policy solutions often exist

**Business Examples:**
- "Either we lay off workers or the company goes bankrupt"
- "Either we cut quality or we can't compete on price"
- "Either we work 80-hour weeks or we lose to competitors"
- Reality: Innovation and efficiency improvements often provide alternatives

**Personal Examples:**
- "Either I stay in this bad relationship or I'll be alone forever"
- "Either I take this terrible job or I'll be unemployed"
- "Either I agree with my family or they'll disown me"
- Reality: Other relationships, jobs, and family dynamics are possible

**Environmental Examples:**
- "Either we shut down all industry or we destroy the planet"
- "Either we accept pollution or we accept poverty"
- "Either we stop all development or we lose all wilderness"
- Reality: Sustainable development and technological solutions exist

**The Hidden Third Option:**
False dilemmas often hide the option of changing the system, finding creative solutions, or rejecting the premise that created the dilemma in the first place.`
        },
        {
            id: 'practice',
            title: 'Practice: Finding Hidden Alternatives',
            content: 'Let\'s practice identifying false dilemmas and discovering the hidden alternatives. For each scenario, identify why it\'s a false dilemma and suggest better options.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Escaping False Dilemmas',
            content: `**The Alternative Search:**
When faced with two bad options, ask:
- "Are these really the only choices available?"
- "What would a third option look like?"
- "How could we change the situation to create better options?"
- "What assumptions are creating this dilemma?"

**The Root Cause Analysis:**
- Look for the underlying problem creating the dilemma
- Question whether the dilemma is real or manufactured
- Consider whether the premise itself is flawed
- Explore changing the conditions that created the choice

**The Creative Solution Strategy:**
- Brainstorm alternatives without judging feasibility first
- Combine elements from both options in new ways
- Look for examples of how others solved similar problems
- Consider long-term solutions that eliminate the dilemma

**The Time and Resources Check:**
- Would more time reveal additional options?
- Are there resources that could change the situation?
- Could collaboration with others create new possibilities?
- Is the urgency real or manufactured?

**Red Flags to Watch For:**
- **Resignation Language**: "We have no choice but to..."
- **Necessity Claims**: "We must choose between..."
- **Urgency Pressure**: "We can't wait to find alternatives"
- **Complexity Dismissal**: "It's not that complicated"

**The Reframe Response:**
- "I understand these are the options you see, but let me think about alternatives"
- "What if we stepped back and looked at the underlying problem?"
- "Are there examples of how others have handled similar situations?"
- "What would need to change to create better options?"

**Remember:**
False dilemmas often dissolve when you question their premises or change the conditions that created them. Don't accept unnecessary suffering just because someone presents it as inevitable.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "Our company must either lay off 30% of our workforce or declare bankruptcy. These are our only options given the current financial crisis.",
            question: 'Why is this a false dilemma and what alternatives might exist?',
            analysis: 'This is a false dilemma because it presents only two negative outcomes when alternatives might include: temporary salary cuts across all levels, reduced hours instead of layoffs, seeking additional investment, renegotiating debt terms, pivoting business models, finding new revenue streams, or selling non-essential assets. The "only options" claim prevents exploration of creative solutions.',
            explanation: 'Business challenges often have multiple solutions that aren\'t immediately obvious. False dilemmas in business prevent the creative problem-solving that could save both jobs and the company.'
        },
        {
            id: 'example2',
            statement: "Either we accept higher crime rates in our neighborhood, or we support aggressive policing that will harm community relations. There's no way to have both safety and good police-community relationships.",
            question: 'What makes this a false dilemma?',
            analysis: 'This creates a false dilemma between safety and community relations when many alternatives exist: community policing programs, crime prevention through environmental design, youth programs, mental health services, neighborhood watch programs, restorative justice approaches, police training reforms, or community mediation programs. Many communities have achieved both safety and positive police relations.',
            explanation: 'This false dilemma prevents consideration of the many evidence-based approaches that can improve both safety and community relations simultaneously, rather than treating them as mutually exclusive.'
        },
        {
            id: 'example3',
            statement: "Either we accept that our healthcare system will bankrupt families, or we accept that government control will destroy medical innovation. We can't have affordable care and medical progress.",
            question: 'What alternatives does this false dilemma ignore?',
            analysis: 'This ignores numerous healthcare models that achieve both affordability and innovation: hybrid public-private systems, price regulation with innovation incentives, non-profit insurance models, research funding reforms, international cooperation on drug development, or value-based pricing. Many countries have achieved both affordable healthcare and continued medical innovation.',
            explanation: 'Healthcare policy involves many variables and successful models exist worldwide that achieve multiple goals simultaneously, rather than requiring trade-offs between affordability and innovation.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['false-dilemma'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-teal-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4", children: _jsx(Split, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "False Dilemma" }), _jsx("p", { className: "text-lg text-gray-600", children: "When you're forced to choose between two bad options" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Split, { className: "w-5 h-5 text-teal-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Dilemma Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition", children: "Next" }))] })] }) }));
};
export default FalseDilemma;
