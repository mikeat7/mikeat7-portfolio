import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Lightbulb } from 'lucide-react';
const Steelman = () => {
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
            title: 'Understanding the Steelman Technique',
            content: `The steelman technique is the opposite of the straw man fallacy. Instead of misrepresenting an opponent's argument to make it weaker, you strengthen their argument to its most reasonable and defensible form before addressing it.

**How Steelman Works:**
- Find the strongest version of the opposing argument
- Address their best points, not their weakest
- Assume good faith and intelligent reasoning
- Engage with the most charitable interpretation of their position

**Why Use Steelman:**
- Leads to more productive discussions
- Builds trust and respect with opponents
- Helps you understand issues more deeply
- Makes your own arguments stronger by addressing real challenges
- Demonstrates intellectual honesty and good faith

**Steelman vs. Straw Man:**
- **Straw Man**: "So you're saying [weak version of their argument]"
- **Steelman**: "The strongest version of your argument seems to be [charitable interpretation]"

**The Intellectual Virtue:**
Steelmanning is a form of intellectual humility—it acknowledges that your opponents might have good reasons for their positions, even if you ultimately disagree.

**When to Use Steelman:**
- When you want to have productive disagreements
- When you're genuinely trying to understand an issue
- When you want to strengthen your own position
- When you're facilitating discussions between opposing sides`
        },
        {
            id: 'technique',
            title: 'How to Steelman Effectively',
            content: `**Step 1: Listen Carefully**
- Pay attention to the actual argument being made
- Look for underlying values and concerns
- Identify the strongest evidence they present
- Notice qualifications and nuances they include

**Step 2: Find the Charitable Interpretation**
- Assume they're making their argument in good faith
- Look for the most reasonable version of their position
- Consider what intelligent people might find compelling about it
- Identify legitimate concerns or values behind their argument

**Step 3: Strengthen Their Position**
- Add evidence or reasoning that supports their view
- Address potential weaknesses in their argument
- Consider how they might respond to obvious objections
- Present their position as compellingly as possible

**Step 4: Engage with the Strong Version**
- Address their argument at its strongest, not its weakest
- Acknowledge what's compelling about their position
- Explain where you still disagree and why
- Show that you've taken their argument seriously

**Example of Steelmanning:**
Original: "I don't think we should raise the minimum wage"
Weak Response (Straw Man): "So you don't care about poor people!"
Strong Response (Steelman): "The strongest argument against raising minimum wage is that it might reduce employment opportunities for entry-level workers, particularly in small businesses operating on thin margins. This concern comes from caring about employment opportunities for the most vulnerable workers. However, I think the evidence suggests..."

**The Principle:**
Always argue against the strongest version of an opposing position, not the weakest.`
        },
        {
            id: 'practice',
            title: 'Practice: Steelmanning Arguments',
            content: 'Let\'s practice taking weak or poorly expressed arguments and strengthening them before responding. This builds your ability to engage productively with disagreement.',
            interactive: true
        },
        {
            id: 'benefits',
            title: 'Benefits of Steelmanning',
            content: `**Personal Benefits:**
- **Deeper Understanding**: Forces you to really comprehend opposing views
- **Stronger Arguments**: Your rebuttals become more compelling when they address strong positions
- **Intellectual Growth**: Challenges you to think beyond your initial reactions
- **Reduced Bias**: Helps overcome confirmation bias and motivated reasoning

**Relationship Benefits:**
- **Trust Building**: Shows opponents you're engaging in good faith
- **Respect Earning**: Demonstrates intellectual honesty and fairness
- **Productive Disagreement**: Creates space for meaningful dialogue
- **Conflict Resolution**: Helps find common ground and shared values

**Discussion Benefits:**
- **Higher Quality Debates**: Elevates the level of discourse
- **Learning Opportunities**: Everyone learns more from engaging with strong arguments
- **Problem Solving**: Better solutions emerge from addressing real concerns
- **Collaborative Thinking**: Transforms adversarial debates into collaborative truth-seeking

**Societal Benefits:**
- **Reduced Polarization**: Helps bridge divides between opposing groups
- **Better Decision Making**: Policies improve when all strong arguments are considered
- **Democratic Discourse**: Strengthens the quality of public debate
- **Intellectual Culture**: Promotes norms of charitable interpretation

**When Steelmanning is Challenging:**
- When you strongly disagree with someone
- When their argument seems obviously wrong to you
- When you're emotionally invested in the outcome
- When time pressure makes quick responses tempting

**The Long-term Payoff:**
Steelmanning takes more effort initially but leads to much more productive and satisfying discussions over time.

**Remember:**
The goal isn't to agree with everyone, but to disagree more intelligently and productively.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: 'Weak argument: "School choice is bad because it hurts public schools." Your task: Steelman this position before responding.',
            question: 'How would you strengthen this argument before addressing it?',
            analysis: 'Steelman version: "The strongest argument against school choice is that it may create a two-tiered system where well-informed, resourced families leave public schools, concentrating disadvantaged students in under-resourced institutions. This could worsen educational inequality and undermine the democratic ideal of quality public education for all children, particularly harming those whose families lack the time, information, or resources to navigate school choice options effectively."',
            explanation: 'This steelman transforms a simple assertion into a nuanced argument about equity, democratic values, and systemic effects, making it much more compelling and worthy of serious engagement.'
        },
        {
            id: 'example2',
            statement: 'Weak argument: "We shouldn\'t have universal healthcare because it\'s too expensive." Your task: Steelman this position.',
            question: 'How would you present the strongest version of this argument?',
            analysis: 'Steelman version: "The strongest argument against universal healthcare is that rapid transition could disrupt existing coverage for millions who are satisfied with their current plans, while the fiscal costs might require significant tax increases or deficit spending that could harm economic growth. Additionally, government-run systems might reduce innovation incentives in medical technology and pharmaceuticals, potentially slowing medical advances that benefit everyone globally."',
            explanation: 'This steelman addresses real concerns about transition costs, disruption, fiscal responsibility, and innovation effects, making it a much more substantial argument that deserves thoughtful response rather than dismissal.'
        },
        {
            id: 'example3',
            statement: 'Weak argument: "Climate change policies will hurt the economy." Your task: Steelman this economic concern.',
            question: 'What\'s the strongest version of this economic argument?',
            analysis: 'Steelman version: "The strongest economic argument is that rapid decarbonization could disproportionately impact working-class communities dependent on fossil fuel industries, potentially causing job losses and economic disruption in regions without alternative economic opportunities. Additionally, if climate policies increase energy costs significantly, they could harm low-income families and reduce industrial competitiveness, potentially driving production to countries with weaker environmental standards."',
            explanation: 'This steelman focuses on legitimate concerns about economic justice, regional impacts, and global competitiveness, creating a much more compelling argument that requires serious policy solutions rather than dismissal.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['steelman'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4", children: _jsx(Shield, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Steelman Technique" }), _jsx("p", { className: "text-lg text-gray-600", children: "The opposite of straw man - strengthening opposing arguments" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Shield, { className: "w-5 h-5 text-indigo-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Steelman Practice ", index + 1] }), _jsx("div", { className: "bg-gray-50 p-4 rounded-md mb-4", children: _jsx("p", { className: "text-gray-700 text-sm", children: example.statement }) }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Steelman' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-purple-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-purple-800 mb-2", children: "Expert Steelman:" }), _jsx("p", { className: "text-purple-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-purple-600", children: [_jsx("strong", { children: "Why This Works:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition", children: "Next" }))] })] }) }));
};
export default Steelman;
