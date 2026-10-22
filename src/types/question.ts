export type QuestionType = 'single' | 'multiple';

export interface Option {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string; // e.g. 'week-01-q001'
  week: number;
  originalQuestionNumber: number;
  type: QuestionType;
  question: string;
  options: Option[];
  correctOptionIds: string[]; // e.g. ['B']
  explanation?: string;
  assets?: string[];
  source: string;
}

export interface WeekMetadata {
  week: number;
  title: string;
  totalQuestions: number;
  isLoaded: boolean;
  sourceFile?: string | null;
}
