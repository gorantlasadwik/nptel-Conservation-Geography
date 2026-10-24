import { Question, WeekMetadata } from '../types/question';
import weeksData from '../data/weeks.json';

import week00 from '../data/questions/week-00.json';
import week01 from '../data/questions/week-01.json';
import week02 from '../data/questions/week-02.json';
import week03 from '../data/questions/week-03.json';
import week04 from '../data/questions/week-04.json';
import week05 from '../data/questions/week-05.json';
import week06 from '../data/questions/week-06.json';
import week07 from '../data/questions/week-07.json';
import week08 from '../data/questions/week-08.json';
import week09 from '../data/questions/week-09.json';
import week10 from '../data/questions/week-10.json';
import week11 from '../data/questions/week-11.json';
import week12 from '../data/questions/week-12.json';
import weekInfinity from '../data/questions/week-infinity.json';

const questionsByWeek: Record<number, Question[]> = {
  0: week00 as Question[],
  1: week01 as Question[],
  2: week02 as Question[],
  3: week03 as Question[],
  4: week04 as Question[],
  5: week05 as Question[],
  6: week06 as Question[],
  7: week07 as Question[],
  8: week08 as Question[],
  9: week09 as Question[],
  10: week10 as Question[],
  11: week11 as Question[],
  12: week12 as Question[],
  99: weekInfinity as Question[],
};

export const COURSE_INFO = {
  code: "NPTEL-ENV-01",
  name: "Conservation Geography",
  instructor: "NPTEL Faculty",
  totalWeeks: 14,
};

export function getAllWeeks(): WeekMetadata[] {
  return (weeksData as WeekMetadata[]).map(w => ({
    ...w,
    totalQuestions: questionsByWeek[w.week]?.length || 0,
    isLoaded: (questionsByWeek[w.week]?.length || 0) > 0,
  }));
}

export function getWeekMetadata(week: number): WeekMetadata | undefined {
  const weeks = getAllWeeks();
  return weeks.find(w => w.week === week);
}

export function getQuestionsForWeek(week: number): Question[] {
  return questionsByWeek[week] || [];
}

export function getQuestionsForWeeks(weeks: number[]): Question[] {
  const selected: Question[] = [];
  // Keep original order of weeks unless shuffled later
  const sortedWeeks = [...weeks].sort((a, b) => a - b);
  for (const w of sortedWeeks) {
    const qs = questionsByWeek[w];
    if (qs && qs.length > 0) {
      selected.push(...qs);
    }
  }
  return selected;
}

export function getAllLoadedQuestions(): Question[] {
  const all: Question[] = [];
  const weekKeys = Object.keys(questionsByWeek).map(Number).sort((a, b) => a - b);
  for (const w of weekKeys) {
    if (questionsByWeek[w]) {
      all.push(...questionsByWeek[w]);
    }
  }
  return all;
}

export function getTotalLoadedCount(): number {
  return getAllLoadedQuestions().length;
}

export function getQuestionsByIds(questionIds: string[]): Question[] {
  const idSet = new Set(questionIds);
  return getAllLoadedQuestions().filter(q => idSet.has(q.id));
}
