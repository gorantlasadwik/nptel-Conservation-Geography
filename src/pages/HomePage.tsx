import React from 'react';
import type { WeekMetadata } from '../types/question';
import type { QuizResult, WeekProgressSummary } from '../types/quiz';
import { WeekCard } from '../components/WeekCard';
import { COURSE_INFO } from '../utils/questionsLoader';
import { formatDuration } from '../utils/scoring';
import { BookOpen, Layers, Zap, Award, Sparkles, ShieldAlert, ArrowRight, GraduationCap, History } from 'lucide-react';

interface HomePageProps {
  weeks: WeekMetadata[];
  totalQuestions: number;
  recentResults: QuizResult[];
  weekSummaries: Record<number, WeekProgressSummary>;
  onStartSingleWeek: (week: number) => void;
  onConfigureWeek: (week: number) => void;
  onOpenCustomQuiz: () => void;
  onStartAllWeeks: () => void;
  onStartMockExam: () => void;
  onOpenLearn: () => void;
  onReviewResult: (result: QuizResult) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  weeks,
  totalQuestions,
  recentResults,
  weekSummaries,
  onStartSingleWeek,
  onConfigureWeek,
  onOpenCustomQuiz,
  onStartAllWeeks,
  onStartMockExam,
  onOpenLearn,
  onReviewResult,
}) => {
  const loadedWeeksCount = weeks.filter((w) => w.isLoaded).length;
  const totalCompletedSessions = recentResults.length;

  const averageAccuracy = totalCompletedSessions > 0
    ? Math.round((recentResults.reduce((sum, r) => sum + r.accuracy, 0) / totalCompletedSessions) * 10) / 10
    : 0;

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 sm:p-8 lg:p-10 shadow-sm">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">NPTEL Conservation Geography (Week 0–12)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-3">
            Practice smarter. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              Prepare better.
            </span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-2xl">
            A high-performance practice application for NPTEL assignments. Master questions from Week 0 through Week 12 with authentic solutions, custom multi-week quizzes, and timed mock test simulations.
          </p>

          {/* Quick Action Buttons (Responsive Grid on Mobile) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenLearn}
              className="col-span-2 sm:col-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Direct Learn Mode</span>
            </button>

            <button
              type="button"
              onClick={() => onStartSingleWeek(1)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-400 shrink-0" />
              <span>Week 1</span>
            </button>

            <button
              type="button"
              onClick={onOpenCustomQuiz}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Custom</span>
            </button>

            <button
              type="button"
              onClick={onStartAllWeeks}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>All ({totalQuestions})</span>
            </button>

            <button
              type="button"
              onClick={onStartMockExam}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Mock Test</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metrics Row (Clean 2x2 Grid on Mobile, 4 Cols on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 sm:mt-8 sm:pt-6 border-t border-zinc-200/80 dark:border-zinc-800">
          <div className="p-2 sm:p-0">
            <div className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {loadedWeeksCount} / {weeks.length}
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Available Weeks
            </div>
          </div>

          <div className="p-2 sm:p-0">
            <div className="text-xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {totalQuestions}
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Verified Questions
            </div>
          </div>

          <div className="p-2 sm:p-0">
            <div className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {totalCompletedSessions}
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Completed
            </div>
          </div>

          <div className="p-2 sm:p-0">
            <div className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {totalCompletedSessions > 0 ? `${averageAccuracy}%` : '—'}
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Avg. Accuracy
            </div>
          </div>
        </div>

      </section>

      {/* Recent Quiz Results (if any) */}
      {recentResults.length > 0 && (
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Recent Practice Sessions
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              Last {Math.min(recentResults.length, 3)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {recentResults.slice(0, 3).map((res) => (
              <div
                key={res.id}
                onClick={() => onReviewResult(res)}
                className="group flex flex-col justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {res.config.selectedWeeks.length === 1
                        ? `Week ${res.config.selectedWeeks[0]}`
                        : `${res.config.selectedWeeks.length} Weeks`}
                    </span>
                    <span className="text-[11px]">{res.completedAt.split(',')[0]}</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {res.score}/{res.totalQuestions}
                    </span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                      res.accuracy >= 75
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : res.accuracy >= 50
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    }`}>
                      {res.accuracy}%
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Time: {formatDuration(res.timeTakenSeconds)} • Mode: {res.config.mode}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  <span>Review Answers</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 13 Weeks Responsive Grid */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Course Assignments (Weeks 0–12)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Select any week to practice questions or configure custom settings.
            </p>
          </div>
          <div className="text-xs text-zinc-500">
            {totalQuestions} Questions Available
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {weeks.map((w) => (
            <WeekCard
              key={w.week}
              metadata={w}
              progress={weekSummaries[w.week]}
              onQuickStart={onStartSingleWeek}
              onConfigure={onConfigureWeek}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
