import { Play, Column, Goal, Workspace } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface ProgressMetrics {
  current: number;
  target: number;
  percentage: number;
  remaining: number;
}

export interface VelocityMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  trend: 'accelerating' | 'steady' | 'decelerating' | 'stalled';
  trendPercent: number;
}

export interface ProjectionMetrics {
  daysToGoal: number | null;
  estimatedDate: Date | null;
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  onTrack: boolean;
}

export interface MomentumMetrics {
  streak: number;
  tasksDoneToday: number;
  tasksDoneThisWeek: number;
  playsCompletedThisWeek: number;
  compoundScore: number; // 0-100 score representing overall momentum
}

export interface GoalAnalysis {
  progress: ProgressMetrics;
  velocity: VelocityMetrics;
  projection: ProjectionMetrics;
  momentum: MomentumMetrics;
}

export interface ColumnAnalysis {
  column: Column;
  plays: Play[];
  progress: ProgressMetrics;
  activePlays: number;
  completedTasks: number;
  totalTasks: number;
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

const MS_PER_DAY = 86400000;
const MS_PER_WEEK = MS_PER_DAY * 7;

function startOfDay(date: Date | number): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function daysBetween(start: number, end: number): number {
  return Math.max(1, Math.floor((end - start) / MS_PER_DAY));
}

function isToday(timestamp: number): boolean {
  return startOfDay(timestamp) === startOfDay(Date.now());
}

function isThisWeek(timestamp: number): boolean {
  const now = Date.now();
  const weekAgo = now - MS_PER_WEEK;
  return timestamp >= weekAgo && timestamp <= now;
}

// ============================================================================
// CORE CALCULATIONS
// ============================================================================

/**
 * Calculate progress metrics for any numeric goal
 */
export function calculateProgress(current: number, target: number): ProgressMetrics {
  const safeTarget = Math.max(1, target);
  const percentage = Math.min(100, Math.round((current / safeTarget) * 100));
  const remaining = Math.max(0, target - current);

  return { current, target, percentage, remaining };
}

/**
 * Calculate velocity with trend analysis
 * Uses weighted moving average - recent data weighted more heavily
 */
export function calculateVelocity(
  current: number,
  startDate: number,
  historicalSnapshots?: { date: number; value: number }[]
): VelocityMetrics {
  const now = Date.now();
  const totalDays = daysBetween(startDate, now);
  
  // Base daily rate
  const daily = current / totalDays;
  const weekly = daily * 7;
  const monthly = daily * 30;

  // Calculate trend if we have historical data
  let trend: VelocityMetrics['trend'] = 'steady';
  let trendPercent = 0;

  if (historicalSnapshots && historicalSnapshots.length >= 2) {
    // Compare recent week velocity vs previous week
    const sorted = [...historicalSnapshots].sort((a, b) => b.date - a.date);
    const recentWeek = sorted.filter(s => isThisWeek(s.date));
    const previousWeek = sorted.filter(s => {
      const weekAgo = Date.now() - MS_PER_WEEK;
      const twoWeeksAgo = weekAgo - MS_PER_WEEK;
      return s.date >= twoWeeksAgo && s.date < weekAgo;
    });

    if (recentWeek.length > 0 && previousWeek.length > 0) {
      const recentGain = recentWeek[0].value - (recentWeek[recentWeek.length - 1]?.value || 0);
      const previousGain = previousWeek[0].value - (previousWeek[previousWeek.length - 1]?.value || 0);

      if (previousGain > 0) {
        trendPercent = Math.round(((recentGain - previousGain) / previousGain) * 100);
        
        if (trendPercent > 10) trend = 'accelerating';
        else if (trendPercent < -10) trend = 'decelerating';
        else trend = 'steady';
      }
    }
  } else {
    // Without historical data, infer from daily rate
    if (daily <= 0) trend = 'stalled';
  }

  return { daily, weekly, monthly, trend, trendPercent };
}

/**
 * Project completion date with confidence scoring
 */
export function calculateProjection(
  target: number,
  current: number,
  velocity: VelocityMetrics,
  startDate: number,
  deadline?: number
): ProjectionMetrics {
  const remaining = target - current;

  // Already complete
  if (remaining <= 0) {
    return {
      daysToGoal: 0,
      estimatedDate: new Date(),
      confidence: 'high',
      onTrack: true,
    };
  }

  // No velocity = can't project
  if (velocity.daily <= 0) {
    return {
      daysToGoal: null,
      estimatedDate: null,
      confidence: 'insufficient',
      onTrack: false,
    };
  }

  const daysToGoal = Math.ceil(remaining / velocity.daily);
  const estimatedDate = new Date(Date.now() + daysToGoal * MS_PER_DAY);

  // Calculate confidence based on data quality
  const daysSinceStart = daysBetween(startDate, Date.now());
  let confidence: ProjectionMetrics['confidence'] = 'medium';

  if (daysSinceStart >= 30 && velocity.trend !== 'stalled') {
    confidence = 'high';
  } else if (daysSinceStart >= 7) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Check if on track for deadline
  let onTrack = true;
  if (deadline) {
    const daysUntilDeadline = daysBetween(Date.now(), deadline);
    onTrack = daysToGoal <= daysUntilDeadline;
  }

  return { daysToGoal, estimatedDate, confidence, onTrack };
}

/**
 * Calculate momentum metrics from plays
 */
export function calculateMomentum(plays: Play[]): MomentumMetrics {
  const now = Date.now();
  
  // Task completion tracking
  let tasksDoneToday = 0;
  let tasksDoneThisWeek = 0;
  let totalTasksDone = 0;
  let totalTasks = 0;

  plays.forEach(p => {
    p.tasks.forEach(t => {
      totalTasks++;
      if (t.completed) {
        totalTasksDone++;
        // Approximate: if play was updated today/this week, count tasks
        if (isToday(p.updatedAt)) tasksDoneToday++;
        if (isThisWeek(p.updatedAt)) tasksDoneThisWeek++;
      }
    });
  });

  // Plays completed this week
  const playsCompletedThisWeek = plays.filter(
    p => p.status === 'DONE' && isThisWeek(p.updatedAt)
  ).length;

  // Calculate streak
  const streak = calculateStreak(plays);

  // Compound score (0-100)
  // Factors: streak, task completion rate, recent activity
  const taskCompletionRate = totalTasks > 0 ? totalTasksDone / totalTasks : 0;
  const streakBonus = Math.min(streak * 2, 30); // Max 30 points from streak
  const activityBonus = Math.min(tasksDoneThisWeek * 3, 40); // Max 40 points from activity
  const completionBonus = Math.round(taskCompletionRate * 30); // Max 30 points from completion

  const compoundScore = Math.min(100, streakBonus + activityBonus + completionBonus);

  return {
    streak,
    tasksDoneToday,
    tasksDoneThisWeek,
    playsCompletedThisWeek,
    compoundScore,
  };
}

/**
 * Calculate consecutive days with completed plays
 */
export function calculateStreak(plays: Play[]): number {
  const completedDates = plays
    .filter(p => p.status === 'DONE')
    .map(p => startOfDay(p.updatedAt))
    .filter((v, i, a) => a.indexOf(v) === i) // unique dates
    .sort((a, b) => b - a); // newest first

  if (completedDates.length === 0) return 0;

  let streak = 0;
  let checkDate = startOfDay(Date.now());

  // Allow for today or yesterday to start streak
  if (completedDates[0] < checkDate - MS_PER_DAY) return 0;

  for (const date of completedDates) {
    if (date === checkDate || date === checkDate - MS_PER_DAY) {
      streak++;
      checkDate = date - MS_PER_DAY;
    } else if (date < checkDate - MS_PER_DAY) {
      break;
    }
  }

  return streak;
}

// ============================================================================
// AGGREGATION & ANALYSIS
// ============================================================================

/**
 * Full analysis for a goal with its related plays
 */
export function analyzeGoal(
  goal: Goal,
  columns: Column[],
  plays: Play[]
): GoalAnalysis {
  // Get all columns for this workspace
  const workspaceColumns = columns.filter(c => c.workspaceId === goal.workspaceId);
  const columnIds = new Set(workspaceColumns.map(c => c.id));
  
  // Get all plays in those columns
  const goalPlays = plays.filter(p => columnIds.has(p.columnId));

  // Auto-calculate current from DONE plays
  const calculatedCurrent = goalPlays
    .filter(p => p.status === 'DONE')
    .reduce((sum, p) => sum + (p.value || 0), 0);

  const progress = calculateProgress(calculatedCurrent, goal.target);
  const velocity = calculateVelocity(calculatedCurrent, goal.startDate);
  const projection = calculateProjection(goal.target, calculatedCurrent, velocity, goal.startDate, goal.deadline);
  const momentum = calculateMomentum(goalPlays);

  return { progress, velocity, projection, momentum };
}

/**
 * Analyze a single column
 */
export function analyzeColumn(column: Column, plays: Play[]): ColumnAnalysis {
  const columnPlays = plays.filter(p => p.columnId === column.id);
  const current = columnPlays.reduce((sum, p) => sum + (p.value || 0), 0);
  const target = column.target || 10000;

  let completedTasks = 0;
  let totalTasks = 0;
  columnPlays.forEach(p => {
    p.tasks.forEach(t => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  return {
    column,
    plays: columnPlays,
    progress: calculateProgress(current, target),
    activePlays: columnPlays.filter(p => p.status === 'ACTIVE').length,
    completedTasks,
    totalTasks,
  };
}

/**
 * Calculate total progress across all plays in columns
 */
export function calculateColumnsTotalProgress(
  columns: Column[],
  plays: Play[]
): ProgressMetrics {
  let totalCurrent = 0;
  let totalTarget = 0;

  columns.forEach(col => {
    const colPlays = plays.filter(p => p.columnId === col.id);
    totalCurrent += colPlays.reduce((sum, p) => sum + (p.value || 0), 0);
    totalTarget += col.target || 0;
  });

  return calculateProgress(totalCurrent, Math.max(1, totalTarget));
}

// ============================================================================
// FORMATTING
// ============================================================================

export function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toLocaleString()}`;
}

export function formatValue(value: number, unit: string): string {
  if (unit === '$') return formatCurrency(value);
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k ${unit}`;
  return `${value.toLocaleString()} ${unit}`;
}

export function formatProjectionMessage(projection: ProjectionMetrics): string {
  if (projection.daysToGoal === 0) return '🎉 Goal reached!';
  if (projection.daysToGoal === null) return 'Keep going to build momentum';
  if (projection.daysToGoal === 1) return 'On track to hit goal tomorrow';
  return `At current pace, you'll hit your goal in ${projection.daysToGoal} days`;
}

export function formatVelocity(velocity: VelocityMetrics, unit: string): string {
  const weeklyFormatted = formatValue(Math.round(velocity.weekly), unit);
  return `+${weeklyFormatted}/week`;
}