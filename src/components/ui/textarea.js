import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ui/textarea.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
const Textarea = React.forwardRef(({ className, ...props }, ref) => (_jsx("textarea", { ref: ref, className: cn("min-h-[80px] w-full rounded-md border border-gray-300 p-2 text-sm", className), ...props })));
Textarea.displayName = 'Textarea';
export { Textarea };
