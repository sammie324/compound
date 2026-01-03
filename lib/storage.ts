import { BoardState } from './types';
import { STORAGE_KEY } from './constants';

// Save board state to localStorage
export function saveToStorage(state: Partial<BoardState>): void {
  try {
    const data = {
      ...state,
      lastSaved: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Load board state from localStorage
export function loadFromStorage(): Partial<BoardState> | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

// Clear board state from localStorage
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

// Export board data as JSON file
export function exportBoard(state: BoardState): void {
  const data = {
    ...state,
    exportedAt: Date.now(),
    version: 1,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `compound-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// Import board data from JSON file
export function importBoard(file: File): Promise<Partial<BoardState>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}