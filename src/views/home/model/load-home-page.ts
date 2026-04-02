import {
  buildScheduleFilterOptions,
  hasAdvancedScheduleFilterParams,
  parseEffectiveWeek,
} from "@/features/schedule-advanced-filter";
import { uniqueStringsInOrder } from "@/shared/lib";
import { parseExamLessonTypesParam } from "@/features/schedule-exams-filtered";
import type { HomePageProps } from "../ui/HomePage";
import { buildSdkInsightsData } from "./build-sdk-insights-data";
import { fetchCompareGroupSchedule } from "./fetch-compare-group-schedule";
import { fetchExamFilteredLessonsForHome } from "./fetch-exam-filtered-lessons";
import { fetchHomePageCore } from "./fetch-home-page-core";
import {
  fetchRawScheduleIfRequested,
  resolveLastUpdateByNumericId,
} from "./fetch-home-page-side-effects";
import { fetchScheduleExtended } from "./fetch-schedule-extended";
import {
  buildAnnouncementsUiRouteKey,
  type HomePageSearchParams,
  parseHomeRouteContext,
} from "./home-page-search-params";

export type { HomePageSearchParams } from "./home-page-search-params";

export async function loadHomePageProps(
  params: HomePageSearchParams
): Promise<HomePageProps> {
  const ctx = parseHomeRouteContext(params);
  const {
    invalidGroupError,
    invalidCompareGroupError,
    showDepartmentPassport,
    rawScheduleRequested,
    scheduleMode,
    scheduleKey,
    groupNumber,
    compareGroupNumber,
    departmentId,
    filterSearchParams,
  } = ctx;

  const core = await fetchHomePageCore(ctx);
  const {
    groupsResult,
    employeesResult,
    currentWeekResult,
    scheduleResult,
    lastUpdateResult,
    facultiesResult,
    departmentsResult,
    specialitiesResult,
    auditoriesResult,
    departmentAnnouncementsResult,
  } = core;

  const effectiveWeek = parseEffectiveWeek(
    params?.week,
    currentWeekResult.currentWeek
  );

  const advancedFilterActive =
    hasAdvancedScheduleFilterParams(filterSearchParams) &&
    Boolean(scheduleMode && scheduleKey);

  const filteredScheduleOptions = advancedFilterActive
    ? buildScheduleFilterOptions(filterSearchParams, effectiveWeek)
    : { source: "schedules" as const, weekNumber: effectiveWeek };

  const scheduleExtendedResult = await fetchScheduleExtended(
    scheduleMode,
    scheduleKey,
    filteredScheduleOptions
  );

  const extendedExamsRes = scheduleExtendedResult?.[0];
  const extendedFilteredWeekRes = scheduleExtendedResult?.[1];
  const extendedEmployeeAnnouncementsRes = scheduleExtendedResult?.[4];

  const advancedFilterLessons =
    advancedFilterActive && extendedFilteredWeekRes
      ? extendedFilteredWeekRes.items
      : null;
  const scheduleFilterError =
    advancedFilterActive && extendedFilteredWeekRes?.error
      ? extendedFilteredWeekRes.error
      : null;

  const { rawSchedulePayload, rawScheduleError } =
    await fetchRawScheduleIfRequested({
      rawScheduleRequested,
      scheduleMode,
      scheduleKey,
    });

  const loadedSchedule = scheduleResult.schedule;
  const lastUpdateByNumericId = await resolveLastUpdateByNumericId({
    loadedSchedule,
    scheduleMode,
    lastUpdateDate: lastUpdateResult.lastUpdateDate,
  });

  const sdkInsights = buildSdkInsightsData({
    scheduleExtendedResult,
    core,
    ctx,
    loadedSchedule,
    rawSchedulePayload,
    rawScheduleError,
    rawScheduleRequested,
    lastUpdateByNumericId,
  });

  const examLessons = extendedExamsRes?.items ?? [];
  const employeeAnnouncements =
    scheduleMode === "employee"
      ? (extendedEmployeeAnnouncementsRes?.items ?? [])
      : [];

  const examLessonTypes = parseExamLessonTypesParam(params?.examTypes);
  const { examFilteredLessons, examFilteredError } =
    await fetchExamFilteredLessonsForHome({
      scheduleMode,
      scheduleKey,
      examLessonTypes,
    });

  const {
    compareSchedule,
    compareScheduleError,
    compareExamLessons,
    compareExamFilteredLessons,
    compareAdvancedFilterLessons,
    compareScheduleFilterError,
    compareGroupErrorMessage,
  } = await fetchCompareGroupSchedule({
    scheduleMode,
    groupNumber,
    compareGroupNumber,
    advancedFilterActive,
    filteredScheduleOptions,
    examLessonTypes,
  });

  const sdkInsightsErrorMessages: Array<string | null> = [
    facultiesResult.error,
    departmentsResult.error,
    specialitiesResult.error,
    auditoriesResult.error,
    examFilteredError,
    departmentAnnouncementsResult.error,
    ...(scheduleExtendedResult
      ? scheduleExtendedResult.map((item) => item.error)
      : []),
  ];
  const sdkInsightsError =
    uniqueStringsInOrder(
      sdkInsightsErrorMessages.filter(Boolean) as string[]
    ).join(". ") || null;

  const scheduleError =
    uniqueStringsInOrder(
      [invalidGroupError, invalidCompareGroupError, scheduleResult.error].filter(
        Boolean
      ) as string[]
    ).join(". ") || null;

  return {
    announcementsUiRouteKey: buildAnnouncementsUiRouteKey(params),
    groups: groupsResult.groups,
    employees: employeesResult.employees,
    schedule: scheduleResult.schedule,
    currentWeek: currentWeekResult.currentWeek,
    departments: departmentsResult.items,
    selectedDepartmentId: departmentId,
    departmentAnnouncements: departmentAnnouncementsResult.items,
    showDepartmentPassport,
    groupsError: groupsResult.error,
    employeesError: employeesResult.error,
    scheduleError,
    currentWeekError: currentWeekResult.error,
    sdkInsightsError,
    scheduleFilterError,
    compareGroupError: compareGroupErrorMessage,
    advancedFilterLessons,
    examLessons,
    examFilteredLessons,
    examLessonTypesLabel: examLessonTypes.join(", "),
    employeeAnnouncements,
    compareGroupNumber:
      scheduleMode === "group" && groupNumber ? compareGroupNumber ?? null : null,
    compareSchedule,
    compareScheduleError,
    compareExamLessons,
    compareExamFilteredLessons,
    compareAdvancedFilterLessons,
    compareScheduleFilterError,
    faculties: facultiesResult.items,
    specialities: specialitiesResult.items,
    auditories: auditoriesResult.items,
    sdkInsights,
  };
}
