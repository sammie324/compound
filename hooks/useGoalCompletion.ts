'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Goal } from '@/lib/types';
import { GoalAnalysis } from '@/lib/calculations';

interface UseGoalCompletionReturn {
  showCelebration: boolean;
  completedGoal: Goal | null;
  completedAnalysis: GoalAnalysis | null;
  triggerCelebration: (goal: Goal, analysis: GoalAnalysis) => void;
  dismissCelebration: () => void;
}

// Track which goals have already been celebrated (persisted)
const CELEBRATED_KEY = 'compound-celebrated-goals';

function getCelebratedGoals(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(CELEBRATED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCelebratedGoal(goalId: string) {
  if (typeof window === 'undefined') return;
  try {
    const celebrated = getCelebratedGoals();
    celebrated.add(goalId);
    localStorage.setItem(CELEBRATED_KEY, JSON.stringify([...celebrated]));
  } catch {
    // Ignore storage errors
  }
}

export function useGoalCompletion(): UseGoalCompletionReturn {
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);
  const [completedAnalysis, setCompletedAnalysis] = useState<GoalAnalysis | null>(null);
  const celebratedRef = useRef<Set<string>>(new Set());

  // Load celebrated goals on mount
  useEffect(() => {
    celebratedRef.current = getCelebratedGoals();
  }, []);

  const triggerCelebration = useCallback((goal: Goal, analysis: GoalAnalysis) => {
    // Don't celebrate the same goal twice
    if (celebratedRef.current.has(goal.id)) return;
    
    // Only trigger if goal is actually complete
    if (analysis.progress.percentage < 100) return;

    setCompletedGoal(goal);
    setCompletedAnalysis(analysis);
    setShowCelebration(true);
    
    // Mark as celebrated
    celebratedRef.current.add(goal.id);
    saveCelebratedGoal(goal.id);
  }, []);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    // Small delay before clearing data for smooth animation
    setTimeout(() => {
      setCompletedGoal(null);
      setCompletedAnalysis(null);
    }, 300);
  }, []);

  return {
    showCelebration,
    completedGoal,
    completedAnalysis,
    triggerCelebration,
    dismissCelebration,
  };
}

/**
 * Hook to automatically detect and celebrate goal completion
 */
export function useAutoGoalCelebration(
  goal: Goal | null,
  analysis: GoalAnalysis | null
): UseGoalCompletionReturn {
  const completion = useGoalCompletion();
  const previousPercentage = useRef<number>(0);

  useEffect(() => {
    if (!goal || !analysis) return;

    const currentPercentage = analysis.progress.percentage;
    
    // Detect when goal crosses 100% threshold
    if (previousPercentage.current < 100 && currentPercentage >= 100) {
      completion.triggerCelebration(goal, analysis);
    }

    previousPercentage.current = currentPercentage;
  }, [goal, analysis, completion]);

  return completion;
}