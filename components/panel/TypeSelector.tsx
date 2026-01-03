'use client';

import { cn } from '@/lib/utils';
import { PlayType } from '@/lib/types';
import { PLAY_TYPES } from '@/lib/constants';

interface TypeSelectorProps {
  value: PlayType;
  onChange: (value: PlayType) => void;
}

const typeOrder: PlayType[] = ['BUILD', 'BUY', 'SELL', 'SAVE', 'EARN', 'TRAIN', 'CUSTOM'];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">Type</label>
      <div className="flex flex-wrap gap-1.5">
        {typeOrder.map((type) => {
          const config = PLAY_TYPES[type];
          const isSelected = value === type;
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={cn(
                'px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all',
                isSelected
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              )}
            >
              {config.icon} {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}