'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Play, ColumnColor } from '@/lib/types';
import { COLUMN_COLORS } from '@/lib/constants';
import { useBoardStore } from '@/store/useBoardStore';
import { formatValue } from '@/lib/calculations';

interface PlayCardProps {
  play: Play;
  columnColor?: ColumnColor;
}

const statusStyles: Record<string, { bg: string; text: string; label: string; icon?: boolean }> = {
  PLANNED: { bg: 'var(--status-planned-bg)', text: 'text-theme', label: 'Planned' },
  ACTIVE: { bg: '#10B981', text: 'text-white', label: 'Active' },
  DONE: { bg: 'rgba(16,185,129,0.14)', text: 'text-emerald-500', label: 'Done', icon: true },
  KILLED: { bg: '#EF4444', text: 'text-white', label: 'Killed' },
};

export function PlayCard({ play, columnColor = 'emerald' }: PlayCardProps) {
  const selectPlay = useBoardStore((state) => state.selectPlay);
  const toggleTask = useBoardStore((state) => state.toggleTask);
  const focusMode = useBoardStore((state) => state.focusMode);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: play.id,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const status = statusStyles[play.status];
  const colorConfig = COLUMN_COLORS[columnColor];

  // Determine if this card should be dimmed (focus mode: only ACTIVE highlighted)
  const isDimmed = focusMode && play.status !== 'ACTIVE';

  const formatPlayValue = (val?: number) => {
    if (!val) return null;
    const formatted = formatValue(val, play.unit || '');
    return `+${formatted}`;
  };

  const doneTasks = play.tasks.filter((t) => t.completed).length;
  const totalTasks = play.tasks.length || 1;
  const taskPct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        'play-card rounded-xl border border-theme bg-card shadow-sm cursor-pointer transition-all duration-200',
        isDragging && 'opacity-50',
        isDimmed && 'opacity-40 scale-[0.98]'
      )}
      onClick={() => selectPlay(play.id)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="drag-handle inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-card-hover cursor-grab"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4 text-muted" strokeWidth={1.5} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-theme truncate">{play.title}</span>
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-tight',
                  status.text
                )}
                style={{ background: status.bg }}
              >
                {status.icon && <Check className="w-3 h-3 mr-1" strokeWidth={2} />}
                {status.label}
              </span>
            </div>
          </div>

          {play.value && (
            <span
              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold tabular-nums shrink-0"
              style={{ color: colorConfig.bar, background: `${colorConfig.bar}24` }}
            >
              {formatPlayValue(play.value)}
            </span>
          )}
        </div>

        {/* Tasks */}
        {play.tasks.length > 0 && (
          <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
            {play.tasks.map((task) => (
              <button
                key={task.id}
                className="flex items-center gap-2 w-full text-left"
                onClick={() => toggleTask(play.id, task.id)}
              >
                <span
                  className={cn(
                    'relative h-4 w-4 rounded-full border shrink-0 flex items-center justify-center',
                    task.completed ? 'bg-[#10B981] border-[#10B981]' : 'border-muted bg-card'
                  )}
                >
                  {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={2} />}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    task.completed
                      ? 'text-secondary line-through decoration-muted'
                      : 'text-theme'
                  )}
                >
                  {task.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <div className="text-xs font-medium text-secondary tabular-nums">
            <span className="text-theme font-semibold">{doneTasks}</span>/{totalTasks}
          </div>
          <div className="h-1.5 w-16 rounded-full bg-theme-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${taskPct}%`, background: colorConfig.bar }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}