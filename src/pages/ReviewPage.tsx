import React, { useState } from 'react';
import { QuizResult, QuestionReviewItem } from '../types/quiz';
import { CheckCircle2, XCircle, AlertCircle, Flag, ArrowLeft, RotateCcw, Filter, BookOpen, Star } from 'lucide-react';
import { getFavoriteQuestionIds, toggleFavoriteQuestion } from '../utils/storage';

interface ReviewPageProps {
  result: QuizResult;
  onBackToResults: () => void;
  onRetryIncorrect: () => void;
  onReturnHome: () => void;
}

type FilterType = 'all' | 'correct' | 'incorrect' | 'unanswered' | 'flagged';

export const ReviewPage: React.FC<ReviewPageProps> = ({
  result,
  onBackToResults,
  onRetryIncorrect,
  onReturnHome,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [favorites, setFavorites] = useState<string[]>(getFavoriteQuestionIds);
  const { questions, incorrectCount } = result;

  const handleToggleFavorite = (questionId: string) => {
    toggleFavoriteQuestion(questionId);
    setFavorites(getFavoriteQuestionIds());
  };

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === 'correct') return q.isCorrect;
    if (activeFilter === 'incorrect') return !q.isCorrect && !q.isUnanswered;
    if (activeFilter === 'unanswered') return q.isUnanswered;
    if (activeFilter === 'flagged') return q.isFlagged;
    return true; // 'all'
  });

  const counts = {
    all: questions.length,
    correct: questions.filter((q) => q.isCorrect).length,
    incorrect: questions.filter((q) => !q.isCorrect && !q.isUnanswered).length,
    unanswered: questions.filter((q) => q.isUnanswered).length,
    flagged: questions.filter((q) => q.isFlagged).length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <button
            onClick={onBackToResults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Result Overview
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Detailed Solution Review
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Official NPTEL answer keys and solution analysis for all questions
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {incorrectCount > 0 && (
            <button
              onClick={onRetryIncorrect}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Incorrect ({incorrectCount})</span>
            </button>
          )}

          <button
            onClick={onReturnHome}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          All Questions ({counts.all})
        </button>

        <button
          onClick={() => setActiveFilter('correct')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeFilter === 'correct'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Correct ({counts.correct})
        </button>

        <button
          onClick={() => setActiveFilter('incorrect')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeFilter === 'incorrect'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Incorrect ({counts.incorrect})
        </button>

        <button
          onClick={() => setActiveFilter('unanswered')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeFilter === 'unanswered'
              ? 'bg-zinc-700 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Unanswered ({counts.unanswered})
        </button>

        {counts.flagged > 0 && (
          <button
            onClick={() => setActiveFilter('flagged')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'flagged'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            Flagged ({counts.flagged})
          </button>
        )}
      </div>

      {/* Questions Review List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No questions found for the selected filter.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            return (
              <div
                key={q.questionId}
                className={`bg-white dark:bg-zinc-900 border rounded-2xl p-6 sm:p-7 shadow-xs transition-all ${
                  q.isCorrect
                    ? 'border-emerald-200/80 dark:border-emerald-900/60'
                    : q.isUnanswered
                    ? 'border-zinc-200 dark:border-zinc-800'
                    : 'border-rose-200/80 dark:border-rose-900/60'
                }`}
              >
                {/* Header & Badges */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {q.week === 99 ? 'Week ∞' : `Week ${q.week}`} • Q{q.originalQuestionNumber}
                    </span>

                    {q.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Correct
                      </span>
                    ) : q.isUnanswered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Unanswered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Incorrect
                      </span>
                    )}

                    {q.isFlagged && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                        <Flag className="w-3 h-3 fill-current" />
                        Flagged
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(q.questionId)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        favorites.includes(q.questionId)
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-xs'
                          : 'text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-transparent'
                      }`}
                      title={favorites.includes(q.questionId) ? 'Saved to Favorites' : 'Add to Favorites for targeted revision'}
                    >
                      <Star className={`w-3.5 h-3.5 ${favorites.includes(q.questionId) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{favorites.includes(q.questionId) ? 'Saved' : 'Save Fav'}</span>
                    </button>
                    <span className="text-[11px] text-zinc-400">
                      Source: {q.source}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-5 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options List with status annotations */}
                <div className="space-y-2.5 mb-5">
                  {q.options.map((opt) => {
                    const isSelected = q.selectedOptionIds.includes(opt.id);
                    const isCorrect = q.correctOptionIds.includes(opt.id);

                    let cardClass = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300';
                    let letterClass = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';

                    if (isCorrect) {
                      cardClass = 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium';
                      letterClass = 'bg-emerald-600 text-white';
                    } else if (isSelected && !isCorrect) {
                      cardClass = 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through';
                      letterClass = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl border text-sm transition-colors ${cardClass}`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${letterClass}`}>
                          {opt.id}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
                          <span className="pt-0.5 text-zinc-800 dark:text-zinc-200 leading-normal text-xs sm:text-sm">
                            {opt.text}
                          </span>
                          {isCorrect && (
                            <span className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Correct Answer</span>
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 shadow-xs">
                              <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              <span>Your Choice</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Solution note */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Solution Note: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
