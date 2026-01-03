'use client';

import { StatCard } from './StatCard';

interface StatsGridProps {
  stats?: {
    revenue: { current: number; target: number; change?: string };
    users: { current: number; target: number; change?: string };
    mvp: { current: number; target: number; daysLeft?: number };
    streak: { current: number; best?: number };
  };
}

const defaultStats = {
  revenue: { current: 27500, target: 42000, change: '+12%' },
  users: { current: 420, target: 1000, change: '+85' },
  mvp: { current: 88, target: 100, daysLeft: 12 },
  streak: { current: 45, best: 45 },
};

export function StatsGrid({ stats = defaultStats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Monthly Recurring Revenue"
        current={stats.revenue.current}
        target={stats.revenue.target}
        unit="$"
        color="emerald"
        label="Milestone"
        icon="dollar"
        subtitle={`${stats.revenue.change} vs last month`}
      />

      <StatCard
        title="Active Users"
        current={stats.users.current}
        target={stats.users.target}
        color="blue"
        label="Growth"
        icon="users"
        subtitle={`${stats.users.change} new this week`}
      />

      <StatCard
        title="MVP Development"
        current={stats.mvp.current}
        target={stats.mvp.target}
        unit="%"
        color="violet"
        label="Launch"
        icon="rocket"
        subtitle={`Launch in ${stats.mvp.daysLeft} days`}
      />

      <StatCard
        title="Execution Streak"
        current={stats.streak.current}
        target={100}
        color="orange"
        label="Momentum"
        icon="flame"
        subtitle={stats.streak.current === stats.streak.best ? 'Personal Best' : `Best: ${stats.streak.best}`}
      />
    </div>
  );
}