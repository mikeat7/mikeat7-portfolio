import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BookOpen } from 'lucide-react';
import BackButton from '@/components/BackButton';
const LogicalFallacies = () => {
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
            id: 'fallacies-overview',
            title: 'Fallacies Overview',
            description: 'Introduction to logical fallacies and why they matter',
            route: '/educate/fallacies-overview',
            available: true
        },
        {
            id: 'false-dichotomy',
            title: 'False Dichotomy',
            description: 'Breaking down artificial either/or choices',
            route: '/educate/false-dichotomy',
            available: true
        },
        {
            id: 'false-dilemma',
            title: 'False Dilemma',
            description: 'When complex issues are reduced to two options',
            route: '/educate/false-dilemma',
            available: true
        },
        {
            id: 'red-herring',
            title: 'Red Herring',
            description: 'Spotting deliberate topic changes and distractions',
            route: '/educate/red-herring',
            available: true
        },
        {
            id: 'straw-man',
            title: 'Straw Man Fallacy',
            description: 'Recognizing when your position is misrepresented',
            route: '/educate/straw-man',
            available: true
        },
        {
            id: 'steelman',
            title: 'Steelman Technique',
            description: 'The opposite of straw man - strengthening opposing arguments',
            route: '/educate/steelman',
            available: true
        },
        {
            id: 'ad-hominem',
            title: 'Ad Hominem',
            description: 'When the person is attacked instead of their argument',
            route: '/educate/ad-hominem',
            available: true
        },
        {
            id: 'circular-reasoning',
            title: 'Circular Reasoning',
            description: 'When the conclusion is used to support the premise',
            route: '/educate/circular-reasoning',
            available: true
        }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-orange-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsx(BackButton, {}), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Logical Fallacies" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Master the art of spotting flawed reasoning and invalid arguments" })] }), _jsx("div", { className: "grid gap-4", children: lessons.map((lesson) => (_jsx("div", { className: `p-6 rounded-xl border-2 transition-all duration-200 ${lesson.available
                            ? 'bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60'}`, onClick: () => handleLessonClick(lesson.route, lesson.available), children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-lg ${lesson.available ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-500'}`, children: _jsx(BookOpen, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-1", children: lesson.title }), _jsx("p", { className: "text-sm text-gray-600", children: lesson.description })] }), _jsx("div", { className: "text-xs text-gray-500", children: lesson.available ? 'Available' : 'Coming Soon' })] }) }, lesson.id))) }), _jsx("div", { className: "mt-8 text-center", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Lessons will be activated as content is integrated" }) })] }) }));
};
export default LogicalFallacies;
