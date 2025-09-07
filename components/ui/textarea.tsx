// src/components/ui/textarea.tsx

import * as React from 'react';
import { cn } from '@/lib/utils';

// SCAFFOLD: Basic textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("min-h-[80px] w-full rounded-md border border-gray-300 p-2 text-sm", className)}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
