import * as React from 'react';
import { cn } from '@/lib/utils';

// SCAFFOLD: Badge style component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800", className)}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
