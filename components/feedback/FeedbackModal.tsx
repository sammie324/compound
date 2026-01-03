'use client';

import { useState, useEffect } from 'react';
import { X, Send, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/id';

interface Feedback {
  id: string;
  type: 'feature' | 'bug' | 'pricing' | 'other';
  message: string;
  email?: string;
  createdAt: number;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const STORAGE_KEY = 'compound-feedback';

const typeOptions = [
  { value: 'feature', label: 'Feature Request', emoji: '💡' },
  { value: 'bug', label: 'Bug Report', emoji: '🐛' },
  { value: 'pricing', label: 'Would Pay For', emoji: '💰' },
  { value: 'other', label: 'Other', emoji: '💬' },
];

function loadFeedback(): Feedback[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFeedback(feedback: Feedback[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
}

export function FeedbackModal({ isOpen, onClose, isAdmin = false }: FeedbackModalProps) {
  const [type, setType] = useState<Feedback['type']>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    if (isAdmin && isOpen) {
      setFeedbackList(loadFeedback());
    }
  }, [isAdmin, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newFeedback: Feedback = {
      id: generateId.task(),
      type,
      message: message.trim(),
      email: email.trim() || undefined,
      createdAt: Date.now(),
    };

    const existing = loadFeedback();
    saveFeedback([newFeedback, ...existing]);

    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setEmail('');
      setType('feature');
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const handleDelete = (id: string) => {
    const updated = feedbackList.filter((f) => f.id !== id);
    saveFeedback(updated);
    setFeedbackList(updated);
  };

  const handleClearAll = () => {
    saveFeedback([]);
    setFeedbackList([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card border border-theme rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-theme">
              {isAdmin ? 'Feedback (Admin)' : 'Send Feedback'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-card-hover flex items-center justify-center"
          >
            <X className="w-4 h-4 text-secondary" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-auto">
          {isAdmin ? (
            // Admin View
            <div className="space-y-3">
              {feedbackList.length === 0 ? (
                <p className="text-secondary text-sm text-center py-8">No feedback yet</p>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-secondary">{feedbackList.length} submissions</span>
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  {feedbackList.map((fb) => (
                    <div key={fb.id} className="rounded-lg border border-theme bg-theme-secondary p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-card text-secondary">
                          {typeOptions.find((t) => t.value === fb.type)?.emoji}{' '}
                          {typeOptions.find((t) => t.value === fb.type)?.label}
                        </span>
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="p-1 rounded hover:bg-card text-muted hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm text-theme mt-2">{fb.message}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted">
                        <span>{fb.email || 'No email'}</span>
                        <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : submitted ? (
            // Success State
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-theme font-medium">Thanks for your feedback!</p>
              <p className="text-secondary text-sm mt-1">We'll review it soon.</p>
            </div>
          ) : (
            // Submit Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value as Feedback['type'])}
                      className={cn(
                        'px-3 py-2 rounded-lg border text-sm font-medium transition text-left',
                        type === opt.value
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                          : 'border-theme bg-card text-theme hover:bg-card-hover'
                      )}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder={
                    type === 'pricing'
                      ? "What feature would you pay for? How much?"
                      : "Share your thoughts..."
                  }
                  className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                  autoFocus
                />
              </div>

              {/* Email (optional) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Email <span className="text-muted">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-theme bg-theme-secondary px-3 py-2 text-sm text-theme placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                Send Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}