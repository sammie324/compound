'use client';

import { Plus } from 'lucide-react';

interface AddPlayButtonProps {
  onClick?: () => void;
}

export function AddPlayButton({ onClick }: AddPlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-theme bg-card/60 hover:bg-card hover:border-muted transition px-4 py-3 text-sm font-medium text-secondary flex items-center justify-center gap-2"
    >
      <Plus className="w-4 h-4" strokeWidth={1.5} />
      <span>Add Play</span>
    </button>
  );
}