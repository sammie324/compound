'use client';

import { Focus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/useBoardStore';
import { FilterType } from '@/lib/types';

export function FilterBar() {
  const filter = useBoardStore((s) => s.filter);
  const setFilter = useBoardStore((s) => s.setFilter);
  const focusMode = useBoardStore((s) => s.focusMode);
  const setFocusMode = useBoardStore((s) => s.setFocusMode);

  return (
    <section className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="inline-flex rounded-lg border border-theme bg-card p-1 shadow-sm">
            {(['all', 'active', 'week'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition',
                  filter === f
                    ? 'bg-card-hover text-theme'
                    : 'text-secondary hover:bg-card-hover'
                )}
              >
                {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'This Week'}
              </button>
            ))}
          </div>

          {/* Focus toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition shadow-sm',
              focusMode
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                : 'border-theme bg-card text-theme hover:bg-card-hover'
            )}
          >
            <Focus className={cn('w-4 h-4', focusMode ? 'text-emerald-500' : 'text-secondary')} strokeWidth={1.5} />
            <span className="hidden sm:inline">Focus</span>
            <span className={cn('text-xs font-medium', focusMode ? 'text-emerald-500' : 'text-secondary')}>
              ({focusMode ? 'On' : 'Off'})
            </span>
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-secondary">
        Shortcuts: <span className="font-medium text-theme">N</span> quick add ·{' '}
        <span className="font-medium text-theme">F</span> focus mode ·{' '}
        <span className="font-medium text-theme">Esc</span> close
      </div>
    </section>
  );
}