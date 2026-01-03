'use client';

import { cn } from '@/lib/utils';
import { ColumnColor } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DollarSign, Users, Rocket, Flame, LucideIcon } from 'lucide-react';
import { formatValue } from '@/lib/calculations';

interface StatCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  color: ColumnColor;
  label: string;
  subtitle?: string;
  icon?: 'dollar' | 'users' | 'rocket' | 'flame';
}

const icons: Record<string, LucideIcon> = {
  dollar: DollarSign,
  users: Users,
  rocket: Rocket,
  flame: Flame,
};

const colorClasses: Record<ColumnColor, {
  gradient: string;
  iconBg: string;
  iconText: string;
  labelBg: string;
  labelText: string;
  labelBorder: string;
  accent: string;
}> = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-700',
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-500',
    labelBg: 'bg-emerald-500/10',
    labelText: 'text-emerald-500',
    labelBorder: 'border-emerald-500/20',
    accent: 'text-emerald-500',
  },
  blue: {
    gradient: 'from-blue-500 to-blue-700',
    iconBg: 'bg-blue-500/10',
    iconText: 'text-blue-500',
    labelBg: 'bg-blue-500/10',
    labelText: 'text-blue-500',
    labelBorder: 'border-blue-500/20',
    accent: 'text-blue-500',
  },
  violet: {
    gradient: 'from-violet-500 to-violet-700',
    iconBg: 'bg-violet-500/10',
    iconText: 'text-violet-500',
    labelBg: 'bg-violet-500/10',
    labelText: 'text-violet-500',
    labelBorder: 'border-violet-500/20',
    accent: 'text-violet-500',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-700',
    iconBg: 'bg-orange-500/10',
    iconText: 'text-orange-500',
    labelBg: 'bg-orange-500/10',
    labelText: 'text-orange-500',
    labelBorder: 'border-orange-500/20',
    accent: 'text-orange-500',
  },
  rose: {
    gradient: 'from-rose-500 to-rose-700',
    iconBg: 'bg-rose-500/10',
    iconText: 'text-rose-500',
    labelBg: 'bg-rose-500/10',
    labelText: 'text-rose-500',
    labelBorder: 'border-rose-500/20',
    accent: 'text-rose-500',
  },
  pink: {
    gradient: 'from-pink-500 to-pink-700',
    iconBg: 'bg-pink-500/10',
    iconText: 'text-pink-500',
    labelBg: 'bg-pink-500/10',
    labelText: 'text-pink-500',
    labelBorder: 'border-pink-500/20',
    accent: 'text-pink-500',
  },
  fuchsia: {
    gradient: 'from-fuchsia-500 to-fuchsia-700',
    iconBg: 'bg-fuchsia-500/10',
    iconText: 'text-fuchsia-500',
    labelBg: 'bg-fuchsia-500/10',
    labelText: 'text-fuchsia-500',
    labelBorder: 'border-fuchsia-500/20',
    accent: 'text-fuchsia-500',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-700',
    iconBg: 'bg-purple-500/10',
    iconText: 'text-purple-500',
    labelBg: 'bg-purple-500/10',
    labelText: 'text-purple-500',
    labelBorder: 'border-purple-500/20',
    accent: 'text-purple-500',
  },
  indigo: {
    gradient: 'from-indigo-500 to-indigo-700',
    iconBg: 'bg-indigo-500/10',
    iconText: 'text-indigo-500',
    labelBg: 'bg-indigo-500/10',
    labelText: 'text-indigo-500',
    labelBorder: 'border-indigo-500/20',
    accent: 'text-indigo-500',
  },
  cyan: {
    gradient: 'from-cyan-500 to-cyan-700',
    iconBg: 'bg-cyan-500/10',
    iconText: 'text-cyan-500',
    labelBg: 'bg-cyan-500/10',
    labelText: 'text-cyan-500',
    labelBorder: 'border-cyan-500/20',
    accent: 'text-cyan-500',
  },
  teal: {
    gradient: 'from-teal-500 to-teal-700',
    iconBg: 'bg-teal-500/10',
    iconText: 'text-teal-500',
    labelBg: 'bg-teal-500/10',
    labelText: 'text-teal-500',
    labelBorder: 'border-teal-500/20',
    accent: 'text-teal-500',
  },
  green: {
    gradient: 'from-green-500 to-green-700',
    iconBg: 'bg-green-500/10',
    iconText: 'text-green-500',
    labelBg: 'bg-green-500/10',
    labelText: 'text-green-500',
    labelBorder: 'border-green-500/20',
    accent: 'text-green-500',
  },
  lime: {
    gradient: 'from-lime-500 to-lime-700',
    iconBg: 'bg-lime-500/10',
    iconText: 'text-lime-500',
    labelBg: 'bg-lime-500/10',
    labelText: 'text-lime-500',
    labelBorder: 'border-lime-500/20',
    accent: 'text-lime-500',
  },
  yellow: {
    gradient: 'from-yellow-500 to-yellow-700',
    iconBg: 'bg-yellow-500/10',
    iconText: 'text-yellow-500',
    labelBg: 'bg-yellow-500/10',
    labelText: 'text-yellow-500',
    labelBorder: 'border-yellow-500/20',
    accent: 'text-yellow-500',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-500',
    labelBg: 'bg-amber-500/10',
    labelText: 'text-amber-500',
    labelBorder: 'border-amber-500/20',
    accent: 'text-amber-500',
  },
  red: {
    gradient: 'from-red-500 to-red-700',
    iconBg: 'bg-red-500/10',
    iconText: 'text-red-500',
    labelBg: 'bg-red-500/10',
    labelText: 'text-red-500',
    labelBorder: 'border-red-500/20',
    accent: 'text-red-500',
  },
  slate: {
    gradient: 'from-slate-500 to-slate-700',
    iconBg: 'bg-slate-500/10',
    iconText: 'text-slate-500',
    labelBg: 'bg-slate-500/10',
    labelText: 'text-slate-500',
    labelBorder: 'border-slate-500/20',
    accent: 'text-slate-500',
  },
  zinc: {
    gradient: 'from-zinc-500 to-zinc-700',
    iconBg: 'bg-zinc-500/10',
    iconText: 'text-zinc-500',
    labelBg: 'bg-zinc-500/10',
    labelText: 'text-zinc-500',
    labelBorder: 'border-zinc-500/20',
    accent: 'text-zinc-500',
  },
  stone: {
    gradient: 'from-stone-500 to-stone-700',
    iconBg: 'bg-stone-500/10',
    iconText: 'text-stone-500',
    labelBg: 'bg-stone-500/10',
    labelText: 'text-stone-500',
    labelBorder: 'border-stone-500/20',
    accent: 'text-stone-500',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-700',
    iconBg: 'bg-sky-500/10',
    iconText: 'text-sky-500',
    labelBg: 'bg-sky-500/10',
    labelText: 'text-sky-500',
    labelBorder: 'border-sky-500/20',
    accent: 'text-sky-500',
  },
};

export function StatCard({
  title,
  current,
  target,
  unit = '',
  color,
  label,
  subtitle,
  icon = 'dollar',
}: StatCardProps) {
  const Icon = icons[icon];
  const colors = colorClasses[color];
  const percentage = Math.round((current / target) * 100);

  return (
    <div className="relative bg-card border border-theme rounded-xl p-5 hover:bg-card-hover transition-all group overflow-hidden">
      {/* Top gradient line */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r', colors.gradient)} />

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className={cn('p-2 rounded-md', colors.iconBg, colors.iconText)}>
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
        <span
          className={cn(
            'text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border',
            colors.labelBg,
            colors.labelText,
            colors.labelBorder
          )}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-2xl font-semibold text-theme tracking-tight">
          {formatValue(current, unit)}
        </h3>
        <span className="text-sm text-secondary font-medium">
          / {formatValue(target, unit)}
        </span>
      </div>

      {/* Title */}
      <p className="text-xs text-secondary mb-3">{title}</p>

      {/* Progress */}
      <ProgressBar value={current} max={target} color={color} size="md" className="mb-3" />

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[11px] text-secondary flex items-center gap-1.5">
          <span className={cn('font-medium', colors.accent)}>{subtitle}</span>
        </p>
      )}
    </div>
  );
}