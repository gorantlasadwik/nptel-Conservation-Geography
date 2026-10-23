import React from 'react';
import type { WeekMetadata } from '../types/question';
import { Zap, X, Layers, ArrowRight, BookOpen } from 'lucide-react';

interface RapidLabSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLab: (week: number | 'all') => void;
  weeks: WeekMetadata[];
  totalQuestions: number;
}

export const RapidLabSelectModal: React.FC<RapidLabSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLab,
  weeks,
  totalQuestions,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl transition-all my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Select Lab / Week</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  ⚡ Rapid Mode
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Which lab assignment do you want to practice with instant Telugu meme reactions?
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Labs List */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          
          {/* Quick Option: All Labs Combined */}
          <button
            type="button"
            onClick={() => onSelectLab('all')}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-amber-400 dark:border-amber-600/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:bg-amber-500/20 text-left transition-all group cursor-pointer active:scale-[0.99] shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    All Labs Combined (Weeks 0–12)
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {totalQuestions} Questions
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  Mega rapid quiz with shuffled questions across all 13 course assignments
                </p>
              </div>
            </div>

            <div className="shrink-0 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Section Divider */}
          <div className="flex items-center gap-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            <span>Or choose an individual lab / week:</span>
            <div className="flex-1 h-px bg-zinc-200 dark:border-zinc-800" />
          </div>

          {/* Individual Labs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {weeks.map((w) => {
              const isDisabled = !w.isLoaded;
              return (
                <button
                  key={w.week}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectLab(w.week)}
                  className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
                    isDisabled
                      ? 'border-zinc-200 dark:border-zinc-800 opacity-40 cursor-not-allowed'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/40 dark:hover:bg-amber-950/20'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                        Lab {w.week}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {w.totalQuestions} Qs
                      </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2">
                      {w.title}
                    </p>
                  </div>

                  <div className="shrink-0 mt-1 text-zinc-300 dark:text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4 flex items-center justify-between shrink-0">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ⚡ Instant reveal & Telugu meme sound per answer
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
