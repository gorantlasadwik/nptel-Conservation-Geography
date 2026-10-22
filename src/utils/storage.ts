import { QuizResult, WeekProgressSummary, QuizConfig, QuizQuestionItem } from '../types/quiz';

const KEYS = {
  THEME: 'nptel_theme',
  RESULTS: 'nptel_quiz_results',
  WEEK_SUMMARIES: 'nptel_week_summaries',
  ACTIVE_QUIZ: 'nptel_active_quiz_session',
  SAVED_CONFIG: 'nptel_saved_quiz_config',
};

export interface ActiveQuizSession {
  config: QuizConfig;
  items: QuizQuestionItem[];
  currentIndex: number;
  startTime: number;
  elapsedSeconds: number;
  isCompleted: boolean;
}

// ----------------------------------------------------------------------
// Theme Storage
// ----------------------------------------------------------------------
export function getSavedTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  const val = localStorage.getItem(KEYS.THEME);
  return val === 'light' ? 'light' : 'dark';
}

export function saveTheme(theme: 'dark' | 'light') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.THEME, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// ----------------------------------------------------------------------
// Recent Results & Statistics
// ----------------------------------------------------------------------
export function getRecentResults(): QuizResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.RESULTS);
    return raw ? (JSON.parse(raw) as QuizResult[]) : [];
  } catch (e) {
    console.error('Failed to parse recent results:', e);
    return [];
  }
}

export function saveQuizResult(result: QuizResult): void {
  if (typeof window === 'undefined') return;
  try {
    const results = getRecentResults();
    // Prevent duplicate entries for the exact same result ID
    const exists = results.some((r) => r.id === result.id);
    if (!exists) {
      const updated = [result, ...results].slice(0, 30); // keep last 30
      localStorage.setItem(KEYS.RESULTS, JSON.stringify(updated));
    }

    // Update per-week summary aggregates
    updateWeekSummaries(result);
  } catch (e) {
    console.error('Failed to save quiz result:', e);
  }
}

export function getWeekSummaries(): Record<number, WeekProgressSummary> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEYS.WEEK_SUMMARIES);
    return raw ? (JSON.parse(raw) as Record<number, WeekProgressSummary>) : {};
  } catch (e) {
    return {};
  }
}

function updateWeekSummaries(result: QuizResult) {
  const current = getWeekSummaries();

  result.perWeekStats.forEach((stat) => {
    const existing = current[stat.week] || {
      week: stat.week,
      attemptsCount: 0,
      bestAccuracy: 0,
    };

    const newAttempts = existing.attemptsCount + 1;
    const newBest = Math.max(existing.bestAccuracy || 0, stat.accuracy);

    current[stat.week] = {
      week: stat.week,
      attemptsCount: newAttempts,
      lastScore: stat.correct,
      lastTotal: stat.total,
      lastAccuracy: stat.accuracy,
      bestAccuracy: newBest,
      lastAttemptDate: new Date().toLocaleDateString(),
    };
  });

  try {
    localStorage.setItem(KEYS.WEEK_SUMMARIES, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to update week summaries:', e);
  }
}

// ----------------------------------------------------------------------
// Active Session Storage (preserves progress on refresh)
// ----------------------------------------------------------------------
export function getActiveSession(): ActiveQuizSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_QUIZ);
    return raw ? (JSON.parse(raw) as ActiveQuizSession) : null;
  } catch (e) {
    return null;
  }
}

export function saveActiveSession(session: ActiveQuizSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ACTIVE_QUIZ, JSON.stringify(session));
  } catch (e) {
    console.warn('Failed to save active session:', e);
  }
}

export function clearActiveSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.ACTIVE_QUIZ);
}

// ----------------------------------------------------------------------
// Reset All Practice History
// ----------------------------------------------------------------------
export function clearAllPracticeHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.RESULTS);
  localStorage.removeItem(KEYS.WEEK_SUMMARIES);
  localStorage.removeItem(KEYS.ACTIVE_QUIZ);
}
