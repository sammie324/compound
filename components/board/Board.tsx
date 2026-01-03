'use client';

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '@/store/useBoardStore';
import { useSortedColumns } from '@/store/selectors';
import { GoalColumn } from './GoalColumn';
import { PlayCard } from './PlayCard';
import { useDragHandlers } from '@/hooks/useDragHandlers';

export function Board() {
  const columns = useSortedColumns();
  const plays = useBoardStore((state) => state.plays);

  const { activeId, activePlay, handleDragStart, handleDragOver, handleDragEnd } =
    useDragHandlers();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-secondary text-sm mb-2">No columns yet</p>
          <p className="text-muted text-xs">Add a column to get started</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnPlays = plays.filter((p) => p.columnId === column.id);
            return <GoalColumn key={column.id} column={column} plays={columnPlays} />;
          })}
        </div>

        <DragOverlay>
          {activePlay ? (
            <PlayCard
              play={activePlay}
              columnColor={columns.find((c) => c.id === activePlay.columnId)?.color}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}