import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVXContext } from '@/context/VXContext';
import BackButton from '@/components/BackButton';
import CoFirePanel from '@/components/CoFirePanel';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import { toReflexFrame } from '@/lib/vx/compat';
export default function PaperAnalysisPage() {
    const { reflexFrames } = useVXContext();
    // Focus on data-less claims and false precision
    const paperReflexesVX = reflexFrames.filter((r) => r.reflexId === 'vx-da01' || r.reflexId === 'vx-fp01');
    // Legacy shape for ReflexInfoDrawer
    const paperReflexesLegacy = paperReflexesVX.map(toReflexFrame);
    return (_jsxs("div", { className: "p-6", children: [_jsx(BackButton, {}), _jsx("h1", { className: "text-2xl font-bold mb-4", children: "Scientific Paper Analysis" }), _jsx(CoFirePanel, { reflexes: paperReflexesVX }), paperReflexesLegacy.length > 0 ? (paperReflexesLegacy.map((reflex) => (_jsx(ReflexInfoDrawer, { reflex: reflex, isOpen: false, onClose: () => { } }, reflex.id)))) : (_jsx("div", { className: "mt-6 rounded border bg-gray-50 p-4 text-sm text-gray-600", children: "No paper-related reflexes found yet. Try text with numeric claims, confidence intervals, or methodological assertions to test false precision and data-less claim detectors." }))] }));
}
