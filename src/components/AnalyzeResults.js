import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const AnalyzeResults = ({ frame, onClose }) => {
    const label = frame.reflexLabel ?? frame.reflexId;
    const confidencePct = Math.round((frame.confidence ?? 0) * 100);
    return (_jsx(Card, { className: "border shadow-sm", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-bold text-lg", children: label }), _jsx(Badge, { className: "px-2 py-0.5 text-xs border", children: frame.reflexId })] }), _jsxs("p", { className: "text-sm text-gray-700 mb-1", children: [_jsx("strong", { children: "Confidence:" }), " ", confidencePct, "%"] }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Details:" }), " ", frame.rationale ?? "—"] }), _jsx("div", { className: "mt-3", children: _jsx("button", { onClick: onClose, className: "px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm", children: "Close" }) })] }) }));
};
export default AnalyzeResults;
