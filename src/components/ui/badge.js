import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@/lib/utils';
export const Badge = React.forwardRef(({ className, ...props }, ref) => (_jsx("span", { ref: ref, className: cn("inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800", className), ...props })));
Badge.displayName = "Badge";
