import {
  getEmployeeScheduleFiltered,
  getGroupScheduleFiltered,
  type FlattenedScheduleLesson,
} from "@/entities";
import type { ScheduleFilterOptions } from "@/entities/schedule";
import { getBsuirErrorMessage } from "@/shared/api";

export async function fetchExamFilteredLessonsForHome(input: {
  scheduleMode: "employee" | "group" | null;
  scheduleKey: string | null;
  examLessonTypes: string[];
}): Promise<{
  examFilteredLessons: FlattenedScheduleLesson[];
  examFilteredError: string | null;
}> {
  const { scheduleMode, scheduleKey, examLessonTypes } = input;
  let examFilteredLessons: FlattenedScheduleLesson[] = [];
  let examFilteredError: string | null = null;

  const filter: ScheduleFilterOptions = {
    source: "exams",
    lessonTypeAbbrev: examLessonTypes,
  };

  if (scheduleMode && scheduleKey) {
    try {
      examFilteredLessons =
        scheduleMode === "employee"
          ? await getEmployeeScheduleFiltered(scheduleKey, filter)
          : await getGroupScheduleFiltered(scheduleKey, filter);
    } catch (e) {
      examFilteredError = getBsuirErrorMessage(e);
    }
  }

  return { examFilteredLessons, examFilteredError };
}
