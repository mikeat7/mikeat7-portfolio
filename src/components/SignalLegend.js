import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SignalLegend = () => {
    const signals = [
        {
            symbol: '🟢',
            name: 'Clarity',
            description: 'Clear, cautious phrasing with appropriate uncertainty markers',
            examples: [
                '"The data suggests..." (hedged language)',
                '"I could be wrong, but..." (epistemic humility)',
                '"Further research is needed..." (acknowledges limitations)'
            ]
        },
        {
            symbol: '🟡',
            name: 'Tone',
            description: 'Emotionally loaded or persuasive language that may bypass logic',
            examples: [
                '"This crisis demands immediate action" (urgency)',
                '"Everyone knows that..." (false consensus)',
                '"You\'d be crazy not to..." (emotional pressure)'
            ]
        },
        {
            symbol: '🔴',
            name: 'Conflict',
            description: 'Logical contradictions, reasoning errors, or manipulative patterns',
            examples: [
                '"Studies prove..." without citations (false authority)',
                '"It\'s obvious that..." (dismisses complexity)',
                '"If we don\'t act now..." (false urgency)'
            ]
        },
        {
            symbol: '⚪',
            name: 'Neutral',
            description: 'No notable rhetorical patterns detected - straightforward communication',
            examples: [
                'Factual statements without emotional loading',
                'Clear explanations with appropriate qualifiers',
                'Balanced presentation of information'
            ]
        }
    ];
    return (_jsxs("div", { className: "my-8", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Signal Legend" }), _jsx("div", { className: "grid gap-4", children: signals.map((signal, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 bg-gray-50", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-2xl", children: signal.symbol }), _jsx("h4", { className: "font-semibold text-lg text-gray-800", children: signal.name })] }), _jsx("p", { className: "text-gray-700 mb-3", children: signal.description }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Examples:" }), signal.examples.map((example, i) => (_jsxs("p", { className: "text-sm text-gray-600 italic pl-4", children: ["\u2022 ", example] }, i)))] })] }, index))) })] }));
};
export default SignalLegend;
