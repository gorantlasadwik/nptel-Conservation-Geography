import React from 'react';
import { QuizQuestionItem } from '../types/quiz';
import { Flag, CheckCircle2, CircleDot } from 'lucide-react';

interface QuestionNavigatorProps {
  items: QuizQuestionItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  items,
  currentIndex,
  onSelectIndex,
}) => {
  const answeredCount = items.filter((i) => i.selectedOptionIds.length > 0).length;
  const flaggedCount = items.filter((i) => i.isFlagged).length;
  const unansweredCount = items.length - answeredCount;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
      
      {/* Title & Legend */}
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
          Question Navigator
        </h3>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{answeredCount} Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{flaggedCount} Flag</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span>{unansweredCount} Left</span>
          </div>
        </div>
      </div>

      {/* Grid of Question Numbers */}
      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
        {items.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = item.selectedOptionIds.length > 0;
          const isFlagged = item.isFlagged;

          let btnClass = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600';

          if (isAnswered) {
            btnClass = 'bg-emerald-500 text-white font-semibold shadow-xs';
          }

          if (isCurrent) {
            btnClass += ' ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900';
          }

          return (
            <button
              key={item.question.id}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer border ${btnClass}`}
              title={`Question ${idx + 1} (Week ${item.question.week})${isFlagged ? ' - Flagged' : ''}`}
            >
              <span>{idx + 1}</span>

              {/* Small Flag Indicator pip */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-white dark:border-zinc-900 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
        Click any number to jump directly
      </div>
    </div>
  );
};
