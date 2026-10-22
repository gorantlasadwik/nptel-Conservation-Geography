import React, { useState } from 'react';
import { WeekMetadata } from '../types/question';
import { QuizConfig, QuizMode, TimerType } from '../types/quiz';
import { Layers, CheckSquare, Square, Play, ArrowLeft, Clock, Shuffle, ShieldAlert, Sparkles } from 'lucide-react';

interface CustomQuizPageProps {
  weeks: WeekMetadata[];
  onStartQuiz: (config: QuizConfig) => void;
  onBackToHome: () => void;
}

export const CustomQuizPage: React.FC<CustomQuizPageProps> = ({
  weeks,
  onStartQuiz,
  onBackToHome,
}) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([1, 2, 3]);
  const [mode, setMode] = useState<QuizMode>('practice');
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<TimerType>('none');
  const [countdownMinutes, setCountdownMinutes] = useState<number>(20);
  const [questionCountType, setQuestionCountType] = useState<'all' | 'custom'>('all');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(20);

  const availableTotal = weeks
    .filter((w) => selectedWeeks.includes(w.week) && w.isLoaded)
    .reduce((sum, w) => sum + w.totalQuestions, 0);

  const finalQuestionCount = questionCountType === 'all'
    ? availableTotal
    : Math.min(customQuestionCount, availableTotal);

  const toggleWeek = (weekNum: number) => {
    setSelectedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleSelectAll = () => {
    setSelectedWeeks(weeks.filter((w) => w.isLoaded).map((w) => w.week));
  };

  const handleClearSelection = () => {
    setSelectedWeeks([]);
  };

  const handleSelectFirstHalf = () => {
    setSelectedWeeks([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleSelectSecondHalf = () => {
    setSelectedWeeks([7, 8, 9, 10, 11, 12]);
  };

  const handleStart = () => {
    if (selectedWeeks.length === 0 || availableTotal === 0) return;
    onStartQuiz({
      selectedWeeks,
      questionCount: finalQuestionCount,
      shuffleQuestions,
      shuffleOptions,
      mode,
      timerType,
      countdownMinutes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Header */}
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
            Build Custom Quiz
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Select any combination of weeks from Week 0 through Week 12
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={selectedWeeks.length === 0 || availableTotal === 0}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Quiz ({finalQuestionCount} Qs)</span>
        </button>
      </div>

      {/* Week Selection Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Select Practice Weeks
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {selectedWeeks.length} weeks selected • {availableTotal} questions available
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              All Weeks
            </button>
            <button
              onClick={handleSelectFirstHalf}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Weeks 0–6
            </button>
            <button
              onClick={handleSelectSecondHalf}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Weeks 7–12
            </button>
            <button
              onClick={handleClearSelection}
              className="px-2.5 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* 13 Week Checkbox Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {weeks.map((w) => {
            const isSelected = selectedWeeks.includes(w.week);
            return (
              <div
                key={w.week}
                onClick={() => w.isLoaded && toggleWeek(w.week)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                } ${!w.isLoaded ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-400 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Week {w.week}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {w.totalQuestions} Qs
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {w.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mode & Subset Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Mode & Questions
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'practice'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Practice Mode
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('mock');
                if (timerType === 'none') setTimerType('countdown');
              }}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'mock'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Mock Test Mode
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              <span>Question Limit</span>
              <span>{finalQuestionCount} / {availableTotal} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuestionCountType('all')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  questionCountType === 'all'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                All Selected ({availableTotal})
              </button>
              <button
                type="button"
                onClick={() => setQuestionCountType('custom')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  questionCountType === 'custom'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Custom Subset
              </button>
            </div>

            {questionCountType === 'custom' && (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="number"
                  min={1}
                  max={availableTotal}
                  value={customQuestionCount}
                  onChange={(e) => setCustomQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-xs text-zinc-500">questions will be practiced</span>
              </div>
            )}
          </div>
        </div>

        {/* Timer & Shuffle Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Timer & Randomization
          </h2>

          {/* Timer buttons */}
          <div className="grid grid-cols-3 gap-2">
            {(['none', 'stopwatch', 'countdown'] as TimerType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimerType(t)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                  timerType === t
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {t === 'none' ? 'No Timer' : t}
              </button>
            ))}
          </div>

          {timerType === 'countdown' && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Duration (Mins):
              </span>
              <input
                type="number"
                min={1}
                max={180}
                value={countdownMinutes}
                onChange={(e) => setCountdownMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100"
              />
            </div>
          )}

          {/* Shuffling toggles */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                Shuffle Questions
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                Shuffle Option Choices (A-D)
              </span>
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};
