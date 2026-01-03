import { PlayType, PlayStatus, ColumnColor } from './types';

// Play type configurations
export const PLAY_TYPES: Record<PlayType, { label: string; color: string; icon: string }> = {
  BUILD: { label: 'Build', color: 'violet', icon: '🔨' },
  BUY: { label: 'Buy', color: 'green', icon: '💰' },
  SELL: { label: 'Sell', color: 'orange', icon: '📈' },
  SAVE: { label: 'Save', color: 'blue', icon: '🏦' },
  EARN: { label: 'Earn', color: 'emerald', icon: '💵' },
  TRAIN: { label: 'Train', color: 'cyan', icon: '📚' },
  CUSTOM: { label: 'Custom', color: 'zinc', icon: '⚡' },
};

// Play status configurations
export const PLAY_STATUS: Record<PlayStatus, { label: string; color: string }> = {
  PLANNED: { label: 'Planned', color: 'zinc' },
  ACTIVE: { label: 'Active', color: 'yellow' },
  DONE: { label: 'Done', color: 'emerald' },
  KILLED: { label: 'Killed', color: 'red' },
};

// Column color configurations for UI (all 20 colors)
export const COLUMN_COLORS: Record<ColumnColor, {
  dot: string;
  glow: string;
  accent: string;
  bg: string;
  border: string;
  bar: string;
  gradient: string;
}> = {
  emerald: {
    dot: 'bg-emerald-500',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    bar: '#10B981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.08) 50%, transparent 100%)',
  },
  blue: {
    dot: 'bg-blue-500',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    accent: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    bar: '#3B82F6',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.08) 50%, transparent 100%)',
  },
  violet: {
    dot: 'bg-violet-500',
    glow: 'shadow-[0_0_8px_rgba(139,92,246,0.5)]',
    accent: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    bar: '#8B5CF6',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.08) 50%, transparent 100%)',
  },
  orange: {
    dot: 'bg-orange-500',
    glow: 'shadow-[0_0_8px_rgba(249,115,22,0.5)]',
    accent: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    bar: '#F97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.08) 50%, transparent 100%)',
  },
  rose: {
    dot: 'bg-rose-500',
    glow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    accent: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    bar: '#F43F5E',
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.08) 50%, transparent 100%)',
  },
  pink: {
    dot: 'bg-pink-500',
    glow: 'shadow-[0_0_8px_rgba(236,72,153,0.5)]',
    accent: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    bar: '#EC4899',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.25) 0%, rgba(236,72,153,0.08) 50%, transparent 100%)',
  },
  fuchsia: {
    dot: 'bg-fuchsia-500',
    glow: 'shadow-[0_0_8px_rgba(217,70,239,0.5)]',
    accent: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    bar: '#D946EF',
    gradient: 'linear-gradient(135deg, rgba(217,70,239,0.25) 0%, rgba(217,70,239,0.08) 50%, transparent 100%)',
  },
  purple: {
    dot: 'bg-purple-500',
    glow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    bar: '#A855F7',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.08) 50%, transparent 100%)',
  },
  indigo: {
    dot: 'bg-indigo-500',
    glow: 'shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    accent: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    bar: '#6366F1',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0.08) 50%, transparent 100%)',
  },
  cyan: {
    dot: 'bg-cyan-500',
    glow: 'shadow-[0_0_8px_rgba(6,182,212,0.5)]',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    bar: '#06B6D4',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(6,182,212,0.08) 50%, transparent 100%)',
  },
  teal: {
    dot: 'bg-teal-500',
    glow: 'shadow-[0_0_8px_rgba(20,184,166,0.5)]',
    accent: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    bar: '#14B8A6',
    gradient: 'linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0.08) 50%, transparent 100%)',
  },
  green: {
    dot: 'bg-green-500',
    glow: 'shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    accent: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    bar: '#22C55E',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.08) 50%, transparent 100%)',
  },
  lime: {
    dot: 'bg-lime-500',
    glow: 'shadow-[0_0_8px_rgba(132,204,22,0.5)]',
    accent: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
    bar: '#84CC16',
    gradient: 'linear-gradient(135deg, rgba(132,204,22,0.25) 0%, rgba(132,204,22,0.08) 50%, transparent 100%)',
  },
  yellow: {
    dot: 'bg-yellow-500',
    glow: 'shadow-[0_0_8px_rgba(234,179,8,0.5)]',
    accent: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    bar: '#EAB308',
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.25) 0%, rgba(234,179,8,0.08) 50%, transparent 100%)',
  },
  amber: {
    dot: 'bg-amber-500',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    bar: '#F59E0B',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.08) 50%, transparent 100%)',
  },
  red: {
    dot: 'bg-red-500',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    accent: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    bar: '#EF4444',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.08) 50%, transparent 100%)',
  },
  slate: {
    dot: 'bg-slate-500',
    glow: 'shadow-[0_0_8px_rgba(100,116,139,0.5)]',
    accent: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    bar: '#64748B',
    gradient: 'linear-gradient(135deg, rgba(100,116,139,0.25) 0%, rgba(100,116,139,0.08) 50%, transparent 100%)',
  },
  zinc: {
    dot: 'bg-zinc-500',
    glow: 'shadow-[0_0_8px_rgba(113,113,122,0.5)]',
    accent: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/20',
    bar: '#71717A',
    gradient: 'linear-gradient(135deg, rgba(113,113,122,0.25) 0%, rgba(113,113,122,0.08) 50%, transparent 100%)',
  },
  stone: {
    dot: 'bg-stone-500',
    glow: 'shadow-[0_0_8px_rgba(120,113,108,0.5)]',
    accent: 'text-stone-400',
    bg: 'bg-stone-500/10',
    border: 'border-stone-500/20',
    bar: '#78716C',
    gradient: 'linear-gradient(135deg, rgba(120,113,108,0.25) 0%, rgba(120,113,108,0.08) 50%, transparent 100%)',
  },
  sky: {
    dot: 'bg-sky-500',
    glow: 'shadow-[0_0_8px_rgba(14,165,233,0.5)]',
    accent: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    bar: '#0EA5E9',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(14,165,233,0.08) 50%, transparent 100%)',
  },
};

// Stat card gradient configurations
export const STAT_GRADIENTS: Record<ColumnColor, string> = {
  emerald: 'from-emerald-500 to-emerald-900',
  blue: 'from-blue-500 to-blue-900',
  violet: 'from-violet-500 to-violet-900',
  orange: 'from-orange-500 to-orange-900',
  rose: 'from-rose-500 to-rose-900',
  pink: 'from-pink-500 to-pink-900',
  fuchsia: 'from-fuchsia-500 to-fuchsia-900',
  purple: 'from-purple-500 to-purple-900',
  indigo: 'from-indigo-500 to-indigo-900',
  cyan: 'from-cyan-500 to-cyan-900',
  teal: 'from-teal-500 to-teal-900',
  green: 'from-green-500 to-green-900',
  lime: 'from-lime-500 to-lime-900',
  yellow: 'from-yellow-500 to-yellow-900',
  amber: 'from-amber-500 to-amber-900',
  red: 'from-red-500 to-red-900',
  slate: 'from-slate-500 to-slate-900',
  zinc: 'from-zinc-500 to-zinc-900',
  stone: 'from-stone-500 to-stone-900',
  sky: 'from-sky-500 to-sky-900',
};

// LocalStorage key
export const STORAGE_KEY = 'compound-board-v1';

// Default workspace colors
export const WORKSPACE_COLORS: { id: string; title: string; color: ColumnColor }[] = [
  { id: 'business', title: 'Business', color: 'emerald' },
  { id: 'trading', title: 'Trading', color: 'blue' },
  { id: 'health', title: 'Health', color: 'orange' },
  { id: 'learning', title: 'Learning', color: 'violet' },
];

// Default unit options
export const UNIT_OPTIONS = ['$', 'users', '%', 'lbs', 'hours', 'days', 'units'];