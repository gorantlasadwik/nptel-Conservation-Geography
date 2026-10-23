import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { WeekMetadata } from './types/question';
import type { QuizConfig, QuizQuestionItem, QuizResult, WeekProgressSummary } from './types/quiz';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { CustomQuizPage } from './pages/CustomQuizPage';
import { QuizPage } from './pages/QuizPage';
import { ResultSummary } from './components/ResultSummary';
import { ReviewPage } from './pages/ReviewPage';
import { HistoryPage } from './pages/HistoryPage';
import { QuizSetupModal } from './pages/QuizSetupModal';

import {
  getAllWeeks,
  getTotalLoadedCount,
  getQuestionsForWeeks,
  getQuestionsByIds,
} from './utils/questionsLoader';
import { prepareQuizQuestions } from './utils/shuffle';
import {
  getSavedTheme,
  saveTheme,
  getRecentResults,
  getWeekSummaries,
  getActiveSession,
  clearActiveSession,
  clearAllPracticeHistory,
} from './utils/storage';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(getSavedTheme);

  // Navigation view state
  const [currentView, setCurrentView] = useState<'home' | 'learn' | 'custom' | 'quiz' | 'results' | 'review' | 'history'>('home');

  // Quiz state
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [activeItems, setActiveItems] = useState<QuizQuestionItem[]>([]);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);

  // Setup modal state
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [setupInitialWeeks, setSetupInitialWeeks] = useState<number[]>([1]);
  const [setupInitialMode, setSetupInitialMode] = useState<'practice' | 'mock'>('practice');

  // Stored state
  const [recentResults, setRecentResults] = useState<QuizResult[]>(getRecentResults);
  const [weekSummaries, setWeekSummaries] = useState<Record<number, WeekProgressSummary>>(getWeekSummaries);

  // Weeks & question metadata
  const weeks = useMemo(() => getAllWeeks(), []);
  const totalQuestions = useMemo(() => getTotalLoadedCount(), []);

  // Sync theme to HTML root
  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check on initial load if there is an in-progress quiz session
  useEffect(() => {
    const active = getActiveSession();
    if (active && !active.isCompleted && active.items.length > 0) {
      setActiveConfig(active.config);
      setActiveItems(active.items);
      setCurrentView('quiz');
    }
  }, []);

  // Launch a quiz given a full config
  const handleStartQuiz = useCallback((config: QuizConfig) => {
    const rawQuestions = getQuestionsForWeeks(config.selectedWeeks);
    const prepared = prepareQuizQuestions(
      rawQuestions,
      config.shuffleQuestions,
      config.shuffleOptions,
      config.questionCount
    );

    setActiveConfig(config);
    setActiveItems(prepared);
    setIsSetupModalOpen(false);
    setCurrentView('quiz');
  }, []);

  // Quick Start Rapid Fire Quiz
  const handleStartRapidQuiz = useCallback((week?: number) => {
    const targetWeeks = week !== undefined ? [week] : [1];
    const config: QuizConfig = {
      selectedWeeks: targetWeeks,
      questionCount: 10,
      shuffleQuestions: true,
      shuffleOptions: true,
      mode: 'rapid',
      timerType: 'stopwatch',
      countdownMinutes: 15,
    };
    handleStartQuiz(config);
  }, [handleStartQuiz]);

  // Quick Start single week directly in practice mode
  const handleQuickStartWeek = useCallback((week: number) => {
    const config: QuizConfig = {
      selectedWeeks: [week],
      questionCount: 10,
      shuffleQuestions: false,
      shuffleOptions: false,
      mode: 'practice',
      timerType: 'none',
      countdownMinutes: 15,
    };
    handleStartQuiz(config);
  }, [handleStartQuiz]);

  // Open configuration modal for a specific week
  const handleConfigureWeek = useCallback((week: number) => {
    setSetupInitialWeeks([week]);
    setSetupInitialMode('practice');
    setIsSetupModalOpen(true);
  }, []);

  // Quick Start all weeks
  const handleStartAllWeeks = useCallback(() => {
    const allWeekNumbers = weeks.filter((w) => w.isLoaded).map((w) => w.week);
    const config: QuizConfig = {
      selectedWeeks: allWeekNumbers,
      questionCount: totalQuestions,
      shuffleQuestions: false,
      shuffleOptions: false,
      mode: 'practice',
      timerType: 'stopwatch',
      countdownMinutes: 90,
    };
    handleStartQuiz(config);
  }, [weeks, totalQuestions, handleStartQuiz]);

  // Quick Start Mock Exam
  const handleStartMockExam = useCallback(() => {
    const allWeekNumbers = weeks.filter((w) => w.isLoaded).map((w) => w.week);
    setSetupInitialWeeks(allWeekNumbers);
    setSetupInitialMode('mock');
    setIsSetupModalOpen(true);
  }, [weeks]);

  // Quiz Finished Callback
  const handleQuizFinished = useCallback((result: QuizResult) => {
    setCurrentResult(result);
    setRecentResults(getRecentResults());
    setWeekSummaries(getWeekSummaries());
    setCurrentView('results');
  }, []);

  // Exit Quiz Callback (Direct confirmation handled in QuizPage)
  const handleExitQuiz = useCallback(() => {
    clearActiveSession();
    setActiveConfig(null);
    setActiveItems([]);
    setCurrentView('home');
  }, []);

  // Retry only Incorrect Questions
  const handleRetryIncorrect = useCallback(() => {
    if (!currentResult) return;
    const incorrectIds = currentResult.questions
      .filter((q) => !q.isCorrect)
      .map((q) => q.questionId);

    if (incorrectIds.length === 0) return;

    const rawIncorrectQuestions = getQuestionsByIds(incorrectIds);
    const newItems = prepareQuizQuestions(
      rawIncorrectQuestions,
      currentResult.config.shuffleQuestions,
      currentResult.config.shuffleOptions
    );

    const newConfig: QuizConfig = {
      ...currentResult.config,
      questionCount: rawIncorrectQuestions.length,
      mode: 'practice',
      timerType: 'none',
    };

    setActiveConfig(newConfig);
    setActiveItems(newItems);
    setCurrentView('quiz');
  }, [currentResult]);

  // Retry the exact same quiz
  const handleRetrySameQuiz = useCallback(() => {
    if (!currentResult) return;
    handleStartQuiz(currentResult.config);
  }, [currentResult, handleStartQuiz]);

  // Reset all stored practice history
  const handleResetHistory = useCallback(() => {
    if (window.confirm('Reset all practice history and scores? This cannot be undone.')) {
      clearAllPracticeHistory();
      setRecentResults([]);
      setWeekSummaries({});
      alert('Practice history has been reset.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      
      {/* Global Navbar (hidden during active quiz for clean test interface) */}
      {currentView !== 'quiz' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onResetHistory={handleResetHistory}
          totalCompletedSessions={recentResults.length}
        />
      )}

      {/* Main Page Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <HomePage
              weeks={weeks}
              totalQuestions={totalQuestions}
              recentResults={recentResults}
              weekSummaries={weekSummaries}
              onStartSingleWeek={handleQuickStartWeek}
              onConfigureWeek={handleConfigureWeek}
              onOpenCustomQuiz={() => setCurrentView('custom')}
              onStartAllWeeks={handleStartAllWeeks}
              onStartMockExam={handleStartMockExam}
              onStartRapidQuiz={handleStartRapidQuiz}
              onOpenLearn={() => setCurrentView('learn')}
              onReviewResult={(res) => {
                setCurrentResult(res);
                setCurrentView('results');
              }}
            />
          </div>
        )}

        {currentView === 'learn' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <LearnPage
              weeks={weeks}
              onStartWeekPractice={handleQuickStartWeek}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'custom' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <CustomQuizPage
              weeks={weeks}
              onStartQuiz={handleStartQuiz}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'quiz' && activeConfig && (
          <QuizPage
            initialItems={activeItems}
            config={activeConfig}
            onQuizFinished={handleQuizFinished}
            onExitQuiz={handleExitQuiz}
          />
        )}

        {currentView === 'results' && currentResult && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <ResultSummary
              result={currentResult}
              onReviewAnswers={() => setCurrentView('review')}
              onRetryIncorrect={handleRetryIncorrect}
              onRetrySameQuiz={handleRetrySameQuiz}
              onReturnHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'review' && currentResult && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <ReviewPage
              result={currentResult}
              onBackToResults={() => setCurrentView('results')}
              onRetryIncorrect={handleRetryIncorrect}
              onReturnHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'history' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <HistoryPage
              results={recentResults}
              onReviewResult={(res) => {
                setCurrentResult(res);
                setCurrentView('results');
              }}
              onRetryResult={(res) => {
                handleStartQuiz(res.config);
              }}
              onClearHistory={handleResetHistory}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      {currentView !== 'quiz' && (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>NPTEL Practice Platform • Conservation Geography Week 0–12</span>
            <span>All 130 questions extracted from verified course solution keys</span>
          </div>
        </footer>
      )}

      {/* Quiz Configuration Modal */}
      <QuizSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartQuiz={handleStartQuiz}
        weeks={weeks}
        initialSelectedWeeks={setupInitialWeeks}
        initialMode={setupInitialMode}
      />

    </div>
  );
}

export default App;
