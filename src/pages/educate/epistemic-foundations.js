import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, BookOpen } from 'lucide-react';
const EpistemicFoundations = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleLessonClick = (route, available) => {
        if (available) {
            navigate(route);
        }
    };
    // Placeholder lessons - will be populated as you provide the files
    const lessons = [
        {
            id: 'clarity-signals',
            title: 'Clarity Signals',
            description: 'Learn to recognize linguistic patterns that indicate clear vs. manipulative communication',
            route: '/educate/clarity-signals',
            available: true
        },
        {
            id: 'certainty-vs-trust',
            title: 'Certainty vs Trust',
            description: 'Understanding the difference between confidence and trustworthiness',
            route: '/educate/certainty-vs-trust',
            available: true
        },
        {
            id: 'cognitive-dissonance',
            title: 'Cognitive Dissonance',
            description: 'How conflicting beliefs affect our reasoning and decision-making',
            route: '/educate/cognitive-dissonance',
            available: true
        },
        {
            id: 'confirmation-bias',
            title: 'Confirmation Bias',
            description: 'Why we seek information that confirms our existing beliefs',
            route: '/educate/confirmation-bias',
            available: true
        },
        {
            id: 'epistemic-humility',
            title: 'Epistemic Humility',
            description: 'The intellectual virtue of knowing the limits of your knowledge',
            route: '/educate/epistemic-humility',
            available: true
        },
        {
            id: 'mental-models',
            title: 'Mental Models',
            description: 'Frameworks for understanding how the world works',
            route: '/educate/mental-models',
            available: true
        },
        {
            id: 'narrative-framing',
            title: 'Narrative Framing',
            description: 'How stories shape our perception of reality',
            route: '/educate/narrative-framing',
            available: true
        },
        {
            id: 'why-certainty-sells',
            title: 'Why Certainty Sells',
            description: 'The psychological appeal of confident claims and absolute answers',
            route: '/educate/why-certainty-sells',
            available: true
        }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4", children: _jsx(Brain, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Epistemic Foundations" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Build your foundation in critical thinking and intellectual humility" })] }), _jsx("div", { className: "grid gap-4", children: lessons.map((lesson) => (_jsx("div", { className: `p-6 rounded-xl border-2 transition-all duration-200 ${lesson.available
                            ? 'bg-white border-blue-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60'}`, onClick: () => handleLessonClick(lesson.route, lesson.available), children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-lg ${lesson.available ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`, children: _jsx(BookOpen, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-1", children: lesson.title }), _jsx("p", { className: "text-sm text-gray-600", children: lesson.description })] }), _jsx("div", { className: "text-xs text-gray-500", children: lesson.available ? 'Available' : 'Coming Soon' })] }) }, lesson.id))) }), _jsx("div", { className: "mt-8 text-center", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Lessons will be activated as content is integrated" }) })] }) }));
};
export default EpistemicFoundations;
