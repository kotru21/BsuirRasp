import type { ScheduleLesson } from "./types";

export type SubgroupFilter = "all" | 1 | 2;

/**
 * Оставляет занятия, подходящие под выбранную подгруппу.
 * "all" — все; 1 — общие (numSubgroup 0) и 1-я подгруппа; 2 — общие и 2-я подгруппа.
 */
export function filterLessonsBySubgroup(
  lessons: ScheduleLesson[],
  subgroup: SubgroupFilter
): ScheduleLesson[] {
  if (subgroup === "all") return lessons;
  return lessons.filter((lesson) => lesson.numSubgroup === 0 || lesson.numSubgroup === subgroup);
}
