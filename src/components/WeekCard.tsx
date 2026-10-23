import React from 'react';
import { WeekMetadata } from '../types/question';
import { WeekProgressSummary } from '../types/quiz';
import { Play, Sliders, CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface WeekCardProps {
  metadata: WeekMetadata;
  progress?: WeekProgressSummary;
  onQuickStart: (week: number) => void;
  onConfigure: (week: number) => void;
  onRapidStart?: (week: number) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  metadata,
  progress,
  onQuickStart,
  onConfigure,
  onRapidStart,
}) => {
  const { week, title, totalQuestions, isLoaded } = metadata;

  const hasAttempt = progress && progress.attemptsCount > 0;
  const accuracy = progress?.lastAccuracy;

  return (
    <div className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
      !isLoaded
        ? 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800/40 opacity-70'
        : hasAttempt
        ? 'bg-white dark:bg-zinc-900/90 border-emerald-300/80 dark:border-emerald-800/70 shadow-xs hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-500/5'
        : 'bg-white dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5'
    }`}>
      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
              Week {week}
            </span>

            {/* Prominent Done Marker */}
            {hasAttempt && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 px-2 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white dark:text-zinc-950 shrink-0" />
                <span>Done</span>
              </span>
            )}
          </div>

          {isLoaded ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {totalQuestions} Questions
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Pending
            </span>
          )}
        </div>

        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* Progress or Score badge */}
        {hasAttempt && (
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              Last Score:
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {progress.lastScore}/{progress.lastTotal} ({accuracy}%)
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
        <button
          onClick={() => onQuickStart(week)}
          disabled={!isLoaded}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Practice Week
        </button>

        {onRapidStart && (
          <button
            onClick={() => onRapidStart(week)}
            disabled={!isLoaded}
            title={`Start Rapid Quiz for Lab ${week}`}
            className="p-2 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            aria-label={`Rapid Quiz for Week ${week}`}
          >
            <Zap className="w-4 h-4 fill-current" />
          </button>
        )}

        <button
          onClick={() => onConfigure(week)}
          disabled={!isLoaded}
          title="Configure Quiz Settings"
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Configure options"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
