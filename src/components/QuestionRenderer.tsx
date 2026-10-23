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
  Volume2,
  VolumeX 
} from 'lucide-react';
import { isQuestionAnswerCorrect } from '../utils/scoring';

interface QuestionRendererProps {
  item: QuizQuestionItem;
  currentIndex: number;
  totalQuestions: number;
  mode: QuizMode;
  isSoundOn?: boolean;
  onToggleSound?: () => void;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onCheckAnswer: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  item,
  currentIndex,
  totalQuestions,
  mode,
  isSoundOn,
  onToggleSound,
  onSelectOption,
  onToggleFlag,
  onCheckAnswer,
  onNext,
  onPrev,
}) => {
  const { question, displayOptions, selectedOptionIds, isFlagged, isAnswerChecked } = item;
  const isMultiple = question.type === 'multiple';

  // Evaluate correctness in Practice Mode once checked
  const isChecked = mode === 'practice' && isAnswerChecked;
  const isUserCorrect = isChecked && isQuestionAnswerCorrect(selectedOptionIds, question.correctOptionIds);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
      
      {/* Question Header & Badges */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            Week {question.week} • #{question.originalQuestionNumber}
          </span>
          {isMultiple && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              Multiple Answers
            </span>
          )}
        </div>

        {/* Flag / Mark for Review button */}
        <button
          onClick={onToggleFlag}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isFlagged
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
          title="Mark for review (Shortcut: F)"
        >
          <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
          <span>{isFlagged ? 'Flagged' : 'Mark for Review'}</span>
          <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-200 dark:bg-zinc-700 rounded text-[10px] text-zinc-600 dark:text-zinc-400">
            F
          </kbd>
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-8">
        {displayOptions.map((opt, idx) => {
          const isSelected = selectedOptionIds.includes(opt.id);
          const isCorrectAnswer = question.correctOptionIds.includes(opt.id);

          // In Practice Mode (when checked): highlight correct in green, selected incorrect in red
          let borderStyle = 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900';
          let indicatorStyle = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';

          if (isChecked) {
            if (isCorrectAnswer) {
              borderStyle = 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/60 dark:bg-emerald-950/30';
              indicatorStyle = 'bg-emerald-600 text-white';
            } else if (isSelected && !isCorrectAnswer) {
              borderStyle = 'border-rose-500 dark:border-rose-500/80 bg-rose-50/60 dark:bg-rose-950/30';
              indicatorStyle = 'bg-rose-600 text-white';
            }
          } else if (isSelected) {
            borderStyle = 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-1 ring-indigo-500';
            indicatorStyle = 'bg-indigo-600 text-white';
          }

          // Keyboard letter key display ('A', 'B', 'C', 'D' based on index)
          const displayKey = String.fromCharCode(65 + idx);

          return (
            <div
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={`group flex items-start gap-4 p-4 rounded-xl border text-sm sm:text-base cursor-pointer transition-all ${borderStyle}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelectOption(opt.id);
                }
              }}
            >
              {/* Option Letter Indicator */}
              <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${indicatorStyle}`}>
                {opt.id}
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-0.5 text-zinc-800 dark:text-zinc-200 leading-normal">
                {opt.text}
              </div>

              {/* Practice feedback icons */}
              {isChecked && isCorrectAnswer && (
                <div className="shrink-0 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {isChecked && isSelected && !isCorrectAnswer && (
                <div className="shrink-0 text-rose-600 dark:text-rose-400">
                  <XCircle className="w-5 h-5" />
                </div>
              )}

              {/* Shortcut hint on hover */}
              <span className="hidden sm:inline-block text-[11px] text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
                Key {displayKey}
              </span>
            </div>
          );
        })}
      </div>

      {/* Practice Mode Feedback Banner */}
      {isChecked && (
        <div className={`p-4 sm:p-5 rounded-xl border mb-8 transition-all ${
          isUserCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-start gap-3">
            {isUserCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-sm">
              <p className="font-semibold">
                {isUserCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                Correct Option: <span className="font-bold underline">{question.correctOptionIds.join(', ')}</span>
              </p>
              {question.explanation && (
                <div className="mt-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">Solution Note: </span>
                  {question.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
          <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-500">
            ←
          </kbd>
        </button>

        {/* Center: Check Answer button & Sound Mute Toggle in Practice Mode */}
        {mode === 'practice' && (
          <div className="w-full sm:w-auto flex items-center justify-center gap-2">
            <button
              onClick={onCheckAnswer}
              disabled={selectedOptionIds.length === 0}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isChecked
                  ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <Eye className="w-4 h-4" />
              <span>{isChecked ? 'Re-check Answer' : 'Check Answer'}</span>
            </button>

            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-95 shrink-0 ${
                  isSoundOn
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                    : 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                title={isSoundOn ? 'Sound effects enabled (Click to mute)' : 'Sound effects muted (Click to unmute)'}
                aria-label="Toggle sound effects in quiz"
              >
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}

        {/* Next / Finish Button */}
        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-semibold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
          <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded text-[10px]">
            →
          </kbd>
        </button>
      </div>

    </div>
  );
};
