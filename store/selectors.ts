import { useBoardStore } from './useBoardStore';
import {
  analyzeGoal,
  calculateMomentum,
  calculateColumnsTotalProgress,
  GoalAnalysis,
  MomentumMetrics,
  ProgressMetrics,
} from '@/lib/calculations';

// ============================================================================
// BASIC SELECTORS
// ============================================================================

export function useActiveWorkspace() {
  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  return workspaces.find((w) => w.id === activeWorkspaceId) || null;
}

export function useActiveGoal() {
  const goals = useBoardStore((s) => s.goals);
  const activeGoalId = useBoardStore((s) => s.activeGoalId);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  
  // First try activeGoalId
  if (activeGoalId) {
    const goal = goals.find((g) => g.id === activeGoalId);
    if (goal) return goal;
  }
  // Fallback to first goal in workspace
  return goals.find((g) => g.workspaceId === activeWorkspaceId) || null;
}

export function useActiveColumns() {
  const columns = useBoardStore((s) => s.columns);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  return columns
    .filter((c) => c.workspaceId === activeWorkspaceId)
    .sort((a, b) => a.order - b.order);
}

export function useActivePlays() {
  const columns = useBoardStore((s) => s.columns);
  const plays = useBoardStore((s) => s.plays);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  
  const activeColumnIds = new Set(
    columns.filter((c) => c.workspaceId === activeWorkspaceId).map((c) => c.id)
  );
  return plays.filter((p) => activeColumnIds.has(p.columnId));
}

export function useSortedColumns() {
  return useActiveColumns();
}

export function useColumnPlays(columnId: string) {
  const plays = useBoardStore((s) => s.plays);
  return plays
    .filter((p) => p.columnId === columnId)
    .sort((a, b) => a.order - b.order);
}

export function useSelectedPlay() {
  const selectedPlayId = useBoardStore((s) => s.selectedPlayId);
  const plays = useBoardStore((s) => s.plays);
  return plays.find((p) => p.id === selectedPlayId) || null;
}

// ============================================================================
// ADVANCED ANALYSIS SELECTORS
// ============================================================================

export function useGoalAnalysis(): GoalAnalysis | null {
  const goals = useBoardStore((s) => s.goals);
  const columns = useBoardStore((s) => s.columns);
  const plays = useBoardStore((s) => s.plays);
  const activeGoalId = useBoardStore((s) => s.activeGoalId);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);

  // Use activeGoalId first, fallback to first in workspace
  let goal = activeGoalId ? goals.find((g) => g.id === activeGoalId) : null;
  if (!goal) {
    goal = goals.find((g) => g.workspaceId === activeWorkspaceId);
  }
  if (!goal) return null;

  const activeColumns = columns.filter((c) => c.workspaceId === activeWorkspaceId);
  const activeColumnIds = new Set(activeColumns.map((c) => c.id));
  const activePlays = plays.filter((p) => activeColumnIds.has(p.columnId));

  return analyzeGoal(goal, activeColumns, activePlays);
}

export function useMomentumStats(): MomentumMetrics {
  const columns = useBoardStore((s) => s.columns);
  const plays = useBoardStore((s) => s.plays);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);

  const activeColumnIds = new Set(
    columns.filter((c) => c.workspaceId === activeWorkspaceId).map((c) => c.id)
  );
  const activePlays = plays.filter((p) => activeColumnIds.has(p.columnId));

  return calculateMomentum(activePlays);
}

export function useTotalProgress(): ProgressMetrics & {
  activePlays: number;
  playCount: number;
  completedTasks: number;
  totalTasks: number;
} {
  const columns = useBoardStore((s) => s.columns);
  const plays = useBoardStore((s) => s.plays);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);

  const activeColumns = columns.filter((c) => c.workspaceId === activeWorkspaceId);
  const activeColumnIds = new Set(activeColumns.map((c) => c.id));
  const activePlays = plays.filter((p) => activeColumnIds.has(p.columnId));

  const progress = calculateColumnsTotalProgress(activeColumns, activePlays);

  let completedTasks = 0;
  let totalTasks = 0;
  activePlays.forEach((p) => {
    p.tasks.forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  return {
    ...progress,
    activePlays: activePlays.filter((p) => p.status === 'ACTIVE').length,
    playCount: activePlays.length,
    completedTasks,
    totalTasks,
  };
}

export function useColumnProgress(columnId: string): ProgressMetrics {
  const columns = useBoardStore((s) => s.columns);
  const plays = useBoardStore((s) => s.plays);

  const column = columns.find((c) => c.id === columnId);
  const columnPlays = plays.filter((p) => p.columnId === columnId);
  const current = columnPlays.reduce((sum, p) => sum + (p.value || 0), 0);
  const target = column?.target || 10000;
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return {
    current,
    target,
    percentage,
    remaining: Math.max(0, target - current),
  };
}