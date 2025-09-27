import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const AdaptiveLearningDashboard = () => {
    return (_jsx("div", { className: "space-y-4", children: _jsx(Card, { className: "border shadow-sm", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Adaptive Learning" }), _jsx(Badge, { className: "text-xs px-2 py-0.5 border", children: "beta" })] }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "The engine tunes detector confidence based on user feedback and session history." }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [_jsx(Badge, { className: "text-xs px-2 py-0.5 bg-gray-100", children: "vx-co01" }), _jsx(Badge, { className: "text-xs px-2 py-0.5 bg-gray-100", children: "vx-da01" }), _jsx(Badge, { className: "text-xs px-2 py-0.5 bg-gray-100", children: "vx-ju01" }), _jsx(Badge, { className: "text-xs px-2 py-0.5 bg-gray-100", children: "vx-nf01" })] })] }) }) }));
};
export default AdaptiveLearningDashboard;
