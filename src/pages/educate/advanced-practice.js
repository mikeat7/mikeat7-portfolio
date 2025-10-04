import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, BookOpen, Target } from 'lucide-react';
import BackButton from '@/components/BackButton';
const AdvancedPractice = () => {
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
    const handleSandboxClick = () => {
        navigate('/testing');
    };
    const lessons = [
        {
            id: 'epistemic-sandbox',
            title: 'Epistemic Sandbox',
            description: 'Safe environment to practice critical thinking skills',
            route: '/educate/epistemic-sandbox',
            available: true, // This one is already implemented
            type: 'practice'
        },
        {
            id: 'narrative-framing-analysis',
            title: 'Narrative Framing Analysis',
            description: 'Deconstructing how stories shape perception',
            route: '/educate/narrative-framing-analysis',
            available: true,
            type: 'assessment'
        }
    ];
    const getTypeIcon = (type) => {
        switch (type) {
            case 'practice': return _jsx(Target, { className: "w-5 h-5" });
            case 'assessment': return _jsx(Trophy, { className: "w-5 h-5" });
            default: return _jsx(BookOpen, { className: "w-5 h-5" });
        }
    };
    const getTypeColor = (type, available) => {
        if (!available)
            return 'bg-gray-200 text-gray-500';
        switch (type) {
            case 'practice': return 'bg-blue-100 text-blue-700';
            case 'assessment': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-gray-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsx(BackButton, {}), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full mb-4", children: _jsx(Trophy, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Advanced Practice" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Master-level exercises in clarity, precision, and truth detection" })] }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl", children: [_jsx(Target, { className: "w-12 h-12 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-bold mb-4 text-center", children: "Ready to Practice?" }), _jsx("p", { className: "text-indigo-100 mb-6 max-w-2xl mx-auto text-center", children: "Jump into our safe practice environment where you can test your skills without consequences. Perfect for experimenting with new concepts." }), _jsx("div", { className: "text-center", children: _jsx("button", { onClick: handleSandboxClick, className: "bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg", children: "Enter Practice Sandbox" }) })] }) }), _jsx("div", { className: "grid gap-4", children: lessons.map((lesson) => (_jsx("div", { className: `p-6 rounded-xl border-2 transition-all duration-200 ${lesson.available
                            ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60'}`, onClick: () => handleLessonClick(lesson.route, lesson.available), children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-lg ${getTypeColor(lesson.type, lesson.available)}`, children: getTypeIcon(lesson.type) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-semibold text-gray-800", children: lesson.title }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${lesson.type === 'practice' ? 'bg-blue-100 text-blue-700' :
                                                        lesson.type === 'assessment' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-gray-100 text-gray-700'}`, children: lesson.type })] }), _jsx("p", { className: "text-sm text-gray-600", children: lesson.description })] }), _jsx("div", { className: "text-xs text-gray-500", children: lesson.available ? 'Available' : 'Coming Soon' })] }) }, lesson.id))) }), _jsx("div", { className: "mt-8 text-center", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Advanced lessons will be activated as content is integrated" }) })] }) }));
};
export default AdvancedPractice;
