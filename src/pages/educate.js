import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, AlertTriangle, Zap, Trophy, ArrowLeft } from 'lucide-react';
const EducationHub = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleCategoryClick = (route) => {
        navigate(route);
        // Scroll to top will be handled by the destination page
    };
    const handleBackToHome = () => {
        navigate('/');
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };
    const categories = [
        {
            id: 'epistemic-foundations',
            title: 'Epistemic Foundations',
            description: 'Build your foundation in critical thinking and intellectual humility',
            icon: _jsx(Brain, { className: "w-8 h-8" }),
            color: 'from-blue-500 to-indigo-600',
            route: '/educate/epistemic-foundations'
        },
        {
            id: 'bullshit-detection',
            title: 'Bullshit Detection',
            description: 'Learn to identify manipulation, fallacies, and deceptive language',
            icon: _jsx(Target, { className: "w-8 h-8" }),
            color: 'from-purple-500 to-violet-600',
            route: '/educate/bullshit-detection'
        },
        {
            id: 'logical-fallacies',
            title: 'Logical Fallacies',
            description: 'Master the art of spotting flawed reasoning and invalid arguments',
            icon: _jsx(AlertTriangle, { className: "w-8 h-8" }),
            color: 'from-orange-500 to-amber-600',
            route: '/educate/logical-fallacies'
        },
        {
            id: 'ai-awareness',
            title: 'AI Awareness',
            description: 'Understand how AI systems work, fail, and can be manipulated',
            icon: _jsx(Zap, { className: "w-8 h-8" }),
            color: 'from-cyan-500 to-teal-600',
            route: '/educate/ai-awareness'
        },
        {
            id: 'advanced-practice',
            title: 'Advanced Practice',
            description: 'Master-level exercises in clarity, precision, and truth detection',
            icon: _jsx(Trophy, { className: "w-8 h-8" }),
            color: 'from-slate-500 to-gray-600',
            route: '/educate/advanced-practice'
        }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: handleBackToHome, className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Home"] }), _jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Education Hub" }), _jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Master the art of clear thinking, bullshit detection, and epistemic humility. Your journey to intellectual freedom starts here." })] }), _jsx("div", { className: "grid gap-8 max-w-4xl mx-auto", children: categories.map((category) => (_jsx("div", { onClick: () => handleCategoryClick(category.route), className: "group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50", children: _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: `p-4 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`, children: category.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors", children: category.title }), _jsx("p", { className: "text-gray-600 text-lg leading-relaxed", children: category.description })] }), _jsx("div", { className: "text-gray-400 group-hover:text-blue-500 transition-colors", children: _jsx(ArrowLeft, { className: "w-6 h-6 rotate-180" }) })] }) }, category.id))) }), _jsx("div", { className: "text-center mt-16", children: _jsxs("p", { className: "text-sm text-gray-500 italic max-w-2xl mx-auto", children: ["\"The first principle is that you must not fool yourself \u2014 and you are the easiest person to fool.\"", _jsx("br", {}), "\u2014 Richard Feynman"] }) }), _jsx("div", { className: "mt-12 mb-8", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-100 to-indigo-100 rounded-2xl p-8 shadow-lg border border-slate-200", children: [_jsx("h2", { className: "text-2xl font-bold text-center mb-6 text-slate-800", children: "What is \"Truth Serum + Clarity Armor\"?" }), _jsxs("div", { className: "prose prose-lg max-w-none text-slate-700", children: [_jsx("p", { className: "text-lg leading-relaxed mb-6", children: "Truth Serum + Clarity Armor represents a paradigmatic synthesis of computational linguistics, epistemic philosophy, and cognitive science\u2014engineered to detect and neutralize semantic manipulation in real-time discourse analysis." }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { className: "bg-white/70 p-6 rounded-xl border border-slate-200", children: [_jsxs("h3", { className: "font-semibold text-slate-800 mb-3 flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-indigo-500 rounded-full" }), "Computational Architecture"] }), _jsx("p", { className: "text-sm text-slate-600", children: "Our VX (Verification eXtension) detection engine employs 16+ specialized algorithms for rhetorical manipulation taxonomy, featuring adaptive Bayesian confidence calibration and co-firing detection vectors that identify sophisticated propaganda techniques." })] }), _jsxs("div", { className: "bg-white/70 p-6 rounded-xl border border-slate-200", children: [_jsxs("h3", { className: "font-semibold text-slate-800 mb-3 flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-purple-500 rounded-full" }), "Epistemic Framework"] }), _jsx("p", { className: "text-sm text-slate-600", children: "Integrates intellectual humility training, mental model construction, and critical thinking pedagogy through interactive curricula designed to build cognitive immunity against manipulation while preserving legitimate scientific discourse." })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 mb-6", children: [_jsx("h3", { className: "font-semibold text-indigo-800 mb-3", children: "Abner's Vision Realized" }), _jsx("p", { className: "text-sm text-indigo-700 leading-relaxed", children: "This platform embodies Abner's foundational insight: that artificial intelligence systems require epistemic humility training to resist the inherent \"bullshitting\" tendencies embedded in pattern-matching architectures. Through collaborative development between Claude Sonnet 4, Grok 3, and human facilitator Mike, we've constructed a comprehensive framework for detecting rhetorical manipulation while protecting legitimate intellectual inquiry." })] }), _jsx("div", { className: "text-center", children: _jsxs("p", { className: "text-sm text-slate-600 italic", children: [_jsx("strong", { children: "Collaborative Achievement:" }), " Advanced AI systems working in concert with human expertise to build tools for intellectual freedom and epistemic clarity\u2014demonstrating that the future of AI development lies in transparent, humble, and ethically-aligned cooperation."] }) })] })] }) })] }) }));
};
export default EducationHub;
