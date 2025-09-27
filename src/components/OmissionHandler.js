import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/OmissionHandler.tsx
import { useState } from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
// NOTE: Future enhancement — replace this with dynamic data input or external feed
const mockOmissions = [
    {
        id: 1,
        context: "Grok said he could analyze your GitHub repo.",
        omitted: "LLMs cannot directly access GitHub contents without pasted code.",
        whyItMatters: "Leads user to believe false capability exists.",
        severity: 'high'
    },
    {
        id: 2,
        context: "You were asked for mock data despite having real data.",
        omitted: "No check was made to see if user already had real data.",
        whyItMatters: "Wastes time and creates confusion.",
        severity: 'medium'
    },
    {
        id: 3,
        context: "Analysis was conducted without surfacing rhetorical tone.",
        omitted: "No trigger flagged sarcasm or persuasive framing.",
        whyItMatters: "Skews interpretation of intent or bias.",
        severity: 'medium'
    },
    {
        id: 4,
        context: "Truth quote displayed without associated reflex.",
        omitted: "No mapping to vx-ui-schema reflex metadata.",
        whyItMatters: "Prevents lesson from linking to diagnostic engine.",
        severity: 'low'
    }
];
const OmissionHandler = () => {
    const [showOmissions, setShowOmissions] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-white p-8 text-center", children: [_jsx("h1", { className: "text-4xl font-bold mb-6 text-gray-900", children: "Omission Handler" }), _jsx("p", { className: "text-gray-600 mb-4 max-w-xl mx-auto", children: "Toggle to reveal critical omissions in communication or logic." }), _jsxs("button", { onClick: () => setShowOmissions(!showOmissions), className: "flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors mx-auto", children: [_jsx(Lightbulb, { className: "w-5 h-5" }), _jsx("span", { children: showOmissions ? 'Hide Omissions' : 'Reveal Omissions' })] }), showOmissions && (_jsx("div", { className: "mt-6 space-y-4 max-w-2xl mx-auto", children: mockOmissions.map((omission) => (_jsx("div", { className: `p-4 border-l-4 rounded-md shadow-sm ${omission.severity === 'high' ? 'border-red-500 bg-red-50' :
                        omission.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                            'border-gray-300 bg-gray-50'}`, children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5 mt-1 text-yellow-600" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-gray-800", children: ["Context: ", omission.context] }), _jsxs("p", { className: "text-sm text-gray-700 mt-1", children: [_jsx("strong", { children: "Omitted:" }), " ", omission.omitted] }), _jsxs("p", { className: "text-sm text-gray-600 mt-1 italic", children: ["Why it matters: ", omission.whyItMatters] })] })] }) }, omission.id))) }))] }));
};
export default OmissionHandler;
