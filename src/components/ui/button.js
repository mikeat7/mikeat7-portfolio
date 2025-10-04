import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
const buttonVariants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-900 bg-white hover:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100',
};
const buttonSizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-5 py-3 text-base',
    icon: 'p-2',
};
const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (_jsx(Comp, { className: cn('inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2', buttonVariants[variant], buttonSizes[size], className), ref: ref, ...props }));
});
Button.displayName = 'Button';
export { Button };
