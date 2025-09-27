import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReflexUISchema from "@/data/vx-ui-schema";
const ReflexInfoDrawer = ({ reflex, isOpen, onClose }) => {
    if (!isOpen) {
        // Render a compact card version when closed (to avoid layout jumps)
        return (_jsx(Card, { className: "border shadow-sm", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-semibold", children: reflex.label }), _jsxs(Badge, { className: "text-xs px-2 py-0.5 border", children: [Math.round(reflex.confidence * 100), "%"] })] }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: reflex.rationale || reflex.explanation || "No rationale provided." })] }) }));
    }
    const schema = ReflexUISchema[reflex.id] || {};
    const color = schema.color || "gray";
    const summary = schema.summary || "No UI schema summary available.";
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 z-40 flex", children: _jsxs("div", { className: "ml-auto h-full w-full max-w-md bg-white shadow-xl p-5 overflow-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: reflex.label }), _jsx("button", { onClick: onClose, className: "px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm", children: "Close" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { className: "text-xs px-2 py-0.5 border", children: ["tone: ", reflex.tone || "neutral"] }), _jsxs(Badge, { className: "text-xs px-2 py-0.5 border", style: { borderColor: color }, children: [Math.round(reflex.confidence * 100), "%"] })] }), _jsx("p", { className: "text-sm text-gray-700 mt-4", children: reflex.rationale || reflex.explanation || "No rationale provided." }), _jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "font-medium mb-1", children: "UI Schema" }), _jsx("p", { className: "text-sm text-gray-600", children: summary })] })] }) }));
};
export default ReflexInfoDrawer;
