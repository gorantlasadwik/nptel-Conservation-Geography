import React from 'react';
import { QuizResult } from '../types/quiz';
import { formatDuration } from '../utils/scoring';
import { Award, ArrowLeft, RotateCcw, Eye, Trash2, Calendar, Clock, BarChart2 } from 'lucide-react';

interface HistoryPageProps {
  results: QuizResult[];
  onReviewResult: (result: QuizResult) => void;
  onRetryResult: (result: QuizResult) => void;
  onClearHistory: () => void;
  onBackToHome: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  results,
  onReviewResult,
  onRetryResult,
  onClearHistory,
  onBackToHome,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Practice History & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {results.length} completed sessions recorded locally
          </p>
        </div>

        {results.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center">
          <Award className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No Completed Sessions Yet
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
            Complete a practice week or mock exam to track your performance history and analytics here.
          </p>
          <button
            onClick={onBackToHome}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((res) => {
            const weeksLabel = res.config.selectedWeeks.length === 1
              ? `Week ${res.config.selectedWeeks[0]}`
              : res.config.selectedWeeks.length === 13
              ? 'All 13 Weeks'
              : `${res.config.selectedWeeks.length} Weeks (${res.config.selectedWeeks.join(', ')})`;

            return (
              <div
                key={res.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {weeksLabel}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {res.config.mode} Mode
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {res.score} / {res.totalQuestions}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      res.accuracy >= 75
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : res.accuracy >= 50
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    }`}>
                      {res.accuracy}% Accuracy
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {res.completedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(res.timeTakenSeconds)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => onReviewResult(res)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review</span>
                  </button>

                  <button
                    onClick={() => onRetryResult(res)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
