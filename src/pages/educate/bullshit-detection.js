import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, BookOpen } from 'lucide-react';
const BullshitDetection = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleBackToEducationHub = () => {
        navigate('/educate');
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };
    const handleLessonClick = (route, available) => {
        if (available) {
            navigate(route);
        }
    };
    const lessons = [
        {
            id: 'detect-bullshit',
            title: 'Detect Bullshit',
            description: 'Core principles of identifying deceptive communication',
            route: '/educate/detect-bullshit',
            available: true
        },
        {
            id: 'vagueness',
            title: 'Vagueness',
            description: 'How imprecise language conceals weak arguments',
            route: '/educate/vagueness',
            available: true // This one is already implemented
        },
        {
            id: 'emotional-framing',
            title: 'Emotional Framing',
            description: 'Recognizing when emotions are used to bypass logic',
            route: '/educate/emotional-framing',
            available: true // This one is already implemented
        },
        {
            id: 'speculative-authority',
            title: 'Speculative Authority',
            description: 'Identifying misuse of expertise and credentials',
            route: '/educate/speculative-authority',
            available: true // This one is already implemented
        },
        {
            id: 'citation-laundering',
            title: 'Citation Laundering',
            description: 'How false information gains credibility through repetition',
            route: '/educate/bullshit-types/citation-laundering',
            available: true // This one is already implemented
        },
        {
            id: 'jargon-overload',
            title: 'Jargon Overload',
            description: 'When technical language is used to confuse rather than clarify',
            route: '/educate/jargon-overload',
            available: true
        },
        {
            id: 'false-urgency',
            title: 'False Urgency',
            description: 'Manufactured time pressure to prevent careful consideration',
            route: '/educate/false-urgency',
            available: true
        },
        {
            id: 'appeal-to-authority',
            title: 'Appeal to Authority',
            description: 'When expert opinion becomes logical fallacy',
            route: '/educate/appeal-to-authority',
            available: true
        },
        {
            id: 'appeal-to-emotion',
            title: 'Appeal to Emotion',
            description: 'How feelings are weaponized against reason',
            route: '/educate/appeal-to-emotion',
            available: true
        }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-purple-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: handleBackToEducationHub, className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mb-4", children: _jsx(Target, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Bullshit Detection" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Learn to identify manipulation, fallacies, and deceptive language" })] }), _jsx("div", { className: "grid gap-4", children: lessons.map((lesson) => (_jsx("div", { className: `p-6 rounded-xl border-2 transition-all duration-200 ${lesson.available
                            ? 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60'}`, onClick: () => handleLessonClick(lesson.route, lesson.available), children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-lg ${lesson.available ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`, children: _jsx(BookOpen, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-1", children: lesson.title }), _jsx("p", { className: "text-sm text-gray-600", children: lesson.description })] }), _jsx("div", { className: "text-xs text-gray-500", children: lesson.available ? 'Available' : 'Coming Soon' })] }) }, lesson.id))) }), _jsx("div", { className: "mt-8 text-center", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Lessons will be activated as content is integrated" }) })] }) }));
};
export default BullshitDetection;
