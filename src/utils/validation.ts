import { Question } from '../types/question';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  questionId?: string;
  week?: number;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalQuestions: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

export function validateQuestionBank(questions: Question[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenQuestionIds = new Set<string>();
  const seenWeekQuestions = new Map<number, Set<number>>();

  for (const q of questions) {
    const qLabel = q.id || `Unknown (Week ${q.week}, #${q.originalQuestionNumber})`;

    // Check Question ID
    if (!q.id || !q.id.trim()) {
      issues.push({
        severity: 'error',
        week: q.week,
        message: `Missing question ID for question in Week ${q.week}`,
      });
    } else if (seenQuestionIds.has(q.id)) {
      issues.push({
        severity: 'error',
        questionId: q.id,
        week: q.week,
        message: `Duplicate question ID detected: "${q.id}"`,
      });
    } else {
      seenQuestionIds.add(q.id);
    }

    // Check Week Number
    if (q.week === undefined || q.week === null || q.week < 0 || q.week > 12) {
      issues.push({
        severity: 'error',
        questionId: q.id,
        week: q.week,
        message: `Invalid week number: ${q.week} (must be between 0 and 12)`,
      });
    } else {
      if (!seenWeekQuestions.has(q.week)) {
        seenWeekQuestions.set(q.week, new Set());
      }
      const weekNums = seenWeekQuestions.get(q.week)!;
      if (weekNums.has(q.originalQuestionNumber)) {
        issues.push({
          severity: 'error',
          questionId: q.id,
          week: q.week,
          message: `Duplicate question number #${q.originalQuestionNumber} within Week ${q.week}`,
        });
      } else {
        weekNums.add(q.originalQuestionNumber);
      }
    }

    // Check Question Text
    if (!q.question || !q.question.trim()) {
      issues.push({
        severity: 'error',
        questionId: q.id,
        week: q.week,
        message: `Missing question text for "${qLabel}"`,
      });
    }

    // Check Options
    if (!Array.isArray(q.options) || q.options.length < 2) {
      issues.push({
        severity: 'error',
        questionId: q.id,
        week: q.week,
        message: `Question "${qLabel}" has fewer than 2 options`,
      });
    } else {
      const optionIds = new Set<string>();
      for (const opt of q.options) {
        if (!opt.id || !opt.id.trim()) {
          issues.push({
            severity: 'error',
            questionId: q.id,
            week: q.week,
            message: `Empty option identifier in question "${qLabel}"`,
          });
        } else if (optionIds.has(opt.id)) {
          issues.push({
            severity: 'error',
            questionId: q.id,
            week: q.week,
            message: `Duplicate option ID "${opt.id}" in question "${qLabel}"`,
          });
        } else {
          optionIds.add(opt.id);
        }

        if (!opt.text || !opt.text.trim()) {
          issues.push({
            severity: 'warning',
            questionId: q.id,
            week: q.week,
            message: `Empty text for option "${opt.id}" in question "${qLabel}"`,
          });
        }
      }

      // Check Correct Answer IDs
      if (!Array.isArray(q.correctOptionIds) || q.correctOptionIds.length === 0) {
        issues.push({
          severity: 'error',
          questionId: q.id,
          week: q.week,
          message: `Missing answer key (correctOptionIds) in question "${qLabel}"`,
        });
      } else {
        for (const ansId of q.correctOptionIds) {
          if (!optionIds.has(ansId)) {
            issues.push({
              severity: 'error',
              questionId: q.id,
              week: q.week,
              message: `Correct option ID "${ansId}" does not exist in options for "${qLabel}"`,
            });
          }
        }
      }
    }

    // Check question type
    if (q.type !== 'single' && q.type !== 'multiple') {
      issues.push({
        severity: 'warning',
        questionId: q.id,
        week: q.week,
        message: `Unsupported or unknown question type: "${q.type}" in "${qLabel}"`,
      });
    }
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return {
    isValid: errorCount === 0,
    totalQuestions: questions.length,
    errorCount,
    warningCount,
    issues,
  };
}
