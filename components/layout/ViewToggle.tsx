'use client';

import { cn } from '@/lib/utils';
import { ViewMode } from '@/lib/types';
import { useBoardStore } from '@/store/useBoardStore';

const views: { value: ViewMode; label: string }[] = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
];

export function ViewToggle() {
  const view = useBoardStore((state) => state.view);
  const setView = useBoardStore((state) => state.setView);

  return (
    <div className="flex items-center justify-center">
      <div className="flex bg-theme-secondary p-1 rounded-lg border border-theme">
        {views.map((v) => (
          <button
            key={v.value}
            onClick={() => setView(v.value)}
            className={cn(
              'px-4 py-1.5 text-xs font-medium rounded-md transition-all',
              view === v.value
                ? 'bg-card text-theme shadow-sm border border-theme'
                : 'text-secondary hover:text-theme'
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}