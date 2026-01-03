'use client';

import { useEffect } from 'react';
import { X, Plus, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/useBoardStore';
import { useSelectedPlay } from '@/store/selectors';
import { PlayStatus } from '@/lib/types';
import { generateId } from '@/lib/id';

const statusOptions: { value: PlayStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PLANNED', label: 'Planned' },
  { value: 'DONE', label: 'Done' },
  { value: 'KILLED', label: 'Killed' },
];

export function SidePanel() {
  const isPanelOpen = useBoardStore((state) => state.isPanelOpen);
  const closePanel = useBoardStore((state) => state.closePanel);
  const updatePlay = useBoardStore((state) => state.updatePlay);
  const deletePlay = useBoardStore((state) => state.deletePlay);
  const addTask = useBoardStore((state) => state.addTask);
  const toggleTask = useBoardStore((state) => state.toggleTask);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const updateTask = useBoardStore((state) => state.updateTask);

  const play = useSelectedPlay();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePanel]);

  if (!play) return null;

  const handleUpdate = (patch: Partial<typeof play>) => {
    updatePlay(play.id, patch);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/20 z-50 transition-opacity',
          isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closePanel}
      />

      {/* Panel */}
      <aside
        className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-[26rem] bg-surface border-l border-theme shadow-xl z-50 transition-transform duration-200',
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-subtle">
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight text-theme truncate">
              {play.title}
            </div>
            <div className="text-xs text-secondary">Edit details</div>
          </div>
          <button
            onClick={closePanel}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-card-hover transition"
          >
            <X className="w-4 h-4 text-secondary" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-4rem)] no-scrollbar">
          {/* Title */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-secondary">Title</div>
            <input
              value={play.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Value & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-xs font-medium text-secondary">Value</div>
              <input
                value={play.value || ''}
                onChange={(e) => handleUpdate({ value: Number(e.target.value) || undefined })}
                placeholder="+$0"
                className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-secondary">Status</div>
              <select
                value={play.status}
                onChange={(e) => handleUpdate({ status: e.target.value as PlayStatus })}
                className="w-full rounded-lg border border-theme bg-card px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-secondary">Tasks</div>
              <button
                onClick={() =>
                  addTask(play.id, { id: generateId.task(), title: 'New task', completed: false })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-theme bg-card px-3 py-1.5 text-xs font-medium text-theme hover:bg-card-hover transition"
              >
                <Plus className="w-4 h-4 text-secondary" strokeWidth={1.5} />
                Add task
              </button>
            </div>

            <div className="space-y-2">
              {play.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTask(play.id, task.id)}
                    className={cn(
                      'h-9 w-9 rounded-lg border flex items-center justify-center transition',
                      task.completed
                        ? 'bg-[#10B981] border-[#10B981]'
                        : 'border-theme bg-card hover:bg-card-hover'
                    )}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" strokeWidth={2} />}
                  </button>
                  <input
                    value={task.title}
                    onChange={(e) => updateTask(play.id, task.id, { title: e.target.value })}
                    className={cn(
                      'flex-1 rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                      task.completed ? 'text-secondary line-through' : 'text-theme'
                    )}
                  />
                  <button
                    onClick={() => deleteTask(play.id, task.id)}
                    className="h-9 w-9 rounded-lg border border-theme bg-card hover:bg-card-hover transition flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-secondary" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-secondary">Notes</div>
            <textarea
              value={play.notes || ''}
              onChange={(e) => handleUpdate({ notes: e.target.value })}
              rows={5}
              placeholder="Context, links, next steps…"
              className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => deletePlay(play.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-theme bg-card px-3 py-2 text-sm font-medium text-red-500 hover:bg-card-hover transition"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              Delete
            </button>
            <button
              onClick={closePanel}
              className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition shadow-sm"
            >
              <Check className="w-4 h-4" strokeWidth={1.5} />
              Save
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}