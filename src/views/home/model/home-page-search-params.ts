import type { ScheduleSearchFilterParams } from "@/features/schedule-advanced-filter";

export interface HomePageSearchParams {
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
}

export function parsePositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

export interface HomeRouteContext {
  params: HomePageSearchParams;
  rawGroupNumber: string | undefined;
  groupNumber: string | undefined;
  invalidGroupError: string | null;
  rawCompareGroup: string | undefined;
  compareGroupNumber: string | undefined;
  invalidCompareGroupError: string | null;
  employeeUrlId: string | undefined;
  departmentId: number | null;
  showDepartmentPassport: boolean;
  rawScheduleRequested: boolean;
  scheduleMode: "employee" | "group" | null;
  scheduleKey: string | null;
  filterSearchParams: ScheduleSearchFilterParams;
}

export function parseHomeRouteContext(
  params: HomePageSearchParams
): HomeRouteContext {
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

  const filterSearchParams: ScheduleSearchFilterParams = {
    week: params?.week,
    subgroup: params?.subgroup,
    fDay: params?.fDay,
    fSubject: params?.fSubject,
    fType: params?.fType,
    fAuditory: params?.fAuditory,
    fEmployee: params?.fEmployee,
  };

  return {
    params,
    rawGroupNumber,
    groupNumber,
    invalidGroupError,
    rawCompareGroup,
    compareGroupNumber,
    invalidCompareGroupError,
    employeeUrlId,
    departmentId,
    showDepartmentPassport,
    rawScheduleRequested,
    scheduleMode,
    scheduleKey,
    filterSearchParams,
  };
}

/**
 * Query-параметры для ключа `AnnouncementsUiProvider`, кроме `announcements` и `departmentId`:
 * переключение панели и выбор кафедры не должны вызывать полный remount клиентского дерева.
 */
export function buildAnnouncementsUiRouteKey(
  params: HomePageSearchParams | undefined
): string {
  if (!params) return "";
  return [
    params.group ?? "",
    params.employee ?? "",
    params.week ?? "",
    params.rawSchedule ?? "",
    params.fDay ?? "",
    params.fSubject ?? "",
    params.fType ?? "",
    params.fAuditory ?? "",
    params.fEmployee ?? "",
    params.subgroup ?? "",
    params.examTypes ?? "",
    params.compareGroup ?? "",
  ].join("\x1e");
}
