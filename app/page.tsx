import { HomePage } from "@/views/home";
import { getStudentGroups } from "@/entities/student-group";
import { getEmployees } from "@/entities/employee";
import { getCurrentWeek } from "@/entities/current-week";
import {
  getEmployeeSchedule,
  getGroupSchedule,
  getScheduleLastUpdate,
  getScheduleLastUpdateByEmployee,
} from "@/entities/schedule";
import { getBsuirErrorMessage } from "@/shared/api";
import type { NormalizedScheduleResponse } from "@/entities/schedule";
import type { Employee } from "@/entities/employee";
import type { StudentGroup } from "@/entities/student-group";

interface PageProps {
  searchParams: Promise<{ group?: string; employee?: string; week?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawGroupNumber = params?.group?.trim();
  const groupNumber =
    rawGroupNumber && /^\d+$/.test(rawGroupNumber) ? rawGroupNumber : undefined;
  const invalidGroupError =
    rawGroupNumber && !groupNumber ? "Неверный номер группы" : null;
  const employeeUrlId = params?.employee;
  const scheduleMode = employeeUrlId ? "employee" : groupNumber ? "group" : null;
  const scheduleKey = employeeUrlId ?? groupNumber ?? null;

  const [
    groupsResult,
    employeesResult,
    currentWeekResult,
    scheduleResult,
    lastUpdateResult,
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
    ]);

  const scheduleError =
    [invalidGroupError, scheduleResult.error].filter(Boolean).join(". ") || null;

  return (
    <HomePage
      groups={groupsResult.groups}
      employees={employeesResult.employees}
      schedule={scheduleResult.schedule}
      currentWeek={currentWeekResult.currentWeek}
      lastUpdateDate={lastUpdateResult.lastUpdateDate}
      groupsError={groupsResult.error}
      employeesError={employeesResult.error}
      scheduleError={scheduleError}
      currentWeekError={currentWeekResult.error}
      lastUpdateError={lastUpdateResult.error}
    />
  );
}
