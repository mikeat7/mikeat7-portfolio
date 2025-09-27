import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const AnalyzeEngine = ({ total = 0, highConfidence = 0, clusters = 0 }) => {
    return (_jsx(Card, { className: "border shadow-sm", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Analyze Engine" }), _jsx(Badge, { className: "text-xs px-2 py-0.5 border", children: "runtime" })] }), _jsxs("div", { className: "mt-3 flex gap-2 text-sm", children: [_jsxs(Badge, { className: "px-2 py-0.5 bg-gray-100", children: ["Detections: ", total] }), _jsxs(Badge, { className: "px-2 py-0.5 bg-gray-100", children: ["High-conf: ", highConfidence] }), _jsxs(Badge, { className: "px-2 py-0.5 bg-gray-100", children: ["Clusters: ", clusters] })] })] }) }));
};
export default AnalyzeEngine;
