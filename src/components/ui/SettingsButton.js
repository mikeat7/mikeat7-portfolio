// File: src/components/ui/SettingsButton.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './button';
import { Settings } from 'lucide-react';
export default function SettingsButton() {
    const [open, setOpen] = useState(false);
    return (_jsxs("div", { className: "fixed bottom-4 right-4 z-50", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setOpen(!open), children: _jsx(Settings, { className: "w-5 h-5" }) }), open && (_jsxs("div", { className: "absolute bottom-12 right-0 bg-white dark:bg-zinc-900 shadow-lg p-4 rounded-md w-64 text-sm text-muted-foreground", children: [_jsx("p", { className: "mb-2 font-semibold", children: "Settings (Mocked)" }), _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: "\u2022 Theme toggle (coming soon)" }), _jsx("li", { children: "\u2022 Reflex sensitivity (coming soon)" }), _jsx("li", { children: "\u2022 Export logs (coming soon)" })] })] }))] }));
}
