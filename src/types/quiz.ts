import { Question, Option } from './question';

export type QuizMode = 'practice' | 'mock' | 'rapid';
export type TimerType = 'none' | 'stopwatch' | 'countdown';

export interface QuizConfig {
  selectedWeeks: number[];
  questionCount: number; // total available or chosen subset
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  mode: QuizMode;
  timerType: TimerType;
  countdownMinutes: number; // Duration if countdown selected
}

export interface QuizQuestionItem {
  question: Question;
  displayOptions: Option[]; // May be shuffled independently
  selectedOptionIds: string[]; // Options selected by student (mapped to original IDs 'A', 'B', etc.)
  isFlagged: boolean;
  isAnswerChecked?: boolean; // In practice mode, student clicked "Check Answer"
}

export interface QuestionReviewItem {
  questionId: string;
  week: number;
  originalQuestionNumber: number;
  question: string;
  options: Option[];
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  isUnanswered: boolean;
  isFlagged: boolean;
  explanation?: string;
  source: string;
}

export interface PerWeekStat {
  week: number;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number;
}

export interface QuizResult {
  id: string;
  timestamp: number;
  completedAt: string;
  config: QuizConfig;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number; // 1 mark per correct answer, 0 for incorrect/unanswered
  accuracy: number; // percentage
  timeTakenSeconds: number;
  perWeekStats: PerWeekStat[];
  questions: QuestionReviewItem[];
}

export interface WeekProgressSummary {
  week: number;
  attemptsCount: number;
  lastScore?: number;
  lastTotal?: number;
  lastAccuracy?: number;
  bestAccuracy?: number;
  lastAttemptDate?: string;
}
