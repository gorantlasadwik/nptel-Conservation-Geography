import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { QuizConfig, QuizQuestionItem, QuizResult } from '../types/quiz';
import { QuizHeader } from '../components/QuizHeader';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { SubmitConfirmModal } from '../components/SubmitConfirmModal';
import { ExitConfirmModal } from '../components/ExitConfirmModal';
import { useTimer } from '../hooks/useTimer';
import { calculateQuizResult, isQuestionAnswerCorrect } from '../utils/scoring';
import { saveQuizResult, saveActiveSession, clearActiveSession, getActiveSession } from '../utils/storage';
import { playFahhSound, playNoiceSound } from '../utils/sound';
import { X } from 'lucide-react';

interface QuizPageProps {
  initialItems: QuizQuestionItem[];
  config: QuizConfig;
  onQuizFinished: (result: QuizResult) => void;
  onExitQuiz: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  initialItems,
  config,
  onQuizFinished,
  onExitQuiz,
}) => {
  // Check if we have an active saved session matching this config
  const [items, setItems] = useState<QuizQuestionItem[]>(() => {
    const saved = getActiveSession();
    if (saved && !saved.isCompleted && saved.items.length === initialItems.length) {
      return saved.items;
    }
    return initialItems;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = getActiveSession();
    if (saved && !saved.isCompleted && saved.items.length === initialItems.length) {
      return saved.currentIndex || 0;
    }
    return 0;
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [isNavigatorOpenOnMobile, setIsNavigatorOpenOnMobile] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  // Accurate drift-free timer
  const countdownSeconds = config.timerType === 'countdown' ? config.countdownMinutes * 60 : 0;

  // Auto-submit callback when countdown timer reaches zero
  const handleTimeExpired = useCallback(() => {
    if (!isSubmittingRef.current && !isSubmitted) {
      console.log('Countdown reached zero. Auto-submitting quiz.');
      submitQuizFinal();
    }
  }, [isSubmitted]);

  const { formattedTime, isExpired, timeElapsed } = useTimer({
    type: config.timerType,
    countdownDurationSeconds: countdownSeconds,
    onTimeExpired: handleTimeExpired,
    isRunning: !isSubmitted,
  });

  // Keep LocalStorage updated with active progress for refresh resilience
  useEffect(() => {
    if (!isSubmitted && items.length > 0) {
      saveActiveSession({
        config,
        items,
        currentIndex,
        startTime: Date.now() - timeElapsed * 1000,
        elapsedSeconds: timeElapsed,
        isCompleted: false,
      });
    }
  }, [items, currentIndex, timeElapsed, isSubmitted, config]);

  // Final submission handler
  const submitQuizFinal = useCallback(() => {
    if (isSubmittingRef.current || isSubmitted) return;
    isSubmittingRef.current = true;
    setIsSubmitted(true);
    setIsSubmitModalOpen(false);

    // Calculate elapsed time (or duration used)
    const finalTime = timeElapsed || 1;
    const result = calculateQuizResult(items, config, finalTime);

    // Save to persistent history and clear active session
    saveQuizResult(result);
    clearActiveSession();

    // Notify parent to render Results Page
    onQuizFinished(result);
  }, [items, config, timeElapsed, isSubmitted, onQuizFinished]);

  // Confirm Exit to Dashboard
  const handleConfirmExit = useCallback(() => {
    clearActiveSession();
    setIsExitModalOpen(false);
    onExitQuiz();
  }, [onExitQuiz]);

  // Option selection handler
  const handleSelectOption = useCallback((optionId: string) => {
    setItems((prevItems) => {
      const copy = [...prevItems];
      const current = copy[currentIndex];
      const isMultiple = current.question.type === 'multiple';

      let updatedSelected: string[];
      if (isMultiple) {
        // Toggle selection
        updatedSelected = current.selectedOptionIds.includes(optionId)
          ? current.selectedOptionIds.filter((id) => id !== optionId)
          : [...current.selectedOptionIds, optionId];
      } else {
        // Single selection
        updatedSelected = [optionId];
      }

      copy[currentIndex] = {
        ...current,
        selectedOptionIds: updatedSelected,
        isAnswerChecked: false,
      };
      return copy;
    });
  }, [currentIndex]);

  // Toggle flag / mark for review
  const handleToggleFlag = useCallback(() => {
    setItems((prevItems) => {
      const copy = [...prevItems];
      const current = copy[currentIndex];
      copy[currentIndex] = {
        ...current,
        isFlagged: !current.isFlagged,
      };
      return copy;
    });
  }, [currentIndex]);

  // Check answer for current question in Practice Mode
  const handleCheckAnswer = useCallback(() => {
    setItems((prevItems) => {
      const copy = [...prevItems];
      const current = copy[currentIndex];
      const isCorrect = isQuestionAnswerCorrect(
        current.selectedOptionIds,
        current.question.correctOptionIds
      );

      if (!isCorrect) {
        playFahhSound();
      } else {
        playNoiceSound();
      }

      copy[currentIndex] = {
        ...current,
        isAnswerChecked: true,
      };
      return copy;
    });
  }, [currentIndex]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, items.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Select question from navigator (auto-close drawer on mobile)
  const handleSelectQuestionIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsNavigatorOpenOnMobile(false);
  }, []);

  // Keyboard navigation & option selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing into an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      // Ignore modifier combinations
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleToggleFlag();
      } else {
        // Option selection keys: A, B, C, D (or 1, 2, 3, 4)
        const keyUpper = e.key.toUpperCase();
        let targetOptIdx = -1;
        if (['A', 'B', 'C', 'D'].includes(keyUpper)) {
          targetOptIdx = keyUpper.charCodeAt(0) - 65;
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          targetOptIdx = parseInt(e.key) - 1;
        }

        if (targetOptIdx >= 0) {
          const currentItem = items[currentIndex];
          if (currentItem && currentItem.displayOptions[targetOptIdx]) {
            e.preventDefault();
            handleSelectOption(currentItem.displayOptions[targetOptIdx].id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, items, handleNext, handlePrev, handleToggleFlag, handleSelectOption]);

  const currentItem = items[currentIndex];
  const answeredCount = items.filter((i) => i.selectedOptionIds.length > 0).length;
  const flaggedCount = items.filter((i) => i.isFlagged).length;
  const unansweredCount = items.length - answeredCount;

  const quizTitle = config.selectedWeeks.length === 1
    ? `Week ${config.selectedWeeks[0]} Practice`
    : config.selectedWeeks.length === 13
    ? 'All Weeks Quiz'
    : 'Custom Week Quiz';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      
      {/* Header */}
      <QuizHeader
        quizTitle={quizTitle}
        selectedWeeks={config.selectedWeeks}
        mode={config.mode}
        timerType={config.timerType}
        formattedTime={formattedTime}
        isTimeExpired={isExpired}
        currentIndex={currentIndex}
        totalQuestions={items.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        isNavigatorOpenOnMobile={isNavigatorOpenOnMobile}
        onToggleNavigatorMobile={() => setIsNavigatorOpenOnMobile((prev) => !prev)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onExitClick={() => setIsExitModalOpen(true)}
      />

      {/* Main Quiz Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          
          {/* Question Display Area (3 cols on large screens, full width on mobile) */}
          <div className="lg:col-span-3">
            {currentItem && (
              <QuestionRenderer
                item={currentItem}
                currentIndex={currentIndex}
                totalQuestions={items.length}
                mode={config.mode}
                onSelectOption={handleSelectOption}
                onToggleFlag={handleToggleFlag}
                onCheckAnswer={handleCheckAnswer}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
          </div>

          {/* Navigator Panel (Sidebar on desktop) */}
          <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
            <QuestionNavigator
              items={items}
              currentIndex={currentIndex}
              onSelectIndex={handleSelectQuestionIndex}
            />
          </div>

        </div>
      </main>

      {/* Mobile Drawer Overlay for Question Navigator */}
      {isNavigatorOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden bg-zinc-950/70 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Jump to Question
              </span>
              <button
                type="button"
                onClick={() => setIsNavigatorOpenOnMobile(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <QuestionNavigator
              items={items}
              currentIndex={currentIndex}
              onSelectIndex={handleSelectQuestionIndex}
            />
          </div>
        </div>
      )}

      {/* In-app Exit Confirmation Modal */}
      <ExitConfirmModal
        isOpen={isExitModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={() => setIsExitModalOpen(false)}
      />

      {/* Final Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        totalQuestions={items.length}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onConfirm={submitQuizFinal}
        onCancel={() => setIsSubmitModalOpen(false)}
      />

    </div>
  );
};
