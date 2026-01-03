'use client';

import { Flame, ArrowUpRight } from 'lucide-react';
import { useMomentumStats, useGoalAnalysis } from '@/store/selectors';
import { formatCurrency } from '@/lib/calculations';

export function StreakBanner() {
  const stats = useMomentumStats();
  const analysis = useGoalAnalysis();

  const streak = stats.streak;
  const totalProgress = analysis?.progress.current || 0;
  const weeklyVelocity = analysis?.velocity.weekly || 0;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className={`flex items-center gap-3 rounded-full border bg-card/95 backdrop-blur-md px-4 py-2 ${
        streak > 0 
          ? 'border-emerald-500/40 shadow-[0_4px_20px_rgba(16,185,129,0.25)] dark:shadow-[0_4px_20px_rgba(16,185,129,0.15)]' 
          : 'border-zinc-300 dark:border-theme shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-lg'
      }`}>
        {/* Streak */}
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-theme tabular-nums">
            {streak > 0 ? `${streak}d` : '0d'}
          </span>
        </div>

        <div className="w-px h-4 bg-theme-secondary" />

        {/* Progress */}
        <span className="text-sm font-semibold text-theme tabular-nums">
          {formatCurrency(totalProgress)}
        </span>

        <div className="w-px h-4 bg-theme-secondary" />

        {/* Velocity */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-secondary tabular-nums">
            +{formatCurrency(weeklyVelocity)}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}