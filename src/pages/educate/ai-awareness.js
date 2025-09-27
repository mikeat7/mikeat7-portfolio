import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BookOpen } from 'lucide-react';
import BackButton from '@/components/BackButton';
const AIAwareness = () => {
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
    const lessons = [
        {
            id: 'ai-aware',
            title: 'AI Aware',
            description: 'Developing intuition for AI-generated content and strategic AI use',
            route: '/educate/ai-aware',
            available: true // This one is already implemented
        },
        {
            id: 'how-llms-bullshit',
            title: 'How LLMs Bullshit',
            description: 'The mechanics of AI deception and hallucination',
            route: '/educate/how-llms-bullshit',
            available: true // This one is already implemented
        },
        {
            id: 'become-ai-aware',
            title: 'Become AI Aware',
            description: 'Advanced techniques for identifying and working with AI systems',
            route: '/educate/become-ai-aware',
            available: true
        },
        {
            id: 'ai-behavior-patterns',
            title: 'AI Behavior Patterns',
            description: 'Real stories about AI behavior and communication patterns',
            route: '/educate/ai-behavior-patterns',
            available: true
        }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsx(BackButton, {}), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full mb-4", children: _jsx(Zap, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "AI Awareness" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Understand how AI systems work, fail, and can be manipulated" })] }), _jsx("div", { className: "grid gap-4", children: lessons.map((lesson) => (_jsx("div", { className: `p-6 rounded-xl border-2 transition-all duration-200 ${lesson.available
                            ? 'bg-white border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60'}`, onClick: () => handleLessonClick(lesson.route, lesson.available), children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-lg ${lesson.available ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-200 text-gray-500'}`, children: _jsx(BookOpen, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-1", children: lesson.title }), _jsx("p", { className: "text-sm text-gray-600", children: lesson.description })] }), _jsx("div", { className: "text-xs text-gray-500", children: lesson.available ? 'Available' : 'Coming Soon' })] }) }, lesson.id))) }), _jsx("div", { className: "mt-8 text-center", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Lessons will be activated as content is integrated" }) })] }) }));
};
export default AIAwareness;
