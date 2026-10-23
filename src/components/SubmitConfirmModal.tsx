import React from 'react';
import { AlertTriangle, CheckCircle, Flag, HelpCircle } from 'lucide-react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  totalQuestions,
  answeredCount,
  unansweredCount,
  flaggedCount,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            unansweredCount > 0
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
          }`}>
            {unansweredCount > 0 ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 id="submit-modal-title" className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Submit Quiz?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Review your progress before final evaluation.
            </p>
          </div>
        </div>

        {/* Summary Breakdown Card */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 mb-5 text-center">
          <div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Answered</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${unansweredCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
              {unansweredCount}
            </div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Unanswered</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{flaggedCount}</div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Flagged</div>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 mb-5">
            <strong>Warning:</strong> You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions will receive 0 marks.
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-center"
          >
            Continue Quiz
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 text-center"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
};
