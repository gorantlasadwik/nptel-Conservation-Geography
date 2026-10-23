import React, { useState, useEffect } from 'react';
import { WeekMetadata } from '../types/question';
import { QuizConfig, QuizMode, TimerType } from '../types/quiz';
import { Sliders, CheckSquare, Square, Clock, Shuffle, Sparkles, ShieldAlert, Zap, X } from 'lucide-react';

interface QuizSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  weeks: WeekMetadata[];
  initialSelectedWeeks?: number[];
  initialMode?: QuizMode;
}

export const QuizSetupModal: React.FC<QuizSetupModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  weeks,
  initialSelectedWeeks = [1],
  initialMode = 'practice',
}) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>(initialSelectedWeeks);
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<TimerType>(initialMode === 'mock' ? 'countdown' : 'none');
  const [countdownMinutes, setCountdownMinutes] = useState<number>(15);
  const [questionCountType, setQuestionCountType] = useState<'all' | 'custom'>('all');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(10);

  // Sync state when opened with initial weeks
  useEffect(() => {
    if (initialSelectedWeeks.length > 0) {
      setSelectedWeeks(initialSelectedWeeks);
    }
  }, [initialSelectedWeeks]);

  useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'mock') {
      setTimerType('countdown');
    }
  }, [initialMode]);

  if (!isOpen) return null;

  // Calculate total questions in selected weeks
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

  const handleLaunch = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Quiz Configuration
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Customize weeks, mode, timer, and shuffle options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Section 1: Mode Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              Select Quiz Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setMode('practice')}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'practice'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Practice Mode</span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Standard mode: check answer button, explanations & change responses anytime.
                </p>
              </div>

              <div
                onClick={() => setMode('rapid')}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'rapid'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  <Zap className="w-4 h-4 shrink-0 fill-current" />
                  <span>Rapid Quiz</span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Instant answer reveal & Telugu meme sound the moment you tap any option!
                </p>
              </div>

              <div
                onClick={() => {
                  setMode('mock');
                  if (timerType === 'none') setTimerType('countdown');
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'mock'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Mock Test</span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Exam environment: all answers hidden until final submit, timed simulation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Week Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Select Weeks ({selectedWeeks.length} chosen • {availableTotal} questions)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {weeks.map((w) => {
                const isSelected = selectedWeeks.includes(w.week);
                return (
                  <div
                    key={w.week}
                    onClick={() => w.isLoaded && toggleWeek(w.week)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    } ${!w.isLoaded ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <span className="truncate">Week {w.week} ({w.totalQuestions})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Question Count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              Question Count
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuestionCountType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  questionCountType === 'all'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                All Available ({availableTotal})
              </button>

              <button
                type="button"
                onClick={() => setQuestionCountType('custom')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  questionCountType === 'custom'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                Custom Subset
              </button>

              {questionCountType === 'custom' && (
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="number"
                    min={1}
                    max={availableTotal}
                    value={customQuestionCount}
                    onChange={(e) => setCustomQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-xs text-zinc-500">questions</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Shuffling Options (Independent) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              Randomization (Preserved by default)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Shuffle Question Order
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Randomizes question presentation sequence
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Shuffle Option Choices
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Maps answers accurately to original keys
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 5: Timer Settings */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              Timer Configuration
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['none', 'stopwatch', 'countdown'] as TimerType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimerType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    timerType === t
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
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
                  Duration (Minutes):
                </span>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={countdownMinutes}
                  onChange={(e) => setCountdownMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-xs text-zinc-400">
                  (~{Math.round((countdownMinutes * 60) / (finalQuestionCount || 1))} sec / question)
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Starting with <span className="font-bold text-zinc-800 dark:text-zinc-200">{finalQuestionCount}</span> questions
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLaunch}
              disabled={selectedWeeks.length === 0 || availableTotal === 0}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Start Quiz
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
