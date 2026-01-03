'use client';

import { useState, useEffect } from 'react';
import { X, Trophy, Check, Flame, Zap, Calendar, ArrowRight, Share2, Copy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Goal } from '@/lib/types';
import { GoalAnalysis, formatCurrency, formatValue } from '@/lib/calculations';
import { Confetti } from './Confetti';

interface GoalCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  analysis: GoalAnalysis | null;
}

export function GoalCompletionModal({ isOpen, onClose, goal, analysis }: GoalCompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setAnimationStage(0);
      
      const timers = [
        setTimeout(() => setAnimationStage(1), 100),
        setTimeout(() => setAnimationStage(2), 300),
        setTimeout(() => setAnimationStage(3), 500),
        setTimeout(() => setAnimationStage(4), 700),
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  if (!isOpen || !goal) return null;

  const unit = goal.unit || '$';
  const targetFormatted = unit === '$' ? formatCurrency(goal.target) : formatValue(goal.target, unit);
  const daysToComplete = Math.ceil((Date.now() - goal.startDate) / (1000 * 60 * 60 * 24));
  const momentumScore = analysis?.momentum.compoundScore || 0;
  const streak = analysis?.momentum.streak || 0;

  const handleCopy = async () => {
    const text = `🏆 Goal Complete: ${goal.title}\n✓ Achieved: ${targetFormatted}\n📅 Days: ${daysToComplete}\n⚡ Momentum: ${momentumScore}/100\n🔥 Streak: ${streak} days\n\nCompound`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Confetti 
        isActive={showConfetti} 
        duration={5000}
        particleCount={200}
        onComplete={() => setShowConfetti(false)}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500",
            animationStage >= 1 ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />

        {/* Ambient background blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Modal */}
        <div
          className={cn(
            "relative w-full max-w-md bg-card rounded-3xl shadow-xl border border-theme overflow-hidden transition-all duration-500",
            animationStage >= 1 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-3"
          )}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500" />

          {/* Floating sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Sparkles className={cn(
              "absolute top-10 left-10 w-5 h-5 text-emerald-400/60 transition-all duration-700",
              animationStage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <Sparkles className={cn(
              "absolute top-20 right-12 w-4 h-4 text-blue-400/60 transition-all duration-700 delay-200",
              animationStage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )} style={{ animation: 'pulse 2.5s ease-in-out infinite 0.5s' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
              <span className="text-xs font-bold tracking-tight text-theme uppercase">Compound</span>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-secondary transition-colors p-1 rounded-full hover:bg-card-hover"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center pt-6 pb-8 px-8 text-center relative">
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-2xl -z-10" />

            {/* Trophy with float animation */}
            <div 
              className={cn(
                "relative mb-6 transition-all duration-700",
                animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ animation: animationStage >= 2 ? 'float 3s ease-in-out infinite' : 'none' }}
            >
              <div className="w-20 h-20 bg-card rounded-2xl border border-theme shadow-xl flex items-center justify-center transform rotate-3">
                <Trophy className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
              </div>
              {/* Checkmark badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-card flex items-center justify-center shadow-lg">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Main text */}
            <h1 className={cn(
              "text-2xl font-medium tracking-tight text-theme mb-1 transition-all duration-500",
              animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Goal{' '}
              <span 
                className="bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }}
              >
                Complete
              </span>
            </h1>
            <p className={cn(
              "text-secondary text-sm transition-all duration-500 delay-100",
              animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              You hit <span className="font-medium text-theme">{targetFormatted}</span> on{' '}
              <span className="font-medium text-theme">{goal.title}</span>
            </p>

            {/* Achievement badge */}
            <div className={cn(
              "mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full transition-all duration-500 delay-200",
              animationStage >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}>
              <Zap className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
              <span className="text-xs font-medium text-emerald-500 tracking-tight">
                {daysToComplete <= 30 ? 'Speed Runner' : daysToComplete <= 90 ? 'Steady Executor' : 'Marathon Finisher'}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={cn(
            "px-6 pb-6 transition-all duration-500 delay-300",
            animationStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-theme-secondary border border-theme hover:border-emerald-500/30 transition-colors">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted mb-1">Duration</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted" strokeWidth={1.5} />
                  <span className="text-base font-medium text-theme tabular-nums">{daysToComplete}d</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-theme-secondary border border-theme hover:border-blue-500/30 transition-colors">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted mb-1">Momentum</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-muted" strokeWidth={1.5} />
                  <span className="text-base font-medium text-theme tabular-nums">{momentumScore}%</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-theme-secondary border border-theme hover:border-orange-500/30 transition-colors">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted mb-1">Streak</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-muted" strokeWidth={1.5} />
                  <span className="text-base font-medium text-theme tabular-nums">{streak}</span>
                </div>
              </div>
            </div>

            {/* Momentum bar */}
            <div className="mt-4 p-3 rounded-xl bg-theme-secondary border border-theme">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-secondary">Momentum Score</span>
                <span className="text-xs font-semibold text-theme">{momentumScore}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-card-hover overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000 ease-out"
                  style={{ width: animationStage >= 4 ? `${momentumScore}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={cn(
            "p-6 pt-2 space-y-3 transition-all duration-500 delay-400",
            animationStage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-lg active:scale-[0.99]"
            >
              Set Next Goal
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 bg-card hover:bg-card-hover text-secondary border border-theme py-2.5 rounded-xl font-medium text-sm transition-colors active:scale-[0.99]"
              >
                <Copy className="w-4 h-4" strokeWidth={1.5} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="flex items-center justify-center gap-2 bg-card hover:bg-card-hover text-secondary border border-theme py-2.5 rounded-xl font-medium text-sm transition-colors active:scale-[0.99]">
                <Share2 className="w-4 h-4" strokeWidth={1.5} />
                Share
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-4 flex items-center justify-between text-[10px] text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Saved to timeline
            </div>
            <span>Private by default</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}