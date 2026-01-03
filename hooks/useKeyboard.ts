'use client';

import { useEffect } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { generateId } from '@/lib/id';

export function useKeyboard() {
  const closePanel = useBoardStore((state) => state.closePanel);
  const selectedPlayId = useBoardStore((state) => state.selectedPlayId);
  const updatePlay = useBoardStore((state) => state.updatePlay);
  const deletePlay = useBoardStore((state) => state.deletePlay);
  const getActiveColumns = useBoardStore((state) => state.getActiveColumns);
  const plays = useBoardStore((state) => state.plays);
  const addPlay = useBoardStore((state) => state.addPlay);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Escape - close panel
      if (e.key === 'Escape') {
        closePanel();
        return;
      }

      // N - new play in first column of active workspace
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        const activeColumns = getActiveColumns();
        const firstColumn = activeColumns[0];
        if (firstColumn) {
          const columnPlays = plays.filter((p) => p.columnId === firstColumn.id);
          addPlay({
            id: generateId.play(),
            title: 'New Play',
            type: 'BUILD',
            status: 'PLANNED',
            columnId: firstColumn.id,
            order: columnPlays.length,
            tasks: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
        return;
      }

      // If a play is selected
      if (selectedPlayId) {
        // 1-4 - change status
        if (e.key === '1') {
          updatePlay(selectedPlayId, { status: 'PLANNED' });
        } else if (e.key === '2') {
          updatePlay(selectedPlayId, { status: 'ACTIVE' });
        } else if (e.key === '3') {
          updatePlay(selectedPlayId, { status: 'DONE' });
        } else if (e.key === '4') {
          updatePlay(selectedPlayId, { status: 'KILLED' });
        }

        // Delete - delete play
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (e.metaKey || e.ctrlKey) {
            deletePlay(selectedPlayId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePanel, selectedPlayId, updatePlay, deletePlay, getActiveColumns, plays, addPlay]);
}