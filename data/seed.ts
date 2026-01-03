import { Column, Play, Goal, Workspace } from '@/lib/types';

export const seedWorkspaces: Workspace[] = [];
export const seedGoals: Goal[] = [];
export const seedColumns: Column[] = [];
export const seedPlays: Play[] = [];

export const seedData = {
  workspaces: seedWorkspaces,
  activeWorkspaceId: null,
  goals: seedGoals,
  columns: seedColumns,
  plays: seedPlays,
};