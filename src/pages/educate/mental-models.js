import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Network, CheckCircle, Lightbulb } from 'lucide-react';
const MentalModels = () => {
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
            title: 'Understanding Mental Models',
            content: `Mental models are frameworks that help us make sense of the world. They're simplified representations of complex systems, allowing us to reason, predict, and act effectively. Everyone uses them — but not always consciously.

**What Mental Models Are:**
- Cognitive frameworks for understanding reality
- Simplified representations of complex systems
- Tools for reasoning, prediction, and decision-making
- Interconnected concepts that form a "latticework" of understanding

**Why They Matter:**
A strong thinker builds many mental models across domains (science, economics, psychology, etc.), and evaluates situations using a lattice of overlapping ideas. Critical thinking depends on this latticework. You don't just memorize facts — you build tools for understanding.

**The Latticework Approach:**
Charlie Munger popularized the idea that wisdom comes from having multiple mental models from different disciplines. When you encounter a problem, you can apply several models to get a more complete understanding.

**Key Insight:**
The map is not the territory. Mental models are useful simplifications, but they're not reality itself. The best thinkers know when to use which model and when models break down.`
        },
        {
            id: 'examples',
            title: 'Essential Mental Models',
            content: `**Core Mental Models for Clear Thinking:**

**1. First Principles Thinking**
- Break problems down to fundamental truths
- Question assumptions and conventional wisdom
- Build understanding from the ground up

**2. Second-Order Effects**
- Look beyond immediate consequences
- Consider what happens after what happens
- Anticipate unintended consequences

**3. Opportunity Cost**
- Every choice has a trade-off
- Consider what you're giving up when you choose something
- Resources (time, money, attention) are limited

**4. Confirmation Bias**
- We seek information that supports our existing beliefs
- Actively look for disconfirming evidence
- Question your own reasoning

**5. Inversion**
- Think backwards from your desired outcome
- Consider what could go wrong
- "What would failure look like?"

**6. Systems Thinking**
- Understand how parts interact within wholes
- Look for feedback loops and emergent properties
- Consider the system, not just individual components

**7. Base Rate Neglect**
- Consider how common something is in general
- Don't ignore statistical baselines
- Personal anecdotes aren't representative data`
        },
        {
            id: 'practice',
            title: 'Practice: Applying Mental Models',
            content: 'Let\'s practice applying different mental models to real-world scenarios. Consider which models are most relevant and how they change your analysis.',
            interactive: true
        },
        {
            id: 'building',
            title: 'Building Your Mental Model Toolkit',
            content: `**How to Build Mental Models:**

**1. Study Multiple Disciplines**
- Read widely across fields: psychology, economics, biology, physics, history
- Look for patterns and principles that apply across domains
- Don't stay in your expertise silo

**2. Practice Active Application**
- Consciously apply models to daily decisions
- Ask "What mental models apply here?"
- Test your models against reality

**3. Collect and Organize**
- Keep a list of useful mental models
- Write down examples of when they apply
- Note when models fail or have limitations

**4. Seek Disconfirming Evidence**
- Test your models against contradictory data
- Look for situations where they break down
- Update or abandon models that don't work

**5. Build Connections**
- Look for how different models relate to each other
- Create your own "latticework" of understanding
- Use multiple models to analyze complex problems

**Remember:**
- All models are wrong, but some are useful
- The goal is better thinking, not perfect prediction
- Simple models often work better than complex ones
- Multiple models give you multiple perspectives

**Inspired by:**
Charlie Munger, Bret Weinstein, and other thinkers who prize structured, humble, cross-disciplinary thinking.`
        }
    ];
    const practiceScenarios = [
        {
            id: 'scenario1',
            situation: 'Your company is considering launching a new product. Initial market research looks promising, and the team is excited. However, you need to make a recommendation to leadership.',
            question: 'Which mental models would help you analyze this decision?',
            analysis: 'Relevant models: 1) Second-order effects (what happens after launch?), 2) Opportunity cost (what else could we do with these resources?), 3) Confirmation bias (are we only seeing positive data?), 4) Base rate neglect (what\'s the typical success rate for new products?), 5) Inversion (what would failure look like?).',
            explanation: 'Using multiple models gives you a more complete analysis than relying on initial enthusiasm alone. Each model reveals different aspects of the decision.'
        },
        {
            id: 'scenario2',
            situation: 'You\'re reading news about a controversial policy proposal. The article presents strong arguments on one side, and you find yourself agreeing with the position.',
            question: 'How would mental models help you think more clearly about this issue?',
            analysis: 'Relevant models: 1) Confirmation bias (am I seeking agreeable information?), 2) First principles (what are the fundamental issues?), 3) Second-order effects (what are the long-term consequences?), 4) Systems thinking (how does this fit into larger systems?), 5) Inversion (what would opponents say?).',
            explanation: 'Mental models help you step back from emotional reactions and analyze issues more systematically, considering multiple perspectives and long-term implications.'
        },
        {
            id: 'scenario3',
            situation: 'A friend asks for advice about whether to quit their job to start a business. They\'re passionate about their idea and believe it will be successful.',
            question: 'What mental models would guide your advice?',
            analysis: 'Relevant models: 1) Opportunity cost (what are they giving up?), 2) Base rate neglect (what\'s the typical startup success rate?), 3) Confirmation bias (are they only seeing positive aspects?), 4) First principles (what does success actually require?), 5) Inversion (what would failure cost them?).',
            explanation: 'Mental models help you give more thoughtful advice by considering factors beyond enthusiasm, including realistic assessments of risks and requirements for success.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['mental-models'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-teal-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4", children: _jsx(Network, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Mental Models" }), _jsx("p", { className: "text-lg text-gray-600", children: "Frameworks for understanding how the world works" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceScenarios.map((scenario, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Network, { className: "w-5 h-5 text-teal-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Scenario ", index + 1] }), _jsx("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md", children: scenario.situation }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: scenario.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [scenario.id]: true })), disabled: showAnswers[scenario.id], className: "bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[scenario.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[scenario.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: scenario.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", scenario.explanation] })] })] }) }))] }, scenario.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition", children: "Next" }))] })] }) }));
};
export default MentalModels;
