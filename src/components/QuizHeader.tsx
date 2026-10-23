import React from 'react';
import type { QuizMode, TimerType } from '../types/quiz';
import { 
  Clock, 
  Flag, 
  CheckCircle, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  LayoutGrid, 
  ArrowLeft,
  Volume2,
  VolumeX
} from 'lucide-react';

interface QuizHeaderProps {
  quizTitle: string;
  selectedWeeks: number[];
  mode: QuizMode;
  timerType: TimerType;
  formattedTime: string;
  isTimeExpired: boolean;
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  isSoundOn: boolean;
  onToggleSound: () => void;
  isNavigatorOpenOnMobile: boolean;
  onToggleNavigatorMobile: () => void;
  onSubmitClick: () => void;
  onExitClick: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  quizTitle,
  selectedWeeks,
  mode,
  timerType,
  formattedTime,
  isTimeExpired,
  currentIndex,
  totalQuestions,
  answeredCount,
  flaggedCount,
  isSoundOn,
  onToggleSound,
  isNavigatorOpenOnMobile,
  onToggleNavigatorMobile,
  onSubmitClick,
  onExitClick,
}) => {
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Exit button & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onExitClick}
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors cursor-pointer shrink-0 active:scale-95"
              aria-label="Exit quiz"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
                  {quizTitle}
                </h1>
                {mode === 'practice' ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                    <Sparkles className="w-2.5 h-2.5" />
                    Practice
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shrink-0">
                    <ShieldAlert className="w-2.5 h-2.5" />
                    Mock
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {selectedWeeks.length === 1
                  ? `Week ${selectedWeeks[0]}`
                  : `Weeks: ${selectedWeeks.join(', ')}`}
                <span className="sm:hidden font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                  • Q{currentIndex + 1}/{totalQuestions}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Sound toggle, Mobile Navigator toggle, Timer, Submit */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Answered & Flagged Stats on larger screens */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>{answeredCount}/{totalQuestions} Answered</span>
              </span>
              {flaggedCount > 0 && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Flag className="w-3.5 h-3.5 fill-current" />
                  <span>{flaggedCount} Flagged</span>
                </span>
              )}
            </div>

            {/* Mute / Unmute Sound Button in Quiz Header */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                isSoundOn
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              title={isSoundOn ? 'Sound effects are ON (Click to mute)' : 'Sound effects are MUTED (Click to unmute)'}
              aria-label="Toggle mute audio in quiz"
            >
              {isSoundOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Mute</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Unmute</span>
                </>
              )}
            </button>

            {/* Mobile Navigator Drawer Toggle button */}
            <button
              type="button"
              onClick={onToggleNavigatorMobile}
              className={`lg:hidden inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                isNavigatorOpenOnMobile
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              }`}
              title="Toggle question grid on mobile"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[11px]">{currentIndex + 1}/{totalQuestions}</span>
            </button>

            {/* Timer Badge */}
            {timerType !== 'none' && (
              <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-semibold tracking-wider ${
                isTimeExpired
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800'
              }`}>
                <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>{formattedTime}</span>
              </div>
            )}

            {/* Submit Quiz Action */}
            <button
              type="button"
              onClick={onSubmitClick}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Submit Quiz</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
