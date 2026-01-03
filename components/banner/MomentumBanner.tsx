'use client';

import { Flame, TrendingUp } from 'lucide-react';
import { useMomentumStats, useGoalAnalysis } from '@/store/selectors';
import { formatCurrency } from '@/lib/calculations';

export function MomentumBanner() {
  const stats = useMomentumStats();
  const analysis = useGoalAnalysis();

  const totalProgress = analysis?.progress.current || 0;
  const weeklyVelocity = analysis?.velocity.weekly || 0;

  return (
    <div className="mt-8 mb-4 bg-gradient-to-r from-orange-500/10 via-card to-card border border-orange-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group">
      {/* Hover effect */}
      <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Left side */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Flame className="w-6 h-6 text-white fill-current" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-theme tracking-tight">
            Compound Effect Active
          </h3>
          <p className="text-sm text-secondary">
            You've completed {stats.tasksDoneThisWeek} tasks this week.{' '}
            {stats.streak > 0 ? `${stats.streak} day streak!` : 'Keep going!'}
          </p>
        </div>
      </div>

      {/* Right side - Stats */}
      <div className="flex items-center gap-6 relative z-10 bg-surface/50 p-3 rounded-lg border border-theme backdrop-blur-sm">
        <div className="text-right">
          <p className="text-[10px] text-muted font-medium uppercase tracking-wider">
            Total Progress
          </p>
          <p className="text-xl font-bold text-theme tracking-tight">
            {formatCurrency(totalProgress)}
          </p>
        </div>
        <div className="h-8 w-px bg-theme-secondary" />
        <div>
          <p className="text-[10px] text-muted font-medium uppercase tracking-wider">
            Weekly
          </p>
          <p className="text-lg font-bold text-emerald-500 tracking-tight flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +{formatCurrency(weeklyVelocity)}
          </p>
        </div>
      </div>
    </div>
  );
}