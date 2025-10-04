import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const CoFirePanel = ({ reflexes = [] }) => {
    const highPriorityReflexes = reflexes.filter(r => r.confidence > 0.7);
    if (highPriorityReflexes.length < 2)
        return null;
    const avgConfidence = highPriorityReflexes.reduce((acc, r) => acc + r.confidence, 0) / highPriorityReflexes.length;
    const color = avgConfidence >= 0.85
        ? "bg-red-100 border-red-400 text-red-700"
        : avgConfidence >= 0.6
            ? "bg-yellow-100 border-yellow-400 text-yellow-800"
            : "bg-green-100 border-green-400 text-green-800";
    return (_jsxs("div", { className: `border-l-4 p-4 my-4 rounded-md ${color}`, children: [_jsxs("p", { className: "font-semibold", children: ["\u26A0\uFE0F Cluster Alert: ", highPriorityReflexes.length, " reflexes triggered"] }), _jsx("ul", { className: "ml-4 list-disc text-sm mt-2", children: highPriorityReflexes.map((reflex) => (_jsxs("li", { children: [_jsx("strong", { children: reflex.reflexLabel }), " (", (reflex.confidence * 100).toFixed(1), "% confidence)"] }, reflex.reflexId))) }), _jsx("p", { className: "text-xs mt-3", children: "\uD83D\uDCCC Consider reviewing your input for stacked assumptions or rhetorical escalation." })] }));
};
export default CoFirePanel;
