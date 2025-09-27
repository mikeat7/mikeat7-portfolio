import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/analyze.tsx
import { useState } from 'react';
import { useVXContext } from '@/context/VXProvider';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import CoFirePanel from '@/components/CoFirePanel';
import BackButton from '@/components/BackButton';
import '@/styles.css'; // ✅ bubbles
const AnalyzePage = () => {
    const { reflexFrames, setReflexFrames, isAnalyzing, setIsAnalyzing } = useVXContext();
    const [input, setInput] = useState('');
    const [analysisCount, setAnalysisCount] = useState(0);
    const handleAnalyze = async () => {
        if (!input.trim())
            return;
        setIsAnalyzing(true);
        setReflexFrames([]);
        try {
            const analysis = await runReflexAnalysis(input);
            setReflexFrames(analysis);
            setAnalysisCount(prev => prev + 1);
        }
        catch (error) {
            console.error('🚨 Analysis failed:', error);
            setReflexFrames([]);
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-[#e9eef5] py-10", children: [_jsx("div", { className: "bubble-bg", children: [
                    "epistemic humility", "source, then claim", "no false precision",
                    "seek disconfirming evidence", "explain uncertainty", "avoid vague authority",
                    "cite or qualify"
                ].map((t, i) => (_jsx("span", { className: "bubble-text", children: t }, i))) }), _jsxs("div", { className: "relative max-w-6xl mx-auto px-4", children: [_jsx(BackButton, {}), _jsxs("div", { className: "rounded-3xl p-8 md:p-10", style: {
                            background: "#e9eef5",
                            boxShadow: "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
                        }, children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Analyze a Statement" }), _jsxs("p", { className: "mt-2 text-slate-700", children: ["Paste any text\u2014or a URL\u2014to reveal hidden assumptions, emotional manipulation, semantic patterns, and missing context. This page also handles", _jsx("strong", { children: " Scientific Paper Checks" }), " (triage methods & references) and", _jsx("strong", { children: " Link & Article Audits" }), "."] }), _jsxs("div", { className: "mt-6 space-y-3", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), disabled: isAnalyzing, className: "w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400", rows: 6, placeholder: "Paste a paragraph, a link to an article, or a snippet from a methods section\u2026" }), _jsx("button", { onClick: handleAnalyze, disabled: !input.trim() || isAnalyzing, className: "px-6 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50", children: isAnalyzing ? 'Analyzing…' : 'Run Analysis' }), analysisCount > 0 && (_jsxs("p", { className: "text-xs text-slate-600", children: ["Runs completed: ", analysisCount] }))] }), reflexFrames.length > 0 && (_jsxs("div", { className: "mt-8 space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Results" }), _jsxs("p", { className: "text-sm text-slate-600", children: ["Found ", reflexFrames.length, " detections"] }), _jsx("div", { className: "grid gap-4", children: reflexFrames.map((frame, index) => (_jsxs("div", { className: "p-4 rounded-2xl bg-[#e9eef5]", style: { boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }, children: [_jsx("h3", { className: "font-semibold text-lg", children: frame.reflexLabel }), _jsx("p", { className: "text-sm text-slate-700 mt-1", children: frame.rationale ?? frame.reason }), _jsxs("p", { className: "text-xs text-slate-500 mt-2", children: ["Confidence: ", Math.round(frame.confidence * 100), "% \u2022 Reflex ID: ", frame.reflexId] })] }, `${frame.reflexId}-${index}`))) }), _jsx(CoFirePanel, { reflexes: reflexFrames })] })), analysisCount > 0 && reflexFrames.length === 0 && !isAnalyzing && (_jsx("div", { className: "mt-8 p-4 rounded-2xl bg-[#e9eef5]", style: { boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }, children: _jsx("p", { className: "text-slate-700 text-center", children: "No reflexes detected. Try text with strong certainty, unnamed authorities, or sweeping claims\u2014then see how the engine responds." }) }))] })] })] }));
};
export default AnalyzePage;
