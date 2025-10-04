import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/AnalyzeText.tsx
import { useState, useContext } from "react";
import BackButton from "@/components/BackButton";
import VXReflexPreview from "@/components/VXReflexPreview";
import CoFirePanel from "@/components/CoFirePanel";
import { analyzeInput } from "@/lib/scanLogic";
import { VXContext } from "@/context/VXContext";
const AnalyzeText = () => {
    const [text, setText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [localResults, setLocalResults] = useState([]);
    const ctx = useContext(VXContext); // may be undefined until provider mounts
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (text.trim().length < 3)
            return;
        setBusy(true);
        try {
            const results = await analyzeInput(text);
            // Broadcast to context if setters exist so the rest of the UI can consume
            ctx?.setLatestInput?.(text);
            ctx?.setReflexFrames?.(results);
            setLocalResults(results);
        }
        catch (err) {
            console.error("Analyze failed:", err);
            setLocalResults([]);
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-white px-6 py-10", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx(BackButton, {}), _jsx("h1", { className: "text-3xl font-bold mb-4 text-gray-900", children: "Analyze a Statement" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Paste a claim, argument, or quote. The Clarity Armor engine will reveal hidden assumptions, speculative tone, or manipulative framing." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), rows: 5, className: "w-full border border-gray-300 rounded-md p-3 text-gray-800 shadow-sm", placeholder: "Paste a paragraph, argument, or social media post here..." }), _jsx("button", { type: "submit", disabled: busy || text.trim().length < 3, className: "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60", children: busy ? "Analyzing…" : "Run Analysis" })] }), submitted && text.trim() && (_jsxs("div", { className: "mt-8 space-y-6", children: [_jsx(CoFirePanel, { reflexes: localResults }), _jsx(VXReflexPreview, {})] }))] }) }));
};
export default AnalyzeText;
