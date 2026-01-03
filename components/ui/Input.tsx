'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-secondary">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm text-theme bg-theme-secondary border border-theme rounded-md',
            'placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50',
            'transition-colors',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';