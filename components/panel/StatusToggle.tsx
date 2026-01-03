'use client';

import { cn } from '@/lib/utils';
import { PlayStatus } from '@/lib/types';
import { PLAY_STATUS } from '@/lib/constants';

interface StatusToggleProps {
  value: PlayStatus;
  onChange: (value: PlayStatus) => void;
}

const statusOrder: PlayStatus[] = ['PLANNED', 'ACTIVE', 'DONE', 'KILLED'];

const statusColors: Record<PlayStatus, string> = {
  PLANNED: 'bg-zinc-600',
  ACTIVE: 'bg-yellow-500',
  DONE: 'bg-emerald-500',
  KILLED: 'bg-red-500',
};

export function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">Status</label>
      <div className="flex gap-1.5">
        {statusOrder.map((status) => {
          const config = PLAY_STATUS[status];
          const isSelected = value === status;
          return (
            <button
              key={status}
              onClick={() => onChange(status)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all',
                isSelected
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              )}
            >
              <div className={cn('w-2 h-2 rounded-full', statusColors[status])} />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}