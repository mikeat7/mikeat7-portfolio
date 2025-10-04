import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVXContext } from '@/context/VXProvider'; // prefer the provider barrel
import BackButton from '@/components/BackButton';
import CoFirePanel from '@/components/CoFirePanel';
import ReflexInfoDrawer from '@/components/ReflexInfoDrawer';
import { toReflexFrame } from '@/lib/vx/compat';
export default function BotDetectionPage() {
    const { reflexFrames } = useVXContext();
    // Focus on rhetorical interruption + jargon overload
    const botReflexesVX = reflexFrames.filter((r) => r.reflexId === 'vx-ri01' || r.reflexId === 'vx-ju01');
    // Legacy shape for the drawer component
    const botReflexesLegacy = botReflexesVX.map(toReflexFrame);
    return (_jsxs("div", { className: "p-6", children: [_jsx(BackButton, {}), _jsx("h1", { className: "text-2xl font-bold mb-4", children: "Bot-Like Behavior Detection" }), _jsx(CoFirePanel, { reflexes: botReflexesVX }), botReflexesLegacy.map((reflex) => (_jsx(ReflexInfoDrawer, { reflex: reflex, isOpen: false, onClose: () => { } }, reflex.id)))] }));
}
