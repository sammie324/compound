'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar, Sun, Moon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/useBoardStore';

interface HeaderProps {
  onNewGoal?: () => void;
}

function formatCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Header({ onNewGoal }: HeaderProps) {
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = useBoardStore((s) => s.setActiveWorkspace);
  const getActiveWorkspace = useBoardStore((s) => s.getActiveWorkspace);
  const theme = useBoardStore((s) => s.theme);
  const setTheme = useBoardStore((s) => s.setTheme);

  const activeWorkspace = getActiveWorkspace();
  const boardName = activeWorkspace?.boardName || 'Board';

  // Set current date on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    setCurrentDate(formatCurrentDate());
    
    // Update at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setCurrentDate(formatCurrentDate());
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!boardMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBoardMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [boardMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setBoardMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-theme bg-surface/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6">
        <div className="h-16 flex items-center gap-3">
          {/* Left - Logo & Board Selector */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo - visible on mobile */}
            <div className="lg:hidden relative h-9 w-9 rounded-lg overflow-hidden ring-1 ring-black/5">
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold tracking-tight text-sm">C</span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="lg:hidden font-semibold tracking-tight text-base text-theme">
                Compound
              </div>

              {/* Board selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setBoardMenuOpen(!boardMenuOpen)}
                  className="group flex items-center gap-2 rounded-lg border border-theme bg-card px-3 py-1.5 text-sm text-theme hover:bg-card-hover transition shadow-sm"
                >
                  <span className="truncate max-w-40">{boardName}</span>
                  <ChevronDown className={cn('w-4 h-4 text-secondary transition-transform', boardMenuOpen && 'rotate-180')} strokeWidth={1.5} />
                </button>

                {/* Board dropdown */}
                {boardMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[20rem] rounded-xl border border-theme bg-card shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-subtle">
                      <div className="text-xs font-medium text-secondary">Workspaces</div>
                    </div>
                    <div className="p-2">
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => handleSelectWorkspace(ws.id)}
                          className={cn(
                            'w-full text-left rounded-lg px-3 py-2 hover:bg-card-hover transition',
                            ws.id === activeWorkspaceId && 'bg-card-hover'
                          )}
                        >
                          <div className="text-sm font-medium text-theme">{ws.boardName || ws.title}</div>
                          <div className="text-xs text-secondary">{ws.dateRange || ws.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - Date & Description */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-sm text-secondary">
              <span className="font-medium">{currentDate}</span>
              <span className="text-muted"> · </span>
              <span className="hidden lg:inline">Goal-based execution board</span>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Date pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-theme bg-card px-3 py-1.5 text-sm text-secondary shadow-sm">
              <Calendar className="w-4 h-4 text-secondary" strokeWidth={1.5} />
              <span className="font-medium text-theme">{currentDate}</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-theme bg-card hover:bg-card-hover transition shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-secondary" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4 text-secondary" strokeWidth={1.5} />
              )}
            </button>

            {/* New Goal button */}
            <button
              onClick={onNewGoal}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition shadow-sm"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' }}
            >
              <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
              <span className="hidden sm:inline">New Goal</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}