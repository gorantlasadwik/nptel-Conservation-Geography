import React, { useState, useMemo } from 'react';
import type { WeekMetadata, Question } from '../types/question';
import { getQuestionsForWeek, getAllLoadedQuestions } from '../utils/questionsLoader';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Play, 
  Filter, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

interface LearnPageProps {
  weeks: WeekMetadata[];
  onStartWeekPractice: (week: number) => void;
  onBackToHome: () => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  weeks,
  onStartWeekPractice,
  onBackToHome,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch questions for selected week or all weeks
  const questions: Question[] = useMemo(() => {
    if (selectedWeek === 'all') {
      return getAllLoadedQuestions();
    }
    return getQuestionsForWeek(selectedWeek);
  }, [selectedWeek]);

  // Filter questions based on search query
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const qLower = searchQuery.toLowerCase();
    return questions.filter((q) => {
      const matchQuestion = q.question.toLowerCase().includes(qLower);
      const matchOptions = q.options.some((opt) => opt.text.toLowerCase().includes(qLower));
      const matchWeek = `week ${q.week}`.includes(qLower);
      return matchQuestion || matchOptions || matchWeek;
    });
  }, [questions, searchQuery]);

  const currentWeekMeta = typeof selectedWeek === 'number' 
    ? weeks.find((w) => w.week === selectedWeek)
    : null;

  const handleCopyQuestion = (q: Question) => {
    const correctOptions = q.options
      .filter((opt) => q.correctOptionIds.includes(opt.id))
      .map((opt) => `(${opt.id}) ${opt.text}`)
      .join(', ');

    const copyText = `Q: ${q.question}\nCorrect Answer: ${correctOptions}`;
    navigator.clipboard.writeText(copyText);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Direct Learning & Solutions
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <GraduationCap className="w-3.5 h-3.5" />
              Direct Answers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Study official NPTEL verified answers week-by-week for fast exam preparation.
          </p>
        </div>

        {typeof selectedWeek === 'number' && (
          <button
            type="button"
            onClick={() => onStartWeekPractice(selectedWeek)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice Week {selectedWeek}</span>
          </button>
        )}
      </div>

      {/* Week Selector Tabs (Horizontal scrolling on mobile) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedWeek('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedWeek === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All Weeks (130)
          </button>

          {weeks.map((w) => {
            const isSelected = selectedWeek === w.week;
            return (
              <button
                key={w.week}
                type="button"
                onClick={() => setSelectedWeek(w.week)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                Week {w.week}
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Title & Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Title */}
        <div className="min-w-0">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {selectedWeek === 'all' ? 'All Weeks Collection' : `Week ${selectedWeek}`}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {currentWeekMeta ? currentWeekMeta.title : 'Comprehensive Course Question Bank'}
          </h2>
        </div>

        {/* Search & View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              All Options
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Direct Answers
            </button>
          </div>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
            <BookOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No questions found
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Try adjusting your search query or selecting a different week.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isCopied = copiedId === q.id;
            const correctOptionObjs = q.options.filter((opt) =>
              q.correctOptionIds.includes(opt.id)
            );

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      Week {q.week} • Q{q.originalQuestionNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Answer: {q.correctOptionIds.join(', ')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(q)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Copy Question & Answer"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed mb-4">
                  {q.question}
                </h3>

                {/* Display Mode: Compact (Direct Answer only) vs Full (All Options with Correct Highlighted) */}
                {viewMode === 'compact' ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                      Correct Answer
                    </div>
                    {correctOptionObjs.map((opt) => (
                      <div key={opt.id} className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 mb-3">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctOptionIds.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                            isCorrect
                              ? 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/30'
                              : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {opt.id}
                          </div>
                          <div className="flex-1 pt-0.5">{opt.text}</div>
                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Correct Answer</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation note if available */}
                {q.explanation && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Solution Reference: </span>
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
