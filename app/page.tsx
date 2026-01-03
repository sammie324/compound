'use client';

import { useState } from 'react';
import { Providers } from './providers';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HeroGoal } from '@/components/hero/HeroGoal';
import { FilterBar } from '@/components/controls/FilterBar';
import { Board } from '@/components/board/Board';
import { StreakBanner } from '@/components/banner/StreakBanner';
import { SidePanel } from '@/components/panel/SidePanel';
import { GoalCompletionModal } from '@/components/celebration/GoalCompletionModal';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useAutoGoalCelebration } from '@/hooks/useGoalCompletion';
import { useBoardStore } from '@/store/useBoardStore';
import { PlayCard } from '@/components/board/PlayCard';
import { useSortedColumns } from '@/store/selectors';
import { analyzeGoal, formatValue } from '@/lib/calculations';
import { Target, Zap, X } from 'lucide-react';
import { generateId } from '@/lib/id';
import { ColumnColor } from '@/lib/types';
import { COLUMN_COLORS } from '@/lib/constants';

function GoalsView() {
  const goals = useBoardStore((s) => s.goals);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const activeGoalId = useBoardStore((s) => s.activeGoalId);
  const deleteGoal = useBoardStore((s) => s.deleteGoal);
  const setActiveGoal = useBoardStore((s) => s.setActiveGoal);
  const activeGoals = goals.filter((g) => g.workspaceId === activeWorkspaceId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-theme">Goals</h1>
          <p className="text-sm text-secondary">Track your targets and milestones</p>
        </div>
      </div>

      <HeroGoal />

      {activeGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-theme">All Goals ({activeGoals.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const isActive = goal.id === activeGoalId;
              const isComplete = pct >= 100;
              return (
                <div
                  key={goal.id}
                  onClick={() => setActiveGoal(goal.id)}
                  className={`rounded-xl border bg-card p-4 hover:bg-card-hover transition group cursor-pointer ${
                    isComplete 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                      : isActive 
                        ? 'border-emerald-500 ring-1 ring-emerald-500/30' 
                        : 'border-theme'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: COLUMN_COLORS[goal.color].bar }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-theme">{goal.title}</div>
                          {isComplete && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                              ✓ Complete
                            </span>
                          )}
                          {!isComplete && isActive && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-secondary">
                          {formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGoal(goal.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-theme-secondary text-muted hover:text-red-500 transition"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-theme-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${pct}%`, 
                          background: isComplete 
                            ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)' 
                            : COLUMN_COLORS[goal.color].bar
                        }}
                      />
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${isComplete ? 'text-emerald-500' : 'text-theme'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeGoals.length === 0 && (
        <div className="rounded-xl border border-theme bg-card p-8 text-center">
          <Target className="w-10 h-10 text-muted mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-secondary text-sm">No goals yet</p>
          <p className="text-muted text-xs mt-1">Create your first goal to get started</p>
        </div>
      )}
    </div>
  );
}

function PlaysView() {
  const plays = useBoardStore((s) => s.plays);
  const columns = useSortedColumns();
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);

  const activeColumnIds = new Set(
    columns.filter((c) => c.workspaceId === activeWorkspaceId).map((c) => c.id)
  );
  const activePlays = plays.filter((p) => activeColumnIds.has(p.columnId));

  const getColumnColor = (columnId: string) => {
    return columns.find((c) => c.id === columnId)?.color;
  };

  const getColumnTitle = (columnId: string) => {
    return columns.find((c) => c.id === columnId)?.title || 'Unknown';
  };

  const activeStatus = activePlays.filter((p) => p.status === 'ACTIVE');
  const plannedStatus = activePlays.filter((p) => p.status === 'PLANNED');
  const doneStatus = activePlays.filter((p) => p.status === 'DONE');

  const renderPlayGroup = (title: string, plays: typeof activePlays, dotColor: string) => {
    if (plays.length === 0) return null;
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className={`h-2 w-2 rounded-full ${dotColor}`} />
          <h2 className="text-sm font-semibold text-theme">{title}</h2>
          <span className="text-xs text-secondary">({plays.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plays.map((play) => (
            <div key={play.id} className="relative">
              <div className="absolute -top-2 left-3 px-2 py-0.5 rounded text-[10px] font-medium bg-theme-secondary text-secondary">
                {getColumnTitle(play.columnId)}
              </div>
              <PlayCard play={play} columnColor={getColumnColor(play.columnId)} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-theme">Plays</h1>
          <p className="text-sm text-secondary">{activePlays.length} total plays across all columns</p>
        </div>
      </div>

      {activePlays.length === 0 ? (
        <div className="rounded-xl border border-theme bg-card p-8 text-center">
          <Zap className="w-10 h-10 text-muted mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-secondary text-sm">No plays yet</p>
          <p className="text-muted text-xs mt-1">Add plays to your columns to see them here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {renderPlayGroup('Active', activeStatus, 'bg-emerald-500')}
          {renderPlayGroup('Planned', plannedStatus, 'bg-zinc-400')}
          {renderPlayGroup('Done', doneStatus, 'bg-blue-500')}
        </div>
      )}
    </div>
  );
}

function DashboardView() {
  return (
    <>
      <HeroGoal />
      <FilterBar />
      <Board />
    </>
  );
}

function NewGoalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('$');
  const [color, setColor] = useState<ColumnColor>('emerald');

  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const addGoal = useBoardStore((s) => s.addGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !target || !activeWorkspaceId) return;

    addGoal({
      id: generateId.goal(),
      workspaceId: activeWorkspaceId,
      title: title.trim(),
      target: Number(target),
      current: 0,
      unit,
      color,
      startDate: Date.now(),
    });

    setTitle('');
    setTarget('');
    setUnit('$');
    setColor('emerald');
    onClose();
  };

  if (!isOpen) return null;

  const colorOptions: { id: ColumnColor; bg: string }[] = [
    { id: 'emerald', bg: '#10B981' },
    { id: 'blue', bg: '#3B82F6' },
    { id: 'violet', bg: '#8B5CF6' },
    { id: 'orange', bg: '#F97316' },
    { id: 'rose', bg: '#F43F5E' },
    { id: 'pink', bg: '#EC4899' },
    { id: 'fuchsia', bg: '#D946EF' },
    { id: 'purple', bg: '#A855F7' },
    { id: 'indigo', bg: '#6366F1' },
    { id: 'cyan', bg: '#06B6D4' },
    { id: 'teal', bg: '#14B8A6' },
    { id: 'green', bg: '#22C55E' },
    { id: 'lime', bg: '#84CC16' },
    { id: 'yellow', bg: '#EAB308' },
    { id: 'amber', bg: '#F59E0B' },
    { id: 'red', bg: '#EF4444' },
    { id: 'slate', bg: '#64748B' },
    { id: 'zinc', bg: '#71717A' },
    { id: 'stone', bg: '#78716C' },
    { id: 'sky', bg: '#0EA5E9' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card border border-theme rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-theme">New Goal</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-card-hover flex items-center justify-center"
          >
            <X className="w-4 h-4 text-secondary" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Revenue Goal"
              className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Target</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="100000"
                className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-theme bg-card px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="$">$ (Currency)</option>
                <option value="users">Users</option>
                <option value="%">% (Percentage)</option>
                <option value="lbs">lbs (Weight)</option>
                <option value="hours">Hours</option>
                <option value="units">Units</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className="h-7 w-7 rounded-lg transition-all"
                  style={{
                    background: c.bg,
                    opacity: color === c.id ? 1 : 0.5,
                    boxShadow: color === c.id ? `0 0 0 2px var(--card), 0 0 0 4px ${c.bg}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-theme bg-card text-sm font-medium text-theme hover:bg-card-hover transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !target}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardContent() {
  useKeyboard();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const sidebarView = useBoardStore((s) => s.sidebarView);

  // Goal completion celebration
  const getActiveGoal = useBoardStore((s) => s.getActiveGoal);
  const getActiveColumns = useBoardStore((s) => s.getActiveColumns);
  const getActivePlays = useBoardStore((s) => s.getActivePlays);

  const goal = getActiveGoal();
  const columns = getActiveColumns();
  const plays = getActivePlays();
  const analysis = goal ? analyzeGoal(goal, columns, plays) : null;

  const {
    showCelebration,
    completedGoal,
    completedAnalysis,
    dismissCelebration,
  } = useAutoGoalCelebration(goal, analysis);

  const renderContent = () => {
    switch (sidebarView) {
      case 'goals':
        return <GoalsView />;
      case 'plays':
        return <PlaysView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-theme">
      <Sidebar
        className="hidden lg:flex fixed left-0 top-0 h-screen"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

<div
        className={`flex-1 min-h-screen pb-24 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[240px]'
        }`}
      >
        <Header onNewGoal={() => setShowNewGoalModal(true)} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 pt-6">
          {renderContent()}
        </main>

        <StreakBanner />
      </div>

      <SidePanel />
      <NewGoalModal isOpen={showNewGoalModal} onClose={() => setShowNewGoalModal(false)} />
      
      <GoalCompletionModal
        isOpen={showCelebration}
        onClose={dismissCelebration}
        goal={completedGoal}
        analysis={completedAnalysis}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <DashboardContent />
    </Providers>
  );
}