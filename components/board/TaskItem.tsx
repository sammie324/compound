'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <div
      className="task-row flex items-start gap-3 cursor-pointer group/task"
      onClick={onToggle}
    >
      <div
        className={cn(
          'custom-checkbox w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5',
          task.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-muted bg-card group-hover/task:border-secondary'
        )}
      >
        <Check
          className={cn(
            'w-2.5 h-2.5 text-white stroke-3',
            task.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
          )}
        />
      </div>
      <span
        className={cn(
          'text-xs transition-colors',
          task.completed
            ? 'line-through text-muted'
            : 'text-secondary group-hover/task:text-theme'
        )}
      >
        {task.title}
      </span>
    </div>
  );
}