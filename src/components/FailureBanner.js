import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import codex from "@/data/front-end-codex.v0.9.json";
import { failureText } from "@/lib/codex-runtime";
export const FailureBanner = ({ kind, onAction, className }) => {
    const { text, action } = failureText(codex, kind);
    const actionLabel = action === "offer_alternatives"
        ? "See alternatives"
        : action === "show_confidence_and_next_steps"
            ? "Improve confidence"
            : "Clarify";
    return (_jsx("div", { className: "rounded-lg border p-3 text-sm bg-yellow-50 border-yellow-300 text-yellow-900 " +
            (className ?? ""), role: "status", "aria-live": "polite", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5", children: "\u26A0\uFE0F" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "mb-2", children: text }), onAction && (_jsx("button", { type: "button", onClick: onAction, className: "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-gray-50", children: actionLabel }))] })] }) }));
};
export default FailureBanner;
