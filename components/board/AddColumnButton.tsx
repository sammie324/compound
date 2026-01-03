'use client';

import { Plus } from 'lucide-react';
import { useBoardStore } from '@/store/useBoardStore';
import { generateId } from '@/lib/id';
import { ColumnColor } from '@/lib/types';

const COLORS: ColumnColor[] = ['emerald', 'blue', 'violet', 'orange'];

export function AddColumnButton() {
  const columns = useBoardStore((state) => state.columns);
  const addColumn = useBoardStore((state) => state.addColumn);
  const activeWorkspaceId = useBoardStore((state) => state.activeWorkspaceId);

  const handleAddColumn = () => {
    if (!activeWorkspaceId) return;
    
    const colorIndex = columns.length % COLORS.length;
    addColumn({
      id: generateId.column(),
      workspaceId: activeWorkspaceId,
      title: `New Column ${columns.length + 1}`,
      color: COLORS[colorIndex],
      order: columns.length,
    });
  };

  return (
    <button
      onClick={handleAddColumn}
      className="min-w-[280px] h-full min-h-[200px] rounded-xl border-2 border-dashed border-theme hover:border-muted hover:bg-card-hover transition-all flex flex-col items-center justify-center gap-2 text-secondary hover:text-theme"
    >
      <Plus className="w-6 h-6" />
      <span className="text-sm font-medium">Add Column</span>
    </button>
  );
}