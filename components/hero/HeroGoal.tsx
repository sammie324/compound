'use client';

import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/useBoardStore';
import {
  analyzeGoal,
  formatCurrency,
  formatValue,
  formatProjectionMessage,
  formatVelocity,
} from '@/lib/calculations';

interface HeroGoalProps {
  backgroundImage?: string;
}

const trendIcons = {
  accelerating: TrendingUp,
  steady: Minus,
  decelerating: TrendingDown,
  stalled: Minus,
};

const trendColors = {
  accelerating: 'text-emerald-500',
  steady: 'text-blue-500',
  decelerating: 'text-amber-500',
  stalled: 'text-zinc-400',
};

const confidenceBadges = {
  high: { label: 'High confidence', color: 'bg-emerald-500/15 text-emerald-500' },
  medium: { label: 'Medium confidence', color: 'bg-blue-500/15 text-blue-500' },
  low: { label: 'Early data', color: 'bg-amber-500/15 text-amber-500' },
  insufficient: { label: 'Building momentum', color: 'bg-zinc-500/15 text-secondary' },
};

export function HeroGoal({
  backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
}: HeroGoalProps) {
  const getActiveWorkspace = useBoardStore((s) => s.getActiveWorkspace);
  const getActiveGoal = useBoardStore((s) => s.getActiveGoal);
  const getActiveColumns = useBoardStore((s) => s.getActiveColumns);
  const getActivePlays = useBoardStore((s) => s.getActivePlays);

  const workspace = getActiveWorkspace();
  const goal = getActiveGoal();
  const columns = getActiveColumns();
  const plays = getActivePlays();

  const analysis = goal ? analyzeGoal(goal, columns, plays) : null;

  const boardTitle = workspace?.boardName || 'Execution Board';
  const boardSubtitle = 'Track momentum → Compound progress → Hit milestones';

  const unit = goal?.unit || '$';
  const current = analysis?.progress.current || goal?.current || 0;
  const target = goal?.target || 0;
  const percentage = analysis?.progress.percentage || 0;

  // No goal - show empty state
  if (!goal) {
    return (
      <section className="pt-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-theme">{boardTitle}</h1>
          <p className="text-sm text-secondary mt-1">{boardSubtitle}</p>
        </div>
        <div className="mt-4 rounded-xl border border-theme bg-card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
          </div>
          <p className="text-theme font-medium">No goal set</p>
          <p className="text-secondary text-sm mt-1">Create a goal to track your progress</p>
        </div>
      </section>
    );
  }

  const TrendIcon = analysis ? trendIcons[analysis.velocity.trend] : Minus;
  const trendColor = analysis ? trendColors[analysis.velocity.trend] : 'text-zinc-400';
  const confidence = analysis?.projection.confidence || 'insufficient';

  return (
    <section className="pt-6 space-y-4">
      {/* Board Title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-theme">{boardTitle}</h1>
        <p className="text-sm text-secondary mt-1">{boardSubtitle}</p>
      </div>

      {/* Hero Card */}
      <div className="relative rounded-xl border border-theme bg-card shadow-sm overflow-hidden">
        {/* Fading Background Image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            maskImage: 'linear-gradient(to right, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: Main Goal */}
            <div className="max-w-lg">
              {/* Goal Amount */}
              <div 
                className="text-4xl sm:text-5xl font-semibold tracking-tight leading-none"
                style={percentage >= 100 ? {
                  background: 'var(--gradient-complete)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                } : { color: 'var(--text-theme)' }}
              >
                {unit === '$' ? formatCurrency(target) : formatValue(target, unit)}
              </div>
              <div className="text-sm font-medium text-secondary mt-1">{goal?.title || 'Goal'}</div>

              {/* Progress Bar */}
              <div className="mt-5 flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="h-3 w-full rounded-full bg-theme-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        background: percentage >= 100 
                          ? 'var(--gradient-complete)'
                          : 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                      }}
                    />
                  </div>
                </div>
                <div 
                  className="text-lg font-semibold tabular-nums"
                  style={percentage >= 100 ? {
                    background: 'var(--gradient-complete)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : { color: 'var(--text-theme)' }}
                >
                  {percentage}%
                </div>
              </div>

              {/* Current / Target */}
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="font-semibold text-theme tabular-nums">
                  {unit === '$' ? formatCurrency(current) : formatValue(current, unit)}
                </span>
                <span className="text-muted">/</span>
                <span className="text-secondary tabular-nums">
                  {unit === '$' ? formatCurrency(target) : formatValue(target, unit)}
                </span>
              </div>

              {/* Pace Projection */}
              {analysis && (
                <div className="mt-5 inline-flex items-center gap-3 rounded-lg bg-surface/90 backdrop-blur-sm border border-theme px-4 py-2.5">
                  <TrendingUp className="w-4 h-4 text-[#3B82F6]" strokeWidth={2} />
                  <span className="text-sm text-theme">
                    {formatProjectionMessage(analysis.projection)}
                  </span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', confidenceBadges[confidence].color)}>
                    {confidenceBadges[confidence].label}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Metrics */}
            {analysis && (
              <div className="flex flex-col gap-3 min-w-[200px]">
                {/* Velocity */}
                <div className="rounded-lg border border-theme bg-card shadow-sm p-3">
                  <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">Velocity</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xl font-bold text-theme">
                      {formatVelocity(analysis.velocity, unit)}
                    </span>
                    <TrendIcon className={cn('w-4 h-4', trendColor)} strokeWidth={2} />
                  </div>
                  {analysis.velocity.trendPercent !== 0 && (
                    <div className={cn('text-xs mt-0.5 font-medium', trendColor)}>
                      {analysis.velocity.trendPercent > 0 ? '+' : ''}{analysis.velocity.trendPercent}% vs last week
                    </div>
                  )}
                </div>

                {/* Momentum */}
                <div className="rounded-lg border border-theme bg-card shadow-sm p-3">
                  <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">Momentum</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" strokeWidth={2} />
                    <span className="text-xl font-bold text-theme">
                      {analysis.momentum.compoundScore}
                    </span>
                    <span className="text-xs font-medium text-secondary">/ 100</span>
                  </div>
                  <div className="text-xs text-secondary font-medium mt-0.5">
                    {analysis.momentum.streak > 0 
                      ? `${analysis.momentum.streak}-day streak` 
                      : 'Start your streak today'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}