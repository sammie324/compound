import { create } from 'zustand';
import { BoardStore, Play, Column, Goal, Task, Workspace, ViewMode, SidebarView, Theme, FilterType } from '@/lib/types';
import { saveToStorage, loadFromStorage, clearStorage } from '@/lib/storage';
import { seedData } from '@/data/seed';

const initialState = {
  workspaces: [] as Workspace[],
  activeWorkspaceId: null as string | null,
  activeGoalId: null as string | null,
  goals: [] as Goal[],
  columns: [] as Column[],
  plays: [] as Play[],
  selectedPlayId: null as string | null,
  isPanelOpen: false,
  view: 'weekly' as ViewMode,
  sidebarView: 'dashboard' as SidebarView,
  theme: 'light' as Theme,
  filter: 'all' as FilterType,
  focusMode: false,
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  ...initialState,

  // Workspace CRUD
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [...state.workspaces, workspace] })),

  updateWorkspace: (id, patch) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    })),

  deleteWorkspace: (id) =>
    set((state) => {
      const newWorkspaces = state.workspaces.filter((w) => w.id !== id);
      const newActiveId = state.activeWorkspaceId === id
        ? newWorkspaces[0]?.id || null
        : state.activeWorkspaceId;
      return {
        workspaces: newWorkspaces,
        activeWorkspaceId: newActiveId,
        activeGoalId: state.activeWorkspaceId === id ? null : state.activeGoalId,
        goals: state.goals.filter((g) => g.workspaceId !== id),
        columns: state.columns.filter((c) => c.workspaceId !== id),
        plays: state.plays.filter((p) => {
          const col = state.columns.find((c) => c.id === p.columnId);
          return col?.workspaceId !== id;
        }),
      };
    }),

  setActiveWorkspace: (id) =>
    set((state) => {
      // When switching workspace, set activeGoalId to first goal in that workspace
      const firstGoal = state.goals.find((g) => g.workspaceId === id);
      return {
        activeWorkspaceId: id,
        activeGoalId: firstGoal?.id || null,
      };
    }),

  // Goals
  addGoal: (goal) =>
    set((state) => {
      const newGoals = [...state.goals, goal];
      // If this is the first goal for this workspace, make it active
      const workspaceGoals = newGoals.filter((g) => g.workspaceId === goal.workspaceId);
      const shouldSetActive = workspaceGoals.length === 1 || state.activeGoalId === null;
      return {
        goals: newGoals,
        activeGoalId: shouldSetActive ? goal.id : state.activeGoalId,
      };
    }),

  updateGoal: (id, patch) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    })),

  deleteGoal: (id) =>
    set((state) => {
      const newGoals = state.goals.filter((g) => g.id !== id);
      // If deleted goal was active, switch to first goal in workspace
      let newActiveGoalId = state.activeGoalId;
      if (state.activeGoalId === id) {
        const workspaceGoals = newGoals.filter((g) => g.workspaceId === state.activeWorkspaceId);
        newActiveGoalId = workspaceGoals[0]?.id || null;
      }
      return {
        goals: newGoals,
        activeGoalId: newActiveGoalId,
      };
    }),

  setActiveGoal: (id) => set({ activeGoalId: id }),

  // Columns
  addColumn: (column) =>
    set((state) => ({ columns: [...state.columns, column] })),

  updateColumn: (id, patch) =>
    set((state) => ({
      columns: state.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  deleteColumn: (id) =>
    set((state) => ({
      columns: state.columns.filter((c) => c.id !== id),
      plays: state.plays.filter((p) => p.columnId !== id),
    })),

  reorderColumns: (columnIds) =>
    set((state) => ({
      columns: columnIds
        .map((id, index) => {
          const col = state.columns.find((c) => c.id === id);
          return col ? { ...col, order: index } : null;
        })
        .filter((c): c is Column => c !== null),
    })),

  // Plays
  addPlay: (play) =>
    set((state) => ({ plays: [...state.plays, play] })),

  updatePlay: (id, patch) =>
    set((state) => ({
      plays: state.plays.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p
      ),
    })),

  deletePlay: (id) =>
    set((state) => ({
      plays: state.plays.filter((p) => p.id !== id),
      selectedPlayId: state.selectedPlayId === id ? null : state.selectedPlayId,
      isPanelOpen: state.selectedPlayId === id ? false : state.isPanelOpen,
    })),

  movePlay: (playId, newColumnId, newOrder) =>
    set((state) => {
      const plays = [...state.plays];
      const playIndex = plays.findIndex((p) => p.id === playId);
      if (playIndex === -1) return state;

      const play = { ...plays[playIndex], columnId: newColumnId, order: newOrder, updatedAt: Date.now() };
      plays.splice(playIndex, 1);

      const columnPlays = plays
        .filter((p) => p.columnId === newColumnId)
        .sort((a, b) => a.order - b.order);

      columnPlays.splice(newOrder, 0, play);
      const reorderedPlays = columnPlays.map((p, i) => ({ ...p, order: i }));

      const otherPlays = plays.filter((p) => p.columnId !== newColumnId);
      return { plays: [...otherPlays, ...reorderedPlays] };
    }),

  // Tasks
  addTask: (playId, task) =>
    set((state) => ({
      plays: state.plays.map((p) =>
        p.id === playId
          ? { ...p, tasks: [...p.tasks, task], updatedAt: Date.now() }
          : p
      ),
    })),

  updateTask: (playId, taskId, patch) =>
    set((state) => ({
      plays: state.plays.map((p) =>
        p.id === playId
          ? {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
              updatedAt: Date.now(),
            }
          : p
      ),
    })),

  deleteTask: (playId, taskId) =>
    set((state) => ({
      plays: state.plays.map((p) =>
        p.id === playId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId), updatedAt: Date.now() }
          : p
      ),
    })),

  toggleTask: (playId, taskId) =>
    set((state) => ({
      plays: state.plays.map((p) =>
        p.id === playId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
              updatedAt: Date.now(),
            }
          : p
      ),
    })),

  // UI
  selectPlay: (id) => set({ selectedPlayId: id, isPanelOpen: id !== null }),
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false, selectedPlayId: null }),
  setView: (view) => set({ view }),
  setSidebarView: (view) => set({ sidebarView: view }),
  setFilter: (filter) => set({ filter }),
  setFocusMode: (enabled) => set({ focusMode: enabled }),
  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },

  // Computed getters
  getActiveWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();
    return workspaces.find((w) => w.id === activeWorkspaceId) || null;
  },

  getActiveGoal: () => {
    const { goals, activeGoalId, activeWorkspaceId } = get();
    // First try to get by activeGoalId
    if (activeGoalId) {
      const goal = goals.find((g) => g.id === activeGoalId);
      if (goal) return goal;
    }
    // Fallback to first goal in workspace
    return goals.find((g) => g.workspaceId === activeWorkspaceId) || null;
  },

  getActiveColumns: () => {
    const { columns, activeWorkspaceId } = get();
    return columns
      .filter((c) => c.workspaceId === activeWorkspaceId)
      .sort((a, b) => a.order - b.order);
  },

  getActivePlays: () => {
    const { plays } = get();
    const activeColumns = get().getActiveColumns();
    const columnIds = new Set(activeColumns.map((c) => c.id));
    return plays.filter((p) => columnIds.has(p.columnId));
  },

  // Persistence
  loadFromStorage: () => {
    const data = loadFromStorage();
    if (data) {
      // Determine activeGoalId
      let activeGoalId = data.activeGoalId ?? null;
      if (!activeGoalId && data.goals?.length && data.activeWorkspaceId) {
        const firstGoal = data.goals.find((g: Goal) => g.workspaceId === data.activeWorkspaceId);
        activeGoalId = firstGoal?.id || null;
      }
      
      set({
        workspaces: data.workspaces ?? [],
        activeWorkspaceId: data.activeWorkspaceId ?? null,
        activeGoalId,
        goals: data.goals ?? [],
        columns: data.columns,
        plays: data.plays ?? [],
        view: data.view ?? 'weekly',
        sidebarView: data.sidebarView ?? 'dashboard',
        theme: data.theme ?? 'light',
      });
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', data.theme ?? 'light');
      }
    } else {
      set({
        workspaces: seedData.workspaces,
        activeWorkspaceId: seedData.activeWorkspaceId,
        activeGoalId: seedData.goals[0]?.id || null,
        goals: seedData.goals,
        columns: seedData.columns,
        plays: seedData.plays,
        view: 'weekly',
        sidebarView: 'dashboard',
        theme: 'light',
      });
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  },

  resetBoard: () => {
    clearStorage();
    set(initialState);
  },
}));

// Auto-save
let saveTimeout: NodeJS.Timeout;
useBoardStore.subscribe((state) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToStorage({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      activeGoalId: state.activeGoalId,
      goals: state.goals,
      columns: state.columns,
      plays: state.plays,
      view: state.view,
      sidebarView: state.sidebarView,
      theme: state.theme,
    });
  }, 500);
});