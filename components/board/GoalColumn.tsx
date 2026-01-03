'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Wallet, Users, Rocket, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Column, Play, ColumnColor } from '@/lib/types';
import { COLUMN_COLORS } from '@/lib/constants';
import { PlayCard } from './PlayCard';
import { AddPlayButton } from './AddPlayButton';
import { useBoardStore } from '@/store/useBoardStore';
import { generateId } from '@/lib/id';
import { formatValue } from '@/lib/calculations';

interface GoalColumnProps {
  column: Column;
  plays: Play[];
}

const columnIcons: Record<ColumnColor, typeof Wallet> = {
  emerald: Wallet,
  blue: Users,
  violet: Rocket,
  orange: Wallet,
  rose: Wallet,
  pink: Users,
  fuchsia: Rocket,
  purple: Wallet,
  indigo: Users,
  cyan: Rocket,
  teal: Wallet,
  green: Users,
  lime: Rocket,
  yellow: Wallet,
  amber: Users,
  red: Rocket,
  slate: Wallet,
  zinc: Users,
  stone: Rocket,
  sky: Wallet,
};

export function GoalColumn({ column, plays }: GoalColumnProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const addPlay = useBoardStore((state) => state.addPlay);
  const filter = useBoardStore((state) => state.filter);
  const focusMode = useBoardStore((state) => state.focusMode);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  // Filter plays based on active filter
  const filteredPlays = plays.filter((play) => {
    if (filter === 'all') return true;
    if (filter === 'active') return play.status === 'ACTIVE';
    if (filter === 'week') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return play.updatedAt >= weekAgo || play.status === 'ACTIVE';
    }
    return true;
  });

  const sortedPlays = [...filteredPlays].sort((a, b) => a.order - b.order);
  const playIds = sortedPlays.map((p) => p.id);
  const activePlays = plays.filter((p) => p.status === 'ACTIVE').length;

  const current = plays.reduce((sum, p) => sum + (p.value || 0), 0);
  const target = column.target || 10000;
  const unit = column.unit || '$';
  const percentage = Math.min(100, Math.round((current / target) * 100));

  const Icon = columnIcons[column.color] || Wallet;
  const config = COLUMN_COLORS[column.color] || COLUMN_COLORS.emerald;

  const handleAddPlay = () => {
    addPlay({
      id: generateId.play(),
      title: 'New Play',
      type: 'BUILD',
      status: 'PLANNED',
      columnId: column.id,
      order: plays.length,
      tasks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  // Focus mode opacity: dimmed by default, full on hover
  const focusOpacity = focusMode ? (isHovered ? 1 : 0.55) : 1;

  return (
    <section
      className={cn(
        'column group rounded-xl border border-theme bg-card shadow-sm overflow-hidden transition-opacity duration-200'
      )}
      style={{ opacity: focusOpacity }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div 
        className="p-4 border-b border-theme relative overflow-hidden"
        style={{ background: config.gradient }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', config.bg)}>
          <Icon className={cn('w-4 h-4', config.accent)} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-theme">
                {column.title}
              </div>
              <div className="text-xs text-secondary tabular-nums">
                <span className="font-medium text-theme">{formatValue(current, unit)}</span> / {formatValue(target, unit)}
              </div>
            </div>
          </div>

        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-theme-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%`, background: config.bar }}
            />
          </div>
          <div className="text-xs font-semibold text-theme tabular-nums">{percentage}%</div>
        </div>
      </div>

      {/* Cards area */}
      <SortableContext items={playIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'p-4 space-y-3 min-h-[120px] transition-colors bg-theme-secondary',
            isOver && 'bg-card-hover'
          )}
        >
          {sortedPlays.map((play) => (
            <PlayCard key={play.id} play={play} columnColor={column.color} />
          ))}

          <AddPlayButton onClick={handleAddPlay} />
        </div>
      </SortableContext>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-theme bg-surface">
        <div className="flex items-center justify-between text-xs text-secondary">
          <div className="flex items-center gap-2">
          <ArrowUpRight className={cn('w-4 h-4', config.accent)} strokeWidth={1.5} />
            <span>
              <span className="font-semibold text-theme">{activePlays}</span> plays active
            </span>
          </div>
          <div className="text-muted">Drag to reprioritize</div>
        </div>
      </div>
    </section>
  );
}