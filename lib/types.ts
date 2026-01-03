export type PlayType = 'BUILD' | 'BUY' | 'SELL' | 'SAVE' | 'EARN' | 'TRAIN' | 'CUSTOM';
export type PlayStatus = 'PLANNED' | 'ACTIVE' | 'DONE' | 'KILLED';
export type ViewMode = 'yearly' | 'monthly' | 'weekly';
export type SidebarView = 'dashboard' | 'goals' | 'plays';
export type Theme = 'light' | 'dark';
export type FilterType = 'all' | 'active' | 'week';

export type ColumnColor =
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'orange'
  | 'rose'
  | 'pink'
  | 'fuchsia'
  | 'purple'
  | 'indigo'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'red'
  | 'slate'
  | 'zinc'
  | 'stone'
  | 'sky';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Play {
  id: string;
  title: string;
  type: PlayType;
  status: PlayStatus;
  columnId: string;
  order: number;
  value?: number;
  target?: number;
  unit?: string;
  notes?: string;
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
}

export interface Column {
  id: string;
  workspaceId: string;
  title: string;
  color: ColumnColor;
  order: number;
  target?: number;
  unit?: string;
}

export interface Goal {
  id: string;
  workspaceId: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  color: ColumnColor;
  startDate: number;
  deadline?: number;
}

export interface Workspace {
  id: string;
  title: string;
  color: ColumnColor;
  boardName?: string;
  dateRange?: string;
}

export interface BoardState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeGoalId: string | null;
  goals: Goal[];
  columns: Column[];
  plays: Play[];
  selectedPlayId: string | null;
  isPanelOpen: boolean;
  view: ViewMode;
  sidebarView: SidebarView;
  theme: Theme;
  filter: FilterType;
  focusMode: boolean;
}

export interface BoardActions {
  // Workspace
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, patch: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;

  // Goals
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setActiveGoal: (id: string | null) => void;

  // Columns
  addColumn: (column: Column) => void;
  updateColumn: (id: string, patch: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (columnIds: string[]) => void;

  // Plays
  addPlay: (play: Play) => void;
  updatePlay: (id: string, patch: Partial<Play>) => void;
  deletePlay: (id: string) => void;
  movePlay: (playId: string, newColumnId: string, newOrder: number) => void;

  // Tasks
  addTask: (playId: string, task: Task) => void;
  updateTask: (playId: string, taskId: string, patch: Partial<Task>) => void;
  deleteTask: (playId: string, taskId: string) => void;
  toggleTask: (playId: string, taskId: string) => void;

  // UI
  selectPlay: (id: string | null) => void;
  openPanel: () => void;
  closePanel: () => void;
  setView: (view: ViewMode) => void;
  setSidebarView: (view: SidebarView) => void;
  setTheme: (theme: Theme) => void;
  setFilter: (filter: FilterType) => void;
  setFocusMode: (enabled: boolean) => void;

  // Persistence
  loadFromStorage: () => void;
  resetBoard: () => void;

  // Computed
  getActiveWorkspace: () => Workspace | null;
  getActiveGoal: () => Goal | null;
  getActiveColumns: () => Column[];
  getActivePlays: () => Play[];
}

export type BoardStore = BoardState & BoardActions;