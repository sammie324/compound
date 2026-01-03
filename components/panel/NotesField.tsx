'use client';

import { cn } from '@/lib/utils';

interface NotesFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NotesField({ value, onChange, placeholder = 'Add notes...' }: NotesFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">Notes</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cn(
          'w-full px-3 py-2 text-sm text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-md resize-none',
          'placeholder:text-zinc-600',
          'focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50',
          'transition-colors'
        )}
      />
    </div>
  );
}