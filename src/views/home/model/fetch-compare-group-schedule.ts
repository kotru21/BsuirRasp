import {
  getGroupExams,
  getGroupSchedule,
  getGroupScheduleFiltered,
  type FlattenedScheduleLesson,
  type NormalizedScheduleResponse,
} from "@/entities";
import type { ScheduleFilterOptions } from "@/entities/schedule";
import { getBsuirErrorMessage } from "@/shared/api";

export interface CompareGroupScheduleResult {
  compareSchedule: NormalizedScheduleResponse | null;
  compareScheduleError: string | null;
  compareExamLessons: FlattenedScheduleLesson[];
  compareExamLessonsError: string | null;
  compareExamFilteredLessons: FlattenedScheduleLesson[];
  compareExamFilteredError: string | null;
  compareAdvancedFilterLessons: FlattenedScheduleLesson[] | null;
  compareScheduleFilterError: string | null;
  compareGroupErrorMessage: string | null;
}

export async function fetchCompareGroupSchedule(input: {
  scheduleMode: "employee" | "group" | null;
  groupNumber: string | undefined;
  compareGroupNumber: string | undefined;
  advancedFilterActive: boolean;
  filteredScheduleOptions: ScheduleFilterOptions;
  examLessonTypes: string[];
}): Promise<CompareGroupScheduleResult> {
  const {
    scheduleMode,
    groupNumber,
    compareGroupNumber,
    advancedFilterActive,
    filteredScheduleOptions,
    examLessonTypes,
  } = input;

  let compareSchedule: NormalizedScheduleResponse | null = null;
  let compareScheduleError: string | null = null;
  let compareExamLessons: FlattenedScheduleLesson[] = [];
  let compareExamLessonsError: string | null = null;
  let compareExamFilteredLessons: FlattenedScheduleLesson[] = [];
  let compareExamFilteredError: string | null = null;
  let compareAdvancedFilterLessons: FlattenedScheduleLesson[] | null = null;
  let compareScheduleFilterError: string | null = null;

  if (scheduleMode === "group" && groupNumber && compareGroupNumber) {
    try {
      compareSchedule = await getGroupSchedule(compareGroupNumber);
    } catch (e) {
      compareScheduleError = getBsuirErrorMessage(e);
    }
    try {
      compareExamLessons = await getGroupExams(compareGroupNumber);
    } catch (e) {
      compareExamLessonsError = getBsuirErrorMessage(e);
    }
    try {
      compareExamFilteredLessons = await getGroupScheduleFiltered(compareGroupNumber, {
        source: "exams",
        lessonTypeAbbrev: examLessonTypes,
      });
    } catch (e) {
      compareExamFilteredError = getBsuirErrorMessage(e);
    }
    if (advancedFilterActive) {
      try {
        compareAdvancedFilterLessons = await getGroupScheduleFiltered(
          compareGroupNumber,
          filteredScheduleOptions
        );
      } catch (e) {
        compareScheduleFilterError = getBsuirErrorMessage(e);
      }
    }
  }

  const compareGroupErrorMessage =
    [
      compareScheduleError,
      compareExamLessonsError,
      compareExamFilteredError,
      compareScheduleFilterError,
    ]
      .filter(Boolean)
      .join(" · ") || null;

  return {
    compareSchedule,
    compareScheduleError,
    compareExamLessons,
    compareExamLessonsError,
    compareExamFilteredLessons,
    compareExamFilteredError,
    compareAdvancedFilterLessons,
    compareScheduleFilterError,
    compareGroupErrorMessage,
  };
}
