import { nanoid } from 'nanoid';

// Generate unique IDs for different entities
export const generateId = {
  play: () => `play_${nanoid(10)}`,
  column: () => `col_${nanoid(8)}`,
  goal: () => `goal_${nanoid(8)}`,
  task: () => `task_${nanoid(8)}`,
  workspace: () => `ws_${nanoid(8)}`,
};

// Generic ID generator
export const createId = (prefix?: string): string => {
  const id = nanoid(10);
  return prefix ? `${prefix}_${id}` : id;
};