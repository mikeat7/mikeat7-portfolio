import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVXContext } from '@/context/VXProvider';
import { Card, CardContent } from '@/components/ui/card';
const Pill = ({ children, className }) => (_jsx("span", { className: `inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${className ?? ''}`, children: children }));
const VXReflexPreview = () => {
    const { reflexFrames } = useVXContext();
    if (!reflexFrames || reflexFrames.length === 0) {
        return (_jsx("div", { className: "text-center text-gray-400 italic py-8", children: "No reflexes triggered yet. Submit input to begin analysis." }));
    }
    return (_jsx("div", { className: "space-y-4", children: reflexFrames.map((frame, idx) => (_jsx(Card, { className: "border shadow-sm", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-bold text-lg", children: frame.reflexLabel ?? frame.reflexId }), _jsx(Pill, { className: "border-gray-300 text-gray-700", children: frame.reflexId })] }), _jsxs("p", { className: "text-sm text-gray-700 mb-1", children: [_jsx("strong", { children: "Confidence:" }), " ", Math.round((frame.confidence ?? 0) * 100), "%"] }), (frame.rationale ?? frame.reason) && (_jsxs("p", { className: "text-sm text-gray-600 mb-1", children: [_jsx("strong", { children: "Details:" }), " ", frame.rationale ?? frame.reason] })), Array.isArray(frame.tags) && frame.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: frame.tags.map((tag, i) => (_jsx(Pill, { className: "border-blue-300 text-blue-700", children: tag }, i))) }))] }) }, idx))) }));
};
export default VXReflexPreview;
