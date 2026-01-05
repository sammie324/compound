import { Column, Play, Goal, Workspace } from '@/lib/types';
import { generateId } from '@/lib/id';

const defaultWorkspaceId = generateId.workspace();

export const seedWorkspaces: Workspace[] = [
  {
    id: defaultWorkspaceId,
    title: 'My Workspace',
    color: 'emerald',
    boardName: 'My Board',
    dateRange: '2024',
  }
];

export const seedGoals: Goal[] = [];
export const seedColumns: Column[] = [];
export const seedPlays: Play[] = [];

export const seedData = {
  workspaces: seedWorkspaces,
  activeWorkspaceId: defaultWorkspaceId,
  goals: seedGoals,
  columns: seedColumns,
  plays: seedPlays,
};