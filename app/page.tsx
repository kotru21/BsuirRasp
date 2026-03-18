import { toCycleWeek } from "bsuir-iis-api";
import {
  getAnnouncementsByDepartment,
  getAnnouncementsByEmployee,
  getAuditories,
  getCurrentCycleWeek,
  getCurrentWeek,
  getCurrentSemesterWeek,
  getCurrentCycleWeekBySchedule,
  getCurrentSemesterWeekBySchedule,
  getDepartments,
  getEmployeeExams,
  getEmployees,
  getEmployeeSchedule,
  getEmployeeScheduleBySubgroup,
  getEmployeeScheduleFiltered,
  getFaculties,
  getGroupExams,
  getGroupSchedule,
  getGroupScheduleBySubgroup,
  getGroupScheduleFiltered,
  getScheduleLastUpdate,
  getScheduleLastUpdateByEmployee,
  getSpecialities,
  getStudentGroups,
  type Announcement,
  type Employee,
  type NormalizedScheduleResponse,
  type StudentGroup,
} from "@/entities";
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
  const employeeUrlId = params?.employee;
  const departmentId = parsePositiveInt(params?.departmentId);
  const showDepartmentPassport = params?.announcements === "1";
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
    semesterWeekResult,
    cycleWeekResult,
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
      getCurrentSemesterWeek()
        .then((value) => ({ value, error: null as string | null }))
        .catch((e) => ({ value: null as number | null, error: getBsuirErrorMessage(e) })),
      getCurrentCycleWeek()
        .then((value) => ({ value, error: null as string | null }))
        .catch((e) => ({ value: null as number | null, error: getBsuirErrorMessage(e) })),
      departmentId
        ? getAnnouncementsByDepartment(departmentId)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({
              items: [] as Announcement[],
              error: getBsuirErrorMessage(e),
            }))
        : Promise.resolve({ items: [] as Announcement[], error: null as string | null }),
    ]);

  const scheduleExtendedResult =
    scheduleMode === "employee" && scheduleKey
      ? await Promise.all([
          getEmployeeExams(scheduleKey)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeExams>>, error: getBsuirErrorMessage(e) })),
          getEmployeeScheduleFiltered(scheduleKey, {
            source: "schedules",
            weekNumber: currentWeekResult.currentWeek,
          })
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeScheduleFiltered>>, error: getBsuirErrorMessage(e) })),
          getEmployeeScheduleBySubgroup(scheduleKey, 1)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
          getEmployeeScheduleBySubgroup(scheduleKey, 2)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
          getCurrentSemesterWeekBySchedule()
            .then((value) => ({ value, error: null as string | null }))
            .catch((e) => ({ value: null as number | null, error: getBsuirErrorMessage(e) })),
          getCurrentCycleWeekBySchedule()
            .then((value) => ({ value, error: null as string | null }))
            .catch((e) => ({ value: null as number | null, error: getBsuirErrorMessage(e) })),
          getAnnouncementsByEmployee(scheduleKey)
            .then((items) => ({ items, error: null as string | null }))
            .catch((e) => ({ items: [] as Announcement[], error: getBsuirErrorMessage(e) })),
        ])
      : scheduleMode === "group" && scheduleKey
        ? await Promise.all([
            getGroupExams(scheduleKey)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupExams>>, error: getBsuirErrorMessage(e) })),
            getGroupScheduleFiltered(scheduleKey, {
              source: "schedules",
              weekNumber: currentWeekResult.currentWeek,
            })
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupScheduleFiltered>>, error: getBsuirErrorMessage(e) })),
            getGroupScheduleBySubgroup(scheduleKey, 1)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
            getGroupScheduleBySubgroup(scheduleKey, 2)
              .then((items) => ({ items, error: null as string | null }))
              .catch((e) => ({ items: [] as Awaited<ReturnType<typeof getGroupScheduleBySubgroup>>, error: getBsuirErrorMessage(e) })),
            getCurrentSemesterWeekBySchedule()
              .then((value) => ({ value, error: null as string | null }))
              .catch((e) => ({ value: null as number | null, error: getBsuirErrorMessage(e) })),
            getCurrentCycleWeekBySchedule()
              .then((value) => ({ value, error: null as string | null }))
              .catch((e) => ({ value: null as number | null, error: getBsuirErrorMessage(e) })),
            Promise.resolve({ items: [] as Announcement[], error: null as string | null }),
          ])
        : null;

  const sdkInsights: SdkInsightsData | null = (() => {
    if (!scheduleExtendedResult) return null;
    const [
      examsRes,
      filteredWeekRes,
      subgroup1Res,
      subgroup2Res,
      semesterFromScheduleRes,
      cycleFromScheduleRes,
      employeeAnnouncementsRes,
    ] = scheduleExtendedResult;

    return {
      references: {
        faculties: facultiesResult.items.length,
        departments: departmentsResult.items.length,
        specialities: specialitiesResult.items.length,
        auditories: auditoriesResult.items.length,
      },
      weeks: {
        semesterFromCurrentWeek: semesterWeekResult.value,
        cycleFromCurrentWeek: cycleWeekResult.value,
        semesterFromSchedule: semesterFromScheduleRes.value,
        cycleFromSchedule: cycleFromScheduleRes.value,
        cycleFromUtil: semesterWeekResult.value ? toCycleWeek(semesterWeekResult.value) : null,
      },
      schedule: {
        examsCount: examsRes.items.length,
        currentWeekLessons: filteredWeekRes.items.length,
        subgroup1Lessons: subgroup1Res.items.length,
        subgroup2Lessons: subgroup2Res.items.length,
      },
      announcements: {
        employeeCount: employeeAnnouncementsRes.items.length,
        departmentCount: departmentAnnouncementsResult.items.length,
        employeeItems: employeeAnnouncementsRes.items,
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
        exams: examsRes.items,
        filteredCurrentWeek: filteredWeekRes.items,
        subgroup1: subgroup1Res.items,
        subgroup2: subgroup2Res.items,
        lastUpdateDate: lastUpdateResult.lastUpdateDate,
      },
    };
  })();

  const sdkInsightsErrorMessages: Array<string | null> = [
    facultiesResult.error,
    departmentsResult.error,
    specialitiesResult.error,
    auditoriesResult.error,
    semesterWeekResult.error,
    cycleWeekResult.error,
    departmentAnnouncementsResult.error,
    ...(scheduleExtendedResult
      ? scheduleExtendedResult.map((item) => item.error)
      : []),
  ];
  const sdkInsightsError =
    sdkInsightsErrorMessages.filter(Boolean).join(". ") || null;

  const scheduleError =
    [invalidGroupError, scheduleResult.error].filter(Boolean).join(". ") || null;

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
      sdkInsights={sdkInsights}
    />
  );
}
