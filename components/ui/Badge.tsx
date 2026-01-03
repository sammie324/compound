'use client';

import { cn } from '@/lib/utils';
import { ColumnColor } from '@/lib/types';

interface BadgeProps {
  children: React.ReactNode;
  color?: ColumnColor | 'zinc' | 'yellow' | 'red';
  className?: string;
}

const colorClasses: Record<string, string> = {
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  violet: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  zinc: 'text-secondary bg-theme-secondary border-theme',
  yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  red: 'text-red-500 bg-red-500/10 border-red-500/20',
};

export function Badge({ children, color = 'zinc', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-[10px] font-semibold px-1.5 py-0.5 rounded-md border',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  );
}