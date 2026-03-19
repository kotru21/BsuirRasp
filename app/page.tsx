import {
  getAnnouncementsByDepartment,
  getAnnouncementsByEmployee,
  getAuditories,
  getCurrentWeek,
  getDepartments,
  getEmployeeExams,
  getEmployees,
  getEmployeeSchedule,
  getEmployeeScheduleBySubgroup,
  getEmployeeScheduleFiltered,
  getFaculties,
  getGroupExams,
  getGroupSchedule,
  getGroupScheduleRaw,
  getGroupScheduleBySubgroup,
  getGroupScheduleFiltered,
  getScheduleLastUpdate,
  getScheduleLastUpdateByEmployee,
  getLastUpdateByGroup,
  getLastUpdateByEmployee,
  getEmployeeScheduleRaw,
  getSpecialities,
  getStudentGroups,
  type Announcement,
  type Employee,
  type FlattenedScheduleLesson,
  type NormalizedScheduleResponse,
  type StudentGroup,
} from "@/entities";
import {
  buildScheduleFilterOptions,
  hasAdvancedScheduleFilterParams,
  parseEffectiveWeek,
  type ScheduleSearchFilterParams,
} from "@/features/schedule-advanced-filter";
import { parseExamLessonTypesParam } from "@/features/schedule-exams-filtered";
import type { SdkInsightsData } from "@/features/sdk-insights";
import { getBsuirErrorMessage } from "@/shared/api";
import { HomePage } from "@/views/home";

interface PageProps {
  searchParams: Promise<{
    group?: string;
    employee?: string;
    week?: string;
    departmentId?: string;
    announcements?: string;
    /** `1` — дополнительный запрос расписания с `{ raw: true }` для SDK Insights */
    rawSchedule?: string;
    /** Фильтры SDK get*Filtered (см. ScheduleAdvancedFilterPanel) */
    fDay?: string;
    fSubject?: string;
    fType?: string;
    fAuditory?: string;
    fEmployee?: string;
    subgroup?: string;
    /** Типы для get*Filtered с source: "exams" (через запятую), см. README SDK */
    examTypes?: string;
    /** Вторая группа для сравнения расписания (только цифры, как `group`) */
    compareGroup?: string;
  }>;
}

function parsePositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawGroupNumber = params?.group?.trim();
  const groupNumber =
    rawGroupNumber && /^\d+$/.test(rawGroupNumber) ? rawGroupNumber : undefined;
  const invalidGroupError =
    rawGroupNumber && !groupNumber ? "Неверный номер группы" : null;
  const rawCompareGroup = params?.compareGroup?.trim();
  const compareGroupNumber =
    rawCompareGroup && /^\d+$/.test(rawCompareGroup) ? rawCompareGroup : undefined;
  const invalidCompareGroupError =
    rawCompareGroup && !compareGroupNumber
      ? "Неверный compareGroup (ожидается номер группы)"
      : null;
  const employeeUrlId = params?.employee;
  const departmentId = parsePositiveInt(params?.departmentId);
  const showDepartmentPassport = params?.announcements === "1";
  const rawScheduleRequested = params?.rawSchedule === "1";
  const scheduleMode = employeeUrlId ? "employee" : groupNumber ? "group" : null;
  const scheduleKey = employeeUrlId ?? groupNumber ?? null;

  const [
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
  ] =
    await Promise.all([
      getStudentGroups()
        .then((groups): { groups: StudentGroup[]; error: null } => ({ groups, error: null }))
        .catch((e) => ({ groups: [] as StudentGroup[], error: getBsuirErrorMessage(e) })),
      getEmployees()
        .then((employees): { employees: Employee[]; error: null } => ({
          employees,
          error: null,
        }))
        .catch((e) => ({
          employees: [] as Employee[],
          error: getBsuirErrorMessage(e),
        })),
      getCurrentWeek()
        .then((currentWeek): { currentWeek: number; error: null } => ({ currentWeek, error: null }))
        .catch((e) => ({ currentWeek: 1, error: getBsuirErrorMessage(e) })),
      scheduleMode === "employee" && scheduleKey
        ? getEmployeeSchedule(scheduleKey)
            .then((schedule): { schedule: NormalizedScheduleResponse; error: null } => ({
              schedule,
              error: null,
            }))
            .catch((e) => ({
              schedule: null as NormalizedScheduleResponse | null,
              error: getBsuirErrorMessage(e),
            }))
        : scheduleMode === "group" && scheduleKey
          ? getGroupSchedule(scheduleKey)
              .then((schedule): { schedule: NormalizedScheduleResponse; error: null } => ({
                schedule,
                error: null,
              }))
              .catch((e) => ({
                schedule: null as NormalizedScheduleResponse | null,
                error: getBsuirErrorMessage(e),
              }))
          : Promise.resolve({
              schedule: null as NormalizedScheduleResponse | null,
              error: null as string | null,
            }),
      scheduleMode === "employee" && scheduleKey
        ? getScheduleLastUpdateByEmployee(scheduleKey)
            .then((lastUpdateDate) => ({ lastUpdateDate, error: null }))
            .catch((e) => ({
              lastUpdateDate: null as string | null,
              error: getBsuirErrorMessage(e),
            }))
        : scheduleMode === "group" && scheduleKey
          ? getScheduleLastUpdate(scheduleKey)
              .then((lastUpdateDate) => ({ lastUpdateDate, error: null }))
              .catch((e) => ({
                lastUpdateDate: null as string | null,
                error: getBsuirErrorMessage(e),
              }))
          : Promise.resolve({ lastUpdateDate: null as string | null, error: null }),
      getFaculties()
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getFaculties>>,
          error: getBsuirErrorMessage(e),
        })),
      getDepartments()
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getDepartments>>,
          error: getBsuirErrorMessage(e),
        })),
      getSpecialities()
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getSpecialities>>,
          error: getBsuirErrorMessage(e),
        })),
      getAuditories()
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getAuditories>>,
          error: getBsuirErrorMessage(e),
        })),
      departmentId
        ? getAnnouncementsByDepartment(departmentId)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({
              items: [] as Announcement[],
              error: getBsuirErrorMessage(e),
            }))
        : Promise.resolve({ items: [] as Announcement[], error: null as string | null }),
    ]);

  const effectiveWeek = parseEffectiveWeek(
    params?.week,
    currentWeekResult.currentWeek
  );

  const filterSearchParams: ScheduleSearchFilterParams = {
    week: params?.week,
    subgroup: params?.subgroup,
    fDay: params?.fDay,
    fSubject: params?.fSubject,
    fType: params?.fType,
    fAuditory: params?.fAuditory,
    fEmployee: params?.fEmployee,
  };

  const advancedFilterActive =
    hasAdvancedScheduleFilterParams(filterSearchParams) &&
    Boolean(scheduleMode && scheduleKey);

  const filteredScheduleOptions = advancedFilterActive
    ? buildScheduleFilterOptions(filterSearchParams, effectiveWeek)
    : { source: "schedules" as const, weekNumber: effectiveWeek };

  const scheduleExtendedResult =
    scheduleMode === "employee" && scheduleKey
      ? await Promise.all([
          getEmployeeExams(scheduleKey)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeExams>>, error: getBsuirErrorMessage(e) })),
          getEmployeeScheduleFiltered(scheduleKey, filteredScheduleOptions)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeScheduleFiltered>>, error: getBsuirErrorMessage(e) })),
          getEmployeeScheduleBySubgroup(scheduleKey, 1)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
          getEmployeeScheduleBySubgroup(scheduleKey, 2)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
          getAnnouncementsByEmployee(scheduleKey)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Announcement[], error: getBsuirErrorMessage(e) })),
        ])
      : scheduleMode === "group" && scheduleKey
        ? await Promise.all([
            getGroupExams(scheduleKey)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupExams>>, error: getBsuirErrorMessage(e) })),
            getGroupScheduleFiltered(scheduleKey, filteredScheduleOptions)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupScheduleFiltered>>, error: getBsuirErrorMessage(e) })),
            getGroupScheduleBySubgroup(scheduleKey, 1)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
            getGroupScheduleBySubgroup(scheduleKey, 2)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
            Promise.resolve({ items: [] as Announcement[], error: null as string | null }),
          ])
        : null;

  const extendedExamsRes = scheduleExtendedResult?.[0];
  const extendedFilteredWeekRes = scheduleExtendedResult?.[1];
  const extendedSubgroup1Res = scheduleExtendedResult?.[2];
  const extendedSubgroup2Res = scheduleExtendedResult?.[3];
  const extendedEmployeeAnnouncementsRes = scheduleExtendedResult?.[4];

  const advancedFilterLessons: FlattenedScheduleLesson[] | null =
    advancedFilterActive && extendedFilteredWeekRes
      ? extendedFilteredWeekRes.items
      : null;
  const scheduleFilterError: string | null =
    advancedFilterActive && extendedFilteredWeekRes?.error
      ? extendedFilteredWeekRes.error
      : null;

  let rawSchedulePayload: Awaited<ReturnType<typeof getGroupScheduleRaw>> | null =
    null;
  let rawScheduleError: string | null = null;
  if (rawScheduleRequested && scheduleMode && scheduleKey) {
    try {
      rawSchedulePayload =
        scheduleMode === "employee"
          ? await getEmployeeScheduleRaw(scheduleKey)
          : await getGroupScheduleRaw(scheduleKey);
    } catch (e) {
      rawScheduleError = getBsuirErrorMessage(e);
    }
  }

  const lastUpdateByNumericId: {
    date: string | null;
    error: string | null;
    matchesStringKey: boolean | null;
  } = {
    date: null,
    error: null,
    matchesStringKey: null,
  };
  const loadedSchedule = scheduleResult.schedule;
  if (loadedSchedule && scheduleMode === "group" && loadedSchedule.studentGroupDto?.id != null) {
    try {
      const d = await getLastUpdateByGroup({
        id: loadedSchedule.studentGroupDto.id,
      });
      lastUpdateByNumericId.date = d;
      lastUpdateByNumericId.matchesStringKey =
        lastUpdateResult.lastUpdateDate != null && d === lastUpdateResult.lastUpdateDate;
    } catch (e) {
      lastUpdateByNumericId.error = getBsuirErrorMessage(e);
    }
  } else if (loadedSchedule && scheduleMode === "employee" && loadedSchedule.employeeDto?.id != null) {
    try {
      const d = await getLastUpdateByEmployee({
        id: loadedSchedule.employeeDto.id,
      });
      lastUpdateByNumericId.date = d;
      lastUpdateByNumericId.matchesStringKey =
        lastUpdateResult.lastUpdateDate != null && d === lastUpdateResult.lastUpdateDate;
    } catch (e) {
      lastUpdateByNumericId.error = getBsuirErrorMessage(e);
    }
  }

  const sdkInsights: SdkInsightsData | null = (() => {
    if (
      !scheduleExtendedResult ||
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
          lastUpdateError: lastUpdateResult.error,
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
          "Last update: только client.schedule.getLastUpdateByGroup / getLastUpdateByEmployee (bsuir-iis-api ≥0.5; см. entities/schedule/api/last-update.ts).",
        currentWeekAliasNote:
          "Текущая неделя: в bsuir-iis-api ≥0.4 только client.schedule.getCurrentWeek() (см. entities/current-week).",
        requestQueryRecipeNote:
          "Произвольные query в ReadOptions: см. README showcase и пакет bsuir-iis-api.",
      },
    };
  })();

  const examLessons = extendedExamsRes?.items ?? [];
  const employeeAnnouncements =
    scheduleMode === "employee"
      ? (extendedEmployeeAnnouncementsRes?.items ?? [])
      : [];

  const examLessonTypes = parseExamLessonTypesParam(params?.examTypes);
  let examFilteredLessons: FlattenedScheduleLesson[] = [];
  let examFilteredError: string | null = null;
  if (scheduleMode && scheduleKey) {
    try {
      examFilteredLessons =
        scheduleMode === "employee"
          ? await getEmployeeScheduleFiltered(scheduleKey, {
              source: "exams",
              lessonTypeAbbrev: examLessonTypes,
            })
          : await getGroupScheduleFiltered(scheduleKey, {
              source: "exams",
              lessonTypeAbbrev: examLessonTypes,
            });
    } catch (e) {
      examFilteredError = getBsuirErrorMessage(e);
    }
  }

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

  const sdkInsightsErrorMessages: Array<string | null> = [
    facultiesResult.error,
    departmentsResult.error,
    specialitiesResult.error,
    auditoriesResult.error,
    examFilteredError,
    // Ошибку объявлений кафедры не показываем в тостах: при первом запросе иногда приходит 400, при повторном — 200 и данные
    ...(scheduleExtendedResult
      ? scheduleExtendedResult.map((item) => item.error)
      : []),
  ];
  const sdkInsightsError =
    sdkInsightsErrorMessages.filter(Boolean).join(". ") || null;

  const scheduleError =
    [invalidGroupError, invalidCompareGroupError, scheduleResult.error]
      .filter(Boolean)
      .join(". ") || null;

  return (
    <HomePage
      groups={groupsResult.groups}
      employees={employeesResult.employees}
      schedule={scheduleResult.schedule}
      currentWeek={currentWeekResult.currentWeek}
      departments={departmentsResult.items}
      selectedDepartmentId={departmentId}
      departmentAnnouncements={departmentAnnouncementsResult.items}
      showDepartmentPassport={showDepartmentPassport}
      lastUpdateDate={lastUpdateResult.lastUpdateDate}
      groupsError={groupsResult.error}
      employeesError={employeesResult.error}
      scheduleError={scheduleError}
      currentWeekError={currentWeekResult.error}
      lastUpdateError={lastUpdateResult.error}
      sdkInsightsError={sdkInsightsError}
      scheduleFilterError={scheduleFilterError}
      compareGroupError={compareGroupErrorMessage}
      advancedFilterLessons={advancedFilterLessons}
      examLessons={examLessons}
      examFilteredLessons={examFilteredLessons}
      examLessonTypesLabel={examLessonTypes.join(", ")}
      employeeAnnouncements={employeeAnnouncements}
      compareGroupNumber={
        scheduleMode === "group" && groupNumber ? compareGroupNumber ?? null : null
      }
      compareSchedule={compareSchedule}
      compareScheduleError={compareScheduleError}
      compareExamLessons={compareExamLessons}
      compareExamFilteredLessons={compareExamFilteredLessons}
      compareAdvancedFilterLessons={compareAdvancedFilterLessons}
      compareScheduleFilterError={compareScheduleFilterError}
      faculties={facultiesResult.items}
      specialities={specialitiesResult.items}
      auditories={auditoriesResult.items}
      sdkInsights={sdkInsights}
    />
  );
}
