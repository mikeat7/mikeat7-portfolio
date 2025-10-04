import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
const VaguenessLesson = () => {
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
            title: 'The Power of Precision',
            content: `Vague language is one of the most subtle yet powerful tools of manipulation. When someone uses imprecise words, they can make claims that sound meaningful while avoiding accountability.

**Why Vagueness Works:**
- Creates illusion of knowledge without actual content
- Allows speaker to avoid specific commitments
- Makes disagreement difficult (how do you argue with "some people say"?)
- Exploits our tendency to fill in gaps with our own assumptions

**The Vagueness Spectrum:**
- **Precise**: "The study of 1,247 participants found a 23% reduction"
- **Vague**: "Studies show significant improvement"
- **Meaningless**: "Many experts believe it works better"`
        },
        {
            id: 'examples',
            title: 'Vagueness in Action',
            content: `Let's examine how vague language conceals weak arguments:

**Political Example:**
- Vague: "The economy is doing better under our policies"
- Precise: "GDP grew 2.1% this quarter, unemployment fell to 4.2%"

**Medical Example:**
- Vague: "This supplement boosts immunity"
- Precise: "This supplement increased white blood cell count by 15% in a 30-day trial of 200 participants"

**News Example:**
- Vague: "Cases are rising across the country"
- Precise: "COVID cases increased 12% week-over-week in 23 of 50 states"`
        },
        {
            id: 'practice',
            title: 'Practice: Spot the Vagueness',
            content: 'Now let\'s practice identifying vague language. For each statement, identify what makes it vague and how it could be more precise.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against Vagueness',
            content: `**The Precision Response:**
When someone uses vague language, ask for specifics:

- "What do you mean by 'many people'?"
- "Which studies specifically?"
- "Can you quantify 'significant'?"
- "What's your definition of 'better'?"

**The Clarification Technique:**
- "Help me understand what you mean by..."
- "Could you be more specific about..."
- "What evidence supports that claim?"

**Red Flags to Watch For:**
- Weasel words: "some," "many," "often," "frequently"
- Undefined superlatives: "best," "most," "leading"
- Vague quantities: "a lot," "significant," "substantial"
- Anonymous authorities: "experts say," "studies show"`
        }
    ];
    const practiceQuestions = [
        {
            id: 'q1',
            statement: "Many doctors recommend this treatment for better health outcomes.",
            correctAnswer: "Vague terms: 'many doctors' (how many?), 'better health outcomes' (better than what? by how much?)",
            explanation: "This statement uses multiple vague terms that make it impossible to verify or evaluate the claim."
        },
        {
            id: 'q2',
            statement: "Studies show that people who exercise regularly live longer.",
            correctAnswer: "Vague terms: 'studies' (which studies?), 'regularly' (how often?), 'longer' (how much longer?)",
            explanation: "While this may be true, the vague language prevents us from understanding the actual evidence."
        },
        {
            id: 'q3',
            statement: "Our product is significantly more effective than the competition.",
            correctAnswer: "Vague terms: 'significantly' (by what measure?), 'more effective' (at what?), 'competition' (which competitors?)",
            explanation: "Marketing language designed to sound impressive while making no verifiable claims."
        }
    ];
    const handleAnswerSubmit = (questionId, answer) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
        setShowFeedback(prev => ({ ...prev, [questionId]: true }));
    };
    const completeLesson = () => {
        // Mark lesson as completed in localStorage
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['vagueness'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        // Navigate back to education hub
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4", children: _jsx(Target, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Vagueness & Precision" }), _jsx("p", { className: "text-lg text-gray-600", children: "Learn to identify and counter imprecise language that conceals weak arguments" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceQuestions.map((question, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-orange-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Question ", index + 1] }), _jsxs("p", { className: "text-gray-700 italic mb-4", children: ["\"", question.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "What makes this statement vague? How could it be more precise?" })] })] }), _jsx("button", { onClick: () => setShowFeedback(prev => ({ ...prev, [question.id]: true })), disabled: showFeedback[question.id], className: "bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showFeedback[question.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showFeedback[question.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Sample Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: question.correctAnswer }), _jsx("p", { className: "text-sm text-blue-600", children: question.explanation })] })] }) }))] }, question.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition", children: "Next" }))] })] }) }));
};
export default VaguenessLesson;
