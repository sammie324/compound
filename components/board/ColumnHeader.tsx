'use client';

import { cn } from '@/lib/utils';
import { ColumnColor } from '@/lib/types';
import { COLUMN_COLORS } from '@/lib/constants';

interface ColumnHeaderProps {
  title: string;
  color: ColumnColor;
  activeCount?: number;
  totalCount?: number;
}

export function ColumnHeader({
  title,
  color,
  activeCount = 0,
  totalCount = 0,
}: ColumnHeaderProps) {
  const colors = COLUMN_COLORS[color];

  return (
    <div className="flex items-center justify-between px-1 mb-4">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            colors.dot,
            colors.glow
          )}
        />
        <h3 className="text-sm font-medium text-theme">{title}</h3>
      </div>
      <span className="text-xs text-secondary">
        {activeCount > 0 ? `${activeCount} plays active` : `${totalCount} plays`}
      </span>
    </div>
  );
}