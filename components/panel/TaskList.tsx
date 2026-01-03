'use client';

import { Plus, X, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { generateId } from '@/lib/id';

interface TaskListProps {
  tasks: Task[];
  onAdd: (task: Task) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, title: string) => void;
}

export function TaskList({ tasks, onAdd, onToggle, onDelete, onUpdate }: TaskListProps) {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    onAdd({
      id: generateId.task(),
      title: newTask.trim(),
      completed: false,
    });
    setNewTask('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">Tasks</label>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 group">
            <button
              onClick={() => onToggle(task.id)}
              className={cn(
                'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
                task.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-zinc-600 hover:border-zinc-500'
              )}
            >
              {task.completed && <Check className="w-2.5 h-2.5 text-black stroke-3" />}
            </button>
            
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdate(task.id, e.target.value)}
              className={cn(
                'flex-1 bg-transparent text-sm border-none outline-none',
                task.completed ? 'text-zinc-600 line-through' : 'text-zinc-300'
              )}
            />
            
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add new task */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-dashed border-zinc-700 flex items-center justify-center shrink-0">
            <Plus className="w-2.5 h-2.5 text-zinc-600" />
          </div>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 border-none outline-none"
          />
        </div>
      </div>
    </div>
  );
}