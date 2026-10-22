import { Question, Option } from '../types/question';
import { QuizQuestionItem } from '../types/quiz';

/**
 * Pure Fisher-Yates array shuffle. Returns a new array without mutating the original.
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prepares quiz question items according to independent question and option shuffling rules.
 * Never mutates source data.
 */
export function prepareQuizQuestions(
  questions: readonly Question[],
  shuffleQuestions: boolean,
  shuffleOptions: boolean,
  maxQuestions?: number
): QuizQuestionItem[] {
  // 1. Handle question ordering
  let orderedQuestions = shuffleQuestions ? shuffleArray(questions) : [...questions];

  // 2. Limit count if subset is requested
  if (maxQuestions && maxQuestions > 0 && maxQuestions < orderedQuestions.length) {
    orderedQuestions = orderedQuestions.slice(0, maxQuestions);
  }

  // 3. Map into QuizQuestionItems with option ordering
  return orderedQuestions.map((q) => {
    // Preserve original option objects with their immutable 'id' ('A', 'B', etc.)
    const displayOptions = shuffleOptions ? shuffleArray(q.options) : [...q.options];

    return {
      question: q,
      displayOptions,
      selectedOptionIds: [],
      isFlagged: false,
      isAnswerChecked: false,
    };
  });
}
