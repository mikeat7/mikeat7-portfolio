import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVXContext } from "@/context/VXContext";
import CoFirePanel from "./CoFirePanel";
import ReflexInfoDrawer from "./ReflexInfoDrawer";
import { toReflexFrame } from "@/lib/vx/compat";
const TrustLens = () => {
    const ctx = useVXContext();
    const reflexFrames = ctx?.reflexFrames ?? [];
    return (_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Reflex Summary" }), _jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: reflexFrames.map((r, idx) => {
                    const score = r.confidence ?? 0;
                    const label = r.reflexLabel ?? r.reflexId ?? `vx-${idx}`;
                    const key = r.reflexId ?? `vx-${idx}`;
                    const severityClass = score > 0.7
                        ? "border-red-500 bg-red-50"
                        : score > 0.4
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-green-500 bg-green-50";
                    return (_jsxs("li", { className: `p-4 rounded border-l-4 ${severityClass}`, children: [_jsx("p", { className: "font-medium text-gray-800", children: label }), _jsxs("p", { className: "text-sm", children: ["Score: ", (score * 100).toFixed(1), "%"] })] }, key));
                }) }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsx(CoFirePanel, { reflexes: reflexFrames }), reflexFrames[0] && (_jsx(ReflexInfoDrawer, { reflex: toReflexFrame(reflexFrames[0]), isOpen: false, onClose: () => { } }))] })] }));
};
export default TrustLens;
