import React, { useEffect, useState } from 'react';
import type { QuizResult } from '../types/quiz';
import { formatDuration } from '../utils/scoring';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  RotateCcw, 
  Eye, 
  ArrowRight, 
  Award, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Play,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getSoundEnabled, 
  setSoundEnabled, 
  getMemeSoundEnabled,
  setMemeSoundEnabled,
  subscribeMemeSoundState,
  subscribeSoundState,
  playQuizResultAudio, 
  playRebelSaabSound,
  playTeluguMemeSound,
  playNoiceSound, 
  playFahhSound,
  stopAllAudios 
} from '../utils/sound';
import type { TeluguMeme } from '../data/teluguMemes';
import { 
  selectTeluguMemeForScore, 
  getRandomMemeFromTier 
} from '../data/teluguMemes';

interface ResultSummaryProps {
  result: QuizResult;
  onReviewAnswers: () => void;
  onRetryIncorrect: () => void;
  onRetrySameQuiz: () => void;
  onReturnHome: () => void;
  onStartNextWeek?: (nextWeek: number) => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  onReviewAnswers,
  onRetryIncorrect,
  onRetrySameQuiz,
  onReturnHome,
  onStartNextWeek,
}) => {
  const {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    score,
    accuracy,
    timeTakenSeconds,
    perWeekStats,
  } = result;

  const [soundOn, setSoundOn] = useState<boolean>(getSoundEnabled);
  const [isMemeSoundOn, setIsMemeSoundOn] = useState<boolean>(getMemeSoundEnabled);

  useEffect(() => {
    const unsubSound = subscribeSoundState((enabled) => setSoundOn(enabled));
    const unsubMeme = subscribeMemeSoundState((enabled) => setIsMemeSoundOn(enabled));
    return () => {
      unsubSound();
      unsubMeme();
    };
  }, []);

  const handleToggleMemeSound = () => {
    const next = !isMemeSoundOn;
    setIsMemeSoundOn(next);
    setMemeSoundEnabled(next);
  };

  const isSingleWeek = result.config?.selectedWeeks?.length === 1;
  const currentWeek = isSingleWeek ? result.config.selectedWeeks[0] : null;
  const nextWeek = currentWeek !== null && currentWeek >= 0 && currentWeek < 12 ? currentWeek + 1 : null;
  
  // Rebel Saab is strictly played ONLY on 100% score
  const isPerfectScore = accuracy >= 100 || (totalQuestions > 0 && correctCount === totalQuestions && accuracy >= 99.5);

  // Telugu meme selected for scores < 100% based on meme knowledge tiers
  const [currentMeme, setCurrentMeme] = useState<TeluguMeme | null>(() => {
    return selectTeluguMemeForScore(accuracy, totalQuestions, correctCount);
  });

  // Trigger celebration confetti and audio on mount, and cleanup on unmount
  useEffect(() => {
    // Only 100% plays Rebel Saab; all other scores play from Telugu meme collection
    playQuizResultAudio(accuracy, totalQuestions, correctCount, currentMeme);

    if (accuracy >= 70) {
      try {
        confetti({
          particleCount: isPerfectScore ? 150 : 80,
          spread: isPerfectScore ? 100 : 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported in test environments
      }
    }

    return () => {
      stopAllAudios();
    };
  }, [accuracy, totalQuestions, correctCount]);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  const handleReplayReaction = () => {
    if (isPerfectScore) {
      playRebelSaabSound();
    } else if (currentMeme) {
      playTeluguMemeSound(currentMeme);
    } else if (accuracy >= 75) {
      playNoiceSound();
    } else {
      playFahhSound();
    }
  };

  const handleShuffleMeme = () => {
    if (currentMeme) {
      const nextMeme = getRandomMemeFromTier(currentMeme.tier, currentMeme.id);
      setCurrentMeme(nextMeme);
      playTeluguMemeSound(nextMeme);
    }
  };

  const handleReviewClick = () => {
    stopAllAudios();
    onReviewAnswers();
  };

  const handleRetryIncorrectClick = () => {
    stopAllAudios();
    onRetryIncorrect();
  };

  const handleRetrySameClick = () => {
    stopAllAudios();
    onRetrySameQuiz();
  };

  const handleReturnHomeClick = () => {
    stopAllAudios();
    onReturnHome();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Hero Score Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-10 shadow-sm text-center relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges: Quiz Completed & Sound Toggle */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Award className="w-4 h-4" />
            Quiz Completed
          </div>

          {/* Sound Controls (Neutral replay + meme toggle + mute toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end">
            <button
              type="button"
              onClick={handleReplayReaction}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer active:scale-95"
              title="Replay audio reaction"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Replay</span>
            </button>

            {/* Telugu Meme Sound / Data Saver Toggle */}
            <button
              type="button"
              onClick={handleToggleMemeSound}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isMemeSoundOn
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
              }`}
              title={
                isMemeSoundOn
                  ? 'Meme audio is ON. Click to activate Data Saver (audio won\'t load).'
                  : 'Data Saver Active: Meme audio files are NOT loaded to save your mobile data.'
              }
            >
              <span className="text-xs">🎭</span>
              <span>{isMemeSoundOn ? 'Memes' : 'Data Saver'}</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                soundOn
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
              }`}
              title={soundOn ? 'Sound effects enabled (Click to mute)' : 'Sound muted (Click to unmute)'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundOn ? 'Mute' : 'Unmute'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
          {isPerfectScore 
            ? '100% Perfect Score!' 
            : accuracy >= 80 
            ? 'Outstanding Performance!' 
            : accuracy >= 50 
            ? 'Good Effort!' 
            : 'Keep Practicing!'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
          Here is the comprehensive evaluation of your session. Review solutions or retry mistakes to master the material.
        </p>

        {/* Big Score / Accuracy Metric */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-2 sm:py-4">
          <div>
            <div className="text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {score} <span className="text-2xl sm:text-3xl font-medium text-zinc-400">/ {totalQuestions}</span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
              Final Score (+1.0 / question)
            </div>
          </div>

          <div className="hidden sm:block w-px h-16 bg-zinc-200 dark:bg-zinc-800" />

          <div>
            <div className={`text-4xl sm:text-6xl font-black tracking-tight ${
              accuracy >= 75 ? 'text-emerald-500' : accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'
            }`}>
              {accuracy}%
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
              Accuracy Rate
            </div>
          </div>

          <div className="hidden sm:block w-px h-16 bg-zinc-200 dark:bg-zinc-800" />

          <div>
            <div className="text-3xl sm:text-4xl font-black text-zinc-800 dark:text-zinc-200 font-mono tracking-tight flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
              {formatDuration(timeTakenSeconds)}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
              Time Taken
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl mx-auto mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5 sm:mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-medium">Correct</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {correctCount}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40">
            <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 mb-0.5 sm:mb-1">
              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-medium">Incorrect</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-700 dark:text-rose-300">
              {incorrectCount}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 mb-0.5 sm:mb-1">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-medium">Unanswered</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-200">
              {unansweredCount}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 mt-6 sm:mt-8">
          {/* Practice Next Week button (e.g. directly continue from Week 0 to Week 1 without homepage) */}
          {nextWeek !== null && onStartNextWeek && (
            <button
              type="button"
              onClick={() => {
                stopAllAudios();
                onStartNextWeek(nextWeek);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/50 active:scale-95 transition-all cursor-pointer"
              title={`Start practicing Week ${nextWeek} directly`}
            >
              <span>Practice Next Week (Week {nextWeek})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleReviewClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Review Answers</span>
          </button>

          {incorrectCount > 0 && (
            <button
              type="button"
              onClick={handleRetryIncorrectClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Incorrect ({incorrectCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRetrySameClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Same</span>
          </button>

          <button
            type="button"
            onClick={handleReturnHomeClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 rounded-xl border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Per-Week Performance Breakdown */}
      {perWeekStats.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Per-Week Performance Breakdown
              </h2>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {perWeekStats.length} Week{perWeekStats.length > 1 ? 's' : ''} evaluated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  <th className="py-3 px-3 sm:px-4">Week</th>
                  <th className="py-3 px-3 sm:px-4">Total</th>
                  <th className="py-3 px-3 sm:px-4 text-emerald-600 dark:text-emerald-400">Correct</th>
                  <th className="py-3 px-3 sm:px-4 text-rose-600 dark:text-rose-400">Incorrect</th>
                  <th className="py-3 px-3 sm:px-4 text-zinc-500">Unanswered</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {perWeekStats.map((stat) => (
                  <tr key={stat.week} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Week {stat.week}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-zinc-600 dark:text-zinc-400">
                      {stat.total}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-medium text-emerald-600 dark:text-emerald-400">
                      {stat.correct}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-medium text-rose-600 dark:text-rose-400">
                      {stat.incorrect}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-zinc-500 dark:text-zinc-400">
                      {stat.unanswered}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs ${
                        stat.accuracy >= 75
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : stat.accuracy >= 50
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      }`}>
                        {stat.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
            <strong>Scoring Policy:</strong> Standard NPTEL evaluation (+1 mark for correct response, 0 for incorrect/unattempted. No negative marking).
          </div>
        </div>
      )}

    </div>
  );
};
