'use client';

import { useState, useRef } from 'react';
import { LayoutGrid, Target, Zap, MessageSquare, PanelLeftClose, PanelLeft, Plus, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/useBoardStore';
import { generateId } from '@/lib/id';
import { ColumnColor, SidebarView } from '@/lib/types';
import { COLUMN_COLORS } from '@/lib/constants';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems: { name: string; icon: typeof LayoutGrid; view: SidebarView }[] = [
  { name: 'Dashboard', icon: LayoutGrid, view: 'dashboard' },
  { name: 'Goals', icon: Target, view: 'goals' },
  { name: 'Plays', icon: Zap, view: 'plays' },
];

export function Sidebar({ className, collapsed = false, onToggle }: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const clickCountRef = useRef(0);
  const lastClickRef = useRef(0);

  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = useBoardStore((s) => s.setActiveWorkspace);
  const addWorkspace = useBoardStore((s) => s.addWorkspace);
  const updateWorkspace = useBoardStore((s) => s.updateWorkspace);
  const deleteWorkspace = useBoardStore((s) => s.deleteWorkspace);
  const sidebarView = useBoardStore((s) => s.sidebarView);
  const setSidebarView = useBoardStore((s) => s.setSidebarView);
  const theme = useBoardStore((s) => s.theme);
  const isDark = theme === 'dark';

  const handleAddWorkspace = () => {
    const colors: ColumnColor[] = ['emerald', 'blue', 'orange', 'violet'];
    const newWorkspace = {
      id: generateId.workspace(),
      title: 'New Workspace',
      color: colors[workspaces.length % colors.length],
      boardName: 'New Board',
      dateRange: '2024',
    };
    addWorkspace(newWorkspace);
    setActiveWorkspace(newWorkspace.id);
  };

  const handleNavClick = (view: SidebarView) => {
    setSidebarView(view);
  };

  const handleStartEdit = (ws: { id: string; title: string }) => {
    setEditingId(ws.id);
    setEditValue(ws.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      updateWorkspace(editingId, { title: editValue.trim(), boardName: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const handleFeedbackClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 400) {
      clickCountRef.current++;
    } else {
      clickCountRef.current = 1;
    }
    lastClickRef.current = now;

    if (clickCountRef.current >= 3) {
      setIsAdmin(true);
      setFeedbackOpen(true);
      clickCountRef.current = 0;
    } else {
      setTimeout(() => {
        if (clickCountRef.current > 0 && clickCountRef.current < 3) {
          setIsAdmin(false);
          setFeedbackOpen(true);
          clickCountRef.current = 0;
        }
      }, 400);
    }
  };

  return (
    <aside
      className={cn(
        'bg-surface border-r border-theme flex flex-col shrink-0 z-20 transition-all duration-300 relative',
        collapsed ? 'w-[60px]' : 'w-[240px]',
        className
      )}
    >
      {isDark && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ 
            background: 'linear-gradient(180deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
            opacity: 0.6,
          }}
        />
      )}

      <div className="h-16 flex items-center justify-between px-3 border-b border-theme">
      <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          {!collapsed && <span className="text-base font-bold tracking-tight text-theme">Compound</span>}
        </div>
        <button
          onClick={onToggle}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-card-hover transition text-secondary hover:text-theme"
        >
          {collapsed ? <PanelLeft className="w-4 h-4" strokeWidth={1.5} /> : <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = sidebarView === item.view;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.view)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative overflow-hidden border',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-card-hover text-theme border-theme shadow-sm'
                    : 'text-secondary hover:text-theme hover:bg-card-hover border-transparent'
                )}
                title={collapsed ? item.name : undefined}
              >
                {isActive && isDark && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #10B981 0%, #3B82F6 100%)' }}
                  />
                )}
                <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#10B981]' : '')} strokeWidth={1.5} />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-[11px] font-semibold text-muted uppercase tracking-wider">Workspaces</h3>
              <button
                onClick={handleAddWorkspace}
                className="p-1 rounded hover:bg-card-hover text-muted hover:text-theme transition"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="space-y-1">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group',
                    activeWorkspaceId === ws.id
                      ? 'bg-card-hover text-theme'
                      : 'text-secondary hover:text-theme hover:bg-card-hover'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full shrink-0', COLUMN_COLORS[ws.color].dot)} />
                  
                  {editingId === ws.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="flex-1 text-sm font-medium bg-theme-secondary border border-theme rounded px-2 py-0.5 text-theme focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 rounded hover:bg-emerald-500/20 text-emerald-500 transition"
                      >
                        <Check className="w-3 h-3" strokeWidth={2} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 rounded hover:bg-red-500/20 text-red-500 transition"
                      >
                        <X className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveWorkspace(ws.id)}
                        onDoubleClick={() => handleStartEdit(ws)}
                        onKeyDown={(e) => e.key === 'Enter' && setActiveWorkspace(ws.id)}
                        className="text-sm font-medium flex-1 text-left truncate cursor-pointer"
                        title="Double-click to rename"
                      >
                        {ws.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkspace(ws.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-theme-secondary text-muted hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {collapsed && (
          <nav className="space-y-1">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspace(ws.id)}
                className={cn(
                  'w-full flex items-center justify-center py-2 rounded-lg transition-all',
                  activeWorkspaceId === ws.id ? 'bg-card-hover' : 'hover:bg-card-hover'
                )}
                title={ws.title}
              >
                <div className={cn('w-2.5 h-2.5 rounded-full', COLUMN_COLORS[ws.color].dot)} />
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="p-3 border-t border-theme">
        <button
          onClick={handleFeedbackClick}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-theme hover:bg-card-hover text-secondary hover:text-theme transition-all text-xs font-medium',
            collapsed && 'px-2'
          )}
          title={collapsed ? 'Feedback' : undefined}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          {!collapsed && 'Feedback'}
        </button>
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        isAdmin={isAdmin}
      />
    </aside>
  );
}