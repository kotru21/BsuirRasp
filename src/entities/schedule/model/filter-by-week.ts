import type { ScheduleLesson } from "./types";

/**
 * Оставляет только пары, у которых weekNumber содержит указанную неделю.
 * API может вернуть weekNumber: null у некоторых занятий — такие пары не попадают в выборку.
 */
export function filterLessonsByWeek(
  lessons: ScheduleLesson[],
  weekNumber: number
): ScheduleLesson[] {
  return lessons.filter(
    (lesson) => Array.isArray(lesson.weekNumber) && lesson.weekNumber.includes(weekNumber)
  );
}
