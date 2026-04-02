import type { SdkInsightsData } from "@/features/sdk-insights";
import type { NormalizedScheduleResponse } from "@/entities";
import { getGroupScheduleRaw } from "@/entities/server";
import type { HomePageCoreData } from "./fetch-home-page-core";
import type { ScheduleExtendedResult } from "./fetch-schedule-extended";
import type { HomeRouteContext } from "./home-page-search-params";
import type { LastUpdateByNumericIdState } from "./fetch-home-page-side-effects";

export function buildSdkInsightsData(input: {
  scheduleExtendedResult: ScheduleExtendedResult | null;
  core: HomePageCoreData;
  ctx: HomeRouteContext;
  loadedSchedule: NormalizedScheduleResponse | null;
  rawSchedulePayload: Awaited<ReturnType<typeof getGroupScheduleRaw>> | null;
  rawScheduleError: string | null;
  rawScheduleRequested: boolean;
  lastUpdateByNumericId: LastUpdateByNumericIdState;
}): SdkInsightsData | null {
  const {
    scheduleExtendedResult,
    core,
    ctx,
    loadedSchedule,
    rawSchedulePayload,
    rawScheduleError,
    rawScheduleRequested,
    lastUpdateByNumericId,
  } = input;

  const {
    facultiesResult,
    departmentsResult,
    specialitiesResult,
    auditoriesResult,
    departmentAnnouncementsResult,
    groupsResult,
    employeesResult,
    scheduleResult,
    currentWeekResult,
    lastUpdateResult,
  } = core;

  const {
    params,
    rawGroupNumber,
    employeeUrlId,
    departmentId,
    scheduleMode,
    scheduleKey,
    rawCompareGroup,
  } = ctx;

  if (!scheduleExtendedResult) return null;

  const [
    extendedExamsRes,
    extendedFilteredWeekRes,
    extendedSubgroup1Res,
    extendedSubgroup2Res,
    extendedEmployeeAnnouncementsRes,
  ] = scheduleExtendedResult;

  if (
    !extendedExamsRes ||
    !extendedFilteredWeekRes ||
    !extendedSubgroup1Res ||
    !extendedSubgroup2Res ||
    !extendedEmployeeAnnouncementsRes
  ) {
    return null;
  }

  return {
    references: {
      faculties: facultiesResult.items.length,
      departments: departmentsResult.items.length,
      specialities: specialitiesResult.items.length,
      auditories: auditoriesResult.items.length,
    },
    weeks: {
      currentWeek: currentWeekResult.currentWeek ?? null,
    },
    schedule: {
      examsCount: extendedExamsRes.items.length,
      currentWeekLessons: extendedFilteredWeekRes.items.length,
      subgroup1Lessons: extendedSubgroup1Res.items.length,
      subgroup2Lessons: extendedSubgroup2Res.items.length,
    },
    announcements: {
      employeeCount: extendedEmployeeAnnouncementsRes.items.length,
      departmentCount: departmentAnnouncementsResult.items.length,
      employeeItems: extendedEmployeeAnnouncementsRes.items,
      departmentItems: departmentAnnouncementsResult.items,
    },
    raw: {
      pageContext: {
        group: rawGroupNumber ?? null,
        employee: employeeUrlId ?? null,
        week: params?.week ?? null,
        departmentId,
        scheduleMode,
        scheduleKey,
        compareGroup: rawCompareGroup ?? null,
      },
      pageData: {
        groups: groupsResult.groups,
        employees: employeesResult.employees,
        schedule: scheduleResult.schedule,
        currentWeek: currentWeekResult.currentWeek ?? null,
        lastUpdateDate: lastUpdateResult.lastUpdateDate ?? null,
      },
      pageErrors: {
        groupsError: groupsResult.error,
        employeesError: employeesResult.error,
        scheduleError: scheduleResult.error,
        currentWeekError: currentWeekResult.error,
        departmentAnnouncementsError: departmentAnnouncementsResult.error,
        employeeAnnouncementsError: extendedEmployeeAnnouncementsRes.error,
        sdkInsightsError: null,
      },
      faculties: facultiesResult.items,
      departments: departmentsResult.items,
      specialities: specialitiesResult.items,
      auditories: auditoriesResult.items,
      exams: extendedExamsRes.items,
      filteredCurrentWeek: extendedFilteredWeekRes.items,
      subgroup1: extendedSubgroup1Res.items,
      subgroup2: extendedSubgroup2Res.items,
      lastUpdateDate: lastUpdateResult.lastUpdateDate,
    },
    advanced: {
      rawSchedule: {
        requested: rawScheduleRequested,
        payload: rawSchedulePayload,
        error: rawScheduleError,
        normalizedTopLevelKeys: loadedSchedule
          ? Object.keys(loadedSchedule).sort()
          : [],
        rawTopLevelKeys: rawSchedulePayload
          ? Object.keys(rawSchedulePayload).sort()
          : [],
      },
      lastUpdateByNumericId,
      lastUpdateNamespaceNote:
        "Last update: легаси-эндпоинты ИИС (client.schedule.getLastUpdateByGroup / getLastUpdateByEmployee). Для части сущностей ответа нет (404); при успехе дата может быть неточной. См. JSDoc в bsuir-iis-api и entities/schedule/api/last-update.ts.",
      currentWeekAliasNote:
        "Текущая неделя: в bsuir-iis-api ≥0.4 только client.schedule.getCurrentWeek() (см. entities/current-week).",
      requestQueryRecipeNote:
        "Произвольные query в ReadOptions: см. README showcase и пакет bsuir-iis-api.",
    },
  };
}
