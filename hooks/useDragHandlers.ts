'use client';

import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { useBoardStore } from '@/store/useBoardStore';
import { useState } from 'react';

export function useDragHandlers() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const plays = useBoardStore((state) => state.plays);
  const movePlay = useBoardStore((state) => state.movePlay);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activePlay = plays.find((p) => p.id === active.id);
    if (!activePlay) return;

    const overId = over.id as string;
    
    // Check if dropping over a column
    if (overId.startsWith('col-') || overId.startsWith('column-')) {
      // Will handle in dragEnd
      return;
    }

    // Check if dropping over another play
    const overPlay = plays.find((p) => p.id === overId);
    if (overPlay && activePlay.columnId !== overPlay.columnId) {
      // Moving to a different column
      const overColumnPlays = plays
        .filter((p) => p.columnId === overPlay.columnId)
        .sort((a, b) => a.order - b.order);
      
      const overIndex = overColumnPlays.findIndex((p) => p.id === overId);
      movePlay(activePlay.id, overPlay.columnId, overIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activePlay = plays.find((p) => p.id === active.id);
    if (!activePlay) return;

    const overId = over.id as string;

    // Dropping on a column (empty area)
    if (overId.startsWith('col-') || overId.startsWith('column-')) {
      // Parse column ID - handle both 'col-' and 'column-' prefixes
      const columnId = overId.startsWith('column-') 
        ? overId.replace('column-', '') 
        : overId;
      const columnPlays = plays.filter((p) => p.columnId === columnId);
      movePlay(activePlay.id, columnId, columnPlays.length);
      return;
    }

    // Dropping on another play
    const overPlay = plays.find((p) => p.id === overId);
    if (!overPlay) return;

    if (activePlay.columnId === overPlay.columnId) {
      // Reordering within the same column
      const columnPlays = plays
        .filter((p) => p.columnId === activePlay.columnId)
        .sort((a, b) => a.order - b.order);

      const oldIndex = columnPlays.findIndex((p) => p.id === active.id);
      const newIndex = columnPlays.findIndex((p) => p.id === over.id);

      if (oldIndex !== newIndex) {
        movePlay(activePlay.id, activePlay.columnId, newIndex);
      }
    } else {
      // Moving to a different column
      const overColumnPlays = plays
        .filter((p) => p.columnId === overPlay.columnId)
        .sort((a, b) => a.order - b.order);

      const overIndex = overColumnPlays.findIndex((p) => p.id === overId);
      movePlay(activePlay.id, overPlay.columnId, overIndex);
    }
  };

  const activePlay = activeId ? plays.find((p) => p.id === activeId) : null;

  return {
    activeId,
    activePlay,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}