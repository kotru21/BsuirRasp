import type {
  Announcement,
  Employee,
  NormalizedScheduleResponse,
  StudentGroup,
} from "@/entities";
import {
  getAnnouncementsByDepartment,
  getAuditories,
  getCurrentWeek,
  getDepartments,
  getEmployeeSchedule,
  getEmployees,
  getFaculties,
  getGroupSchedule,
  getScheduleLastUpdate,
  getScheduleLastUpdateByEmployee,
  getSpecialities,
  getStudentGroups,
} from "@/entities/server";
import { getBsuirErrorMessage } from "@/shared/api";
import type { HomeRouteContext } from "./home-page-search-params";

export interface HomePageCoreData {
  groupsResult: { groups: StudentGroup[]; error: string | null };
  employeesResult: { employees: Employee[]; error: string | null };
  currentWeekResult: { currentWeek: number; error: string | null };
  scheduleResult: {
    schedule: NormalizedScheduleResponse | null;
    error: string | null;
  };
  lastUpdateResult: {
    lastUpdateDate: string | null;
    error: string | null;
  };
  facultiesResult: {
    items: Awaited<ReturnType<typeof getFaculties>>;
    error: string | null;
  };
  departmentsResult: {
    items: Awaited<ReturnType<typeof getDepartments>>;
    error: string | null;
  };
  specialitiesResult: {
    items: Awaited<ReturnType<typeof getSpecialities>>;
    error: string | null;
  };
  auditoriesResult: {
    items: Awaited<ReturnType<typeof getAuditories>>;
    error: string | null;
  };
  departmentAnnouncementsResult: {
    items: Announcement[];
    error: string | null;
  };
}

export async function fetchHomePageCore(
  ctx: HomeRouteContext
): Promise<HomePageCoreData> {
  const {
    scheduleMode,
    scheduleKey,
    departmentId,
  } = ctx;

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
  ] = await Promise.all([
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
      .then((currentWeek): { currentWeek: number; error: null } => ({
        currentWeek,
        error: null,
      }))
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
          .catch(() => ({
            lastUpdateDate: null as string | null,
            error: null as string | null,
          }))
      : scheduleMode === "group" && scheduleKey
        ? getScheduleLastUpdate(scheduleKey)
            .then((lastUpdateDate) => ({ lastUpdateDate, error: null }))
            .catch(() => ({
              lastUpdateDate: null as string | null,
              error: null as string | null,
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
    departmentId != null
      ? getAnnouncementsByDepartment(departmentId)
          .then((items) => ({ items, error: null as string | null }))
          .catch((e) => ({
            items: [] as Announcement[],
            error: getBsuirErrorMessage(e),
          }))
      : Promise.resolve({ items: [] as Announcement[], error: null as string | null }),
  ]);

  return {
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
  };
}
