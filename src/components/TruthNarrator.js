import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sampleQuote = `"The truth does not mind being questioned. A lie does."`;
function TruthNarrator() {
    return (_jsxs("div", { className: "p-6 space-y-4 text-center", children: [_jsx("h2", { className: "text-xl font-semibold", children: "\uD83E\uDDE0 Quote of the Moment" }), _jsx("p", { className: "text-lg italic text-gray-700", children: sampleQuote })] }));
}
export default TruthNarrator;
