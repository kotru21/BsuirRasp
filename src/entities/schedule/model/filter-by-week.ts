import type { ScheduleLesson } from "./types";

/**
 * Оставляет только пары, у которых weekNumber содержит указанную неделю.
 */
export function filterLessonsByWeek(
  lessons: ScheduleLesson[],
  weekNumber: number
): ScheduleLesson[] {
  return lessons.filter((lesson) => lesson.weekNumber.includes(weekNumber));
}
