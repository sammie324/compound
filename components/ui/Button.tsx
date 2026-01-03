'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all rounded-md disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-md',
      secondary:
        'bg-card hover:bg-card-hover text-theme border border-theme',
      ghost:
        'bg-transparent hover:bg-card-hover text-secondary hover:text-theme',
      danger:
        'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20',
    };

    const sizes = {
      sm: 'px-2.5 py-1.5 text-xs gap-1.5',
      md: 'px-3.5 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-sm gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';