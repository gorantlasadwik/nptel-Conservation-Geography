import { QuizConfig, QuizQuestionItem, QuizResult, QuestionReviewItem, PerWeekStat } from '../types/quiz';

/**
 * Checks if a user's selection matches the correct answer keys.
 * Handles single-choice and multiple-choice questions correctly.
 */
export function isQuestionAnswerCorrect(
  selectedOptionIds: string[],
  correctOptionIds: string[]
): boolean {
  if (selectedOptionIds.length === 0 || correctOptionIds.length === 0) {
    return false;
  }
  if (selectedOptionIds.length !== correctOptionIds.length) {
    return false;
  }
  const setA = new Set(selectedOptionIds);
  return correctOptionIds.every((id) => setA.has(id));
}

/**
 * Evaluates the quiz submission, builds detailed review items, computes per-week breakdown,
 * and formats the final QuizResult.
 */
export function calculateQuizResult(
  items: QuizQuestionItem[],
  config: QuizConfig,
  timeTakenSeconds: number
): QuizResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const perWeekMap = new Map<number, { total: number; correct: number; incorrect: number; unanswered: number }>();

  const reviewItems: QuestionReviewItem[] = items.map((item) => {
    const { question, selectedOptionIds, isFlagged } = item;
    const isUnanswered = selectedOptionIds.length === 0;
    const isCorrect = !isUnanswered && isQuestionAnswerCorrect(selectedOptionIds, question.correctOptionIds);
    const isIncorrect = !isUnanswered && !isCorrect;

    if (isCorrect) correctCount++;
    else if (isIncorrect) incorrectCount++;
    else unansweredCount++;

    // Track per-week stats
    const w = question.week;
    const currentWeekStat = perWeekMap.get(w) || { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
    currentWeekStat.total += 1;
    if (isCorrect) currentWeekStat.correct += 1;
    else if (isIncorrect) currentWeekStat.incorrect += 1;
    else currentWeekStat.unanswered += 1;
    perWeekMap.set(w, currentWeekStat);

    return {
      questionId: question.id,
      week: question.week,
      originalQuestionNumber: question.originalQuestionNumber,
      question: question.question,
      options: question.options,
      selectedOptionIds,
      correctOptionIds: question.correctOptionIds,
      isCorrect,
      isUnanswered,
      isFlagged,
      explanation: question.explanation,
      source: question.source,
    };
  });

  const totalQuestions = items.length;
  // Standard scoring policy: +1 for correct, 0 for wrong/unanswered
  const score = correctCount;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 1000) / 10 : 0;

  const perWeekStats: PerWeekStat[] = Array.from(perWeekMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, stats]) => ({
      week,
      total: stats.total,
      correct: stats.correct,
      incorrect: stats.incorrect,
      unanswered: stats.unanswered,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 1000) / 10 : 0,
    }));

  return {
    id: `quiz-result-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    completedAt: new Date().toLocaleString(),
    config,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    score,
    accuracy,
    timeTakenSeconds,
    perWeekStats,
    questions: reviewItems,
  };
}

/**
 * Formats seconds into MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
