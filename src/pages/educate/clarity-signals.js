import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import SignalLegend from "@/components/SignalLegend";
export default function ClaritySignalsPage() {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleBack = () => {
        navigate('/educate/epistemic-foundations');
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['clarity-signals'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50", children: _jsxs("div", { className: "max-w-3xl mx-auto p-6", children: [_jsxs("button", { onClick: handleBack, className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Epistemic Foundations"] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-900", children: "Understanding Clarity Signals" }), _jsx("p", { className: "mb-6 text-lg text-gray-700 leading-relaxed", children: "Clarity Signals are a beta tool that reflect how an input may be *phrased*, not what it means or whether it's true. These indicators focus on rhetorical structure \u2014 including emotional tone, logical form, and epistemic language." }), _jsx(SignalLegend, {}), _jsx("h2", { className: "text-2xl font-semibold mt-8 mb-4 text-gray-800", children: "What These Signals Do" }), _jsxs("ul", { className: "list-disc list-inside mb-6 space-y-2 text-gray-700", children: [_jsx("li", { children: "Highlight when phrasing is clear and cautious (\uD83D\uDFE2 Clarity)" }), _jsx("li", { children: "Flag emotionally loaded or persuasive language (\uD83D\uDFE1 Tone)" }), _jsx("li", { children: "Detect logical contradictions or reasoning errors (\uD83D\uDD34 Conflict)" }), _jsx("li", { children: "Stay silent if nothing notable is detected (\u26AA Neutral)" })] }), _jsxs("h2", { className: "text-2xl font-semibold mt-8 mb-4 text-gray-800", children: ["What These Signals Do ", _jsx("em", { children: "Not" }), " Do"] }), _jsxs("ul", { className: "list-disc list-inside mb-6 space-y-2 text-gray-700", children: [_jsx("li", { children: "They do not judge truth, accuracy, or intent" }), _jsx("li", { children: "They do not analyze a speaker's motive" }), _jsx("li", { children: "They do not detect bias, deception, or malice" }), _jsx("li", { children: "They do not evaluate whether something is good or bad" })] }), _jsx("h2", { className: "text-2xl font-semibold mt-8 mb-4 text-gray-800", children: "Suggested Use Cases" }), _jsxs("ul", { className: "list-disc list-inside mb-6 space-y-2 text-gray-700", children: [_jsx("li", { children: "Compare tone between academic and opinion writing" }), _jsx("li", { children: "Spot rhetorical shifts in public communication" }), _jsx("li", { children: "Teach argumentation and epistemic humility" }), _jsx("li", { children: "Analyze emotional temperature in difficult conversations" })] }), _jsx("div", { className: "mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "italic text-sm text-blue-700", children: [_jsx("strong", { children: "Note:" }), " Signal detection is experimental and reflective. It is not a substitute for critical thinking or context-aware interpretation."] }) }), _jsx("div", { className: "text-center mt-8", children: _jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mx-auto", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] }) })] })] }) }));
}
