import React from 'react';
import { QuizQuestionItem, QuizMode } from '../types/quiz';
import { 
  Flag, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  Eye,
  Send,
  Star
} from 'lucide-react';
import { stopAllAudios } from '../utils/sound';

interface QuestionRendererProps {
  item: QuizQuestionItem;
  currentIndex: number;
  totalQuestions: number;
  mode: QuizMode;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onCheckAnswer: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  item,
  currentIndex,
  totalQuestions,
  mode,
  isFavorite,
  onToggleFavorite,
  onSelectOption,
  onToggleFlag,
  onCheckAnswer,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const { question, displayOptions, selectedOptionIds, isFlagged, isAnswerChecked } = item;
  const isMultiple = question.type === 'multiple';

  // Evaluate correctness in Practice or Rapid Mode once checked
  const isChecked = (mode === 'practice' || mode === 'rapid') && isAnswerChecked;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm transition-all">
      
      {/* Question Header & Badges */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Q {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            Week {question.week} • #{question.originalQuestionNumber}
          </span>
          {isMultiple && (
            <span className="text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              Multiple
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Favorite / Star button for saving mistake questions */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-transparent'
              }`}
              title={isFavorite ? 'Remove from Favorites (Shortcut: S)' : 'Save to Favorites for mistakes revision (Shortcut: S)'}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved Fav' : 'Save Fav'}</span>
              <span className="sm:hidden">{isFavorite ? 'Saved' : 'Fav'}</span>
              <kbd className="hidden sm:inline-block ml-0.5 px-1 py-0.2 bg-zinc-200 dark:bg-zinc-700 rounded text-[10px] text-zinc-600 dark:text-zinc-400">
                S
              </kbd>
            </button>
          )}

          {/* Flag / Mark for Review button (Mobile-friendly label) */}
          <button
            type="button"
            onClick={onToggleFlag}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isFlagged
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent'
            }`}
            title="Mark for review (Shortcut: F)"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-purple-600' : ''}`} />
            <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Mark for Review'}</span>
            <span className="sm:hidden">{isFlagged ? 'Flagged' : 'Flag'}</span>
            <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-200 dark:bg-zinc-700 rounded text-[10px] text-zinc-600 dark:text-zinc-400">
              F
            </kbd>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-5 sm:mb-8">
        <h2 className="text-base sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 leading-snug sm:leading-relaxed tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Options List */}
      <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
        {displayOptions.map((opt, idx) => {
          const isSelected = selectedOptionIds.includes(opt.id);
          const isCorrectAnswer = question.correctOptionIds.includes(opt.id);

          // In Practice / Rapid Mode (when checked): highlight correct in green, selected incorrect in red
          let borderStyle = 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900';
          let indicatorStyle = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';

          if (isChecked) {
            if (isCorrectAnswer) {
              borderStyle = 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500/40';
              indicatorStyle = 'bg-emerald-600 text-white';
            } else if (isSelected && !isCorrectAnswer) {
              borderStyle = 'border-rose-500 dark:border-rose-500/80 bg-rose-50/70 dark:bg-rose-950/40 ring-1 ring-rose-500/40';
              indicatorStyle = 'bg-rose-600 text-white';
            } else {
              borderStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 opacity-70';
            }
          } else if (isSelected) {
            borderStyle = 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-1 ring-indigo-500';
            indicatorStyle = 'bg-indigo-600 text-white';
          }

          // Keyboard letter key display ('A', 'B', 'C', 'D' based on index)
          const displayKey = String.fromCharCode(65 + idx);
          const isLocked = isChecked && mode === 'rapid';

          return (
            <div
              key={opt.id}
              onClick={() => {
                if (!isLocked) {
                  onSelectOption(opt.id);
                }
              }}
              className={`group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border text-sm sm:text-base transition-all ${
                isLocked ? 'cursor-default' : 'cursor-pointer'
              } ${borderStyle}`}
              role="button"
              tabIndex={isLocked ? -1 : 0}
              onKeyDown={(e) => {
                if (!isLocked && (e.key === ' ' || e.key === 'Enter')) {
                  e.preventDefault();
                  onSelectOption(opt.id);
                }
              }}
            >
              {/* Option Letter Indicator */}
              <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-transform ${indicatorStyle}`}>
                {opt.id}
              </div>

              {/* Option Text and Badges */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
                <span className="pt-0.5 text-zinc-800 dark:text-zinc-200 leading-normal text-xs sm:text-sm md:text-base">
                  {opt.text}
                </span>

                {/* Explicit badges when checked */}
                {isChecked && isCorrectAnswer && (
                  <div className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 animate-fade-in shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Correct Answer</span>
                  </div>
                )}
                {isChecked && isSelected && !isCorrectAnswer && (
                  <div className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 animate-fade-in shadow-xs">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Your Choice</span>
                  </div>
                )}
              </div>

              {/* Shortcut hint on hover */}
              {!isChecked && (
                <span className="hidden sm:inline-block text-[11px] text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  Key {displayKey}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3 sm:space-y-0">
        
        {/* On Mobile: Action bar (Check Answer) on top if practice mode */}
        {mode === 'practice' && (
          <div className="sm:hidden w-full flex items-center gap-2">
            <button
              onClick={() => {
                stopAllAudios();
                onCheckAnswer();
              }}
              disabled={selectedOptionIds.length === 0}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                isChecked
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <Eye className="w-4 h-4" />
              <span>{isChecked ? 'Re-check Answer' : 'Check Answer'}</span>
            </button>
          </div>
        )}

        {/* On Mobile in Rapid Mode: Notification prompt */}
        {mode === 'rapid' && (
          <div className="sm:hidden text-center py-1">
            <span className={`text-xs font-bold ${
              isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {isChecked 
                ? (currentIndex === totalQuestions - 1 ? '⚡ Final Question! Ready to Submit 🏁' : '⚡ Answer revealed! Tap Next →')
                : '⚡ Tap any option to reveal & play meme!'}
            </span>
          </div>
        )}

        {/* Desktop single row OR Mobile side-by-side Prev/Next row */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Previous Button */}
          <button
            onClick={() => {
              stopAllAudios();
              onPrev();
            }}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
            <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-500">
              ←
            </kbd>
          </button>

          {/* Desktop Center: Check Answer button in Practice Mode */}
          {mode === 'practice' && (
            <div className="hidden sm:flex items-center justify-center">
              <button
                onClick={() => {
                  stopAllAudios();
                  onCheckAnswer();
                }}
                disabled={selectedOptionIds.length === 0}
                className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Eye className="w-4 h-4" />
                <span>{isChecked ? 'Re-check Answer' : 'Check Answer'}</span>
              </button>
            </div>
          )}

          {/* Desktop Center: Rapid Mode prompt */}
          {mode === 'rapid' && (
            <div className="hidden sm:flex items-center justify-center">
              <span className={`text-xs font-semibold ${
                isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {isChecked 
                  ? (currentIndex === totalQuestions - 1 ? '⚡ Final Question! Ready to Submit 🏁' : '⚡ Answer revealed! Click Next →')
                  : '⚡ Tap any option to reveal & play meme!'}
              </span>
            </div>
          )}

          {/* Next / Submit Quiz Button: Automatically transforms to Submit Quiz on the last question */}
          {currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => {
                stopAllAudios();
                if (onSubmit) {
                  onSubmit();
                } else {
                  onNext();
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/50 cursor-pointer active:scale-95 transition-all"
              title="Finish and submit quiz"
            >
              <Send className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                stopAllAudios();
                onNext();
              }}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 ${
                mode === 'rapid' && isChecked
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-500/50 shadow-md shadow-indigo-600/20'
                  : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
              <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded text-[10px]">
                →
              </kbd>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
