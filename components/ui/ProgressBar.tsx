'use client';

import { cn } from '@/lib/utils';
import { ColumnColor } from '@/lib/types';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: ColumnColor;
  size?: 'sm' | 'md';
  className?: string;
}

const colors: Record<ColumnColor, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  orange: 'bg-orange-500',
  rose: 'bg-rose-500',
  pink: 'bg-pink-500',
  fuchsia: 'bg-fuchsia-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  lime: 'bg-lime-500',
  yellow: 'bg-yellow-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  slate: 'bg-slate-500',
  zinc: 'bg-zinc-500',
  stone: 'bg-stone-500',
  sky: 'bg-sky-500',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'emerald',
  size = 'sm',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-1.5',
  };

  return (
    <div
      className={cn(
        'w-full bg-theme-secondary rounded-full overflow-hidden',
        sizes[size],
        className
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-300', colors[color])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}