import type { ScheduleFilterOptions } from "@/entities";
import { SCHEDULE_DAY_KEYS } from "@/entities";
import type { Weekday } from "bsuir-iis-api";

const DAY_CODE: Record<string, Weekday> = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
};

const VALID_WEEKDAYS = new Set<string>(SCHEDULE_DAY_KEYS);

export interface ScheduleSearchFilterParams {
  week?: string;
  subgroup?: string;
  /** Короткий код дня: mon, tue, … */
  fDay?: string;
  fSubject?: string;
  fType?: string;
  fAuditory?: string;
  /** urlId преподавателя (для расписания группы) */
  fEmployee?: string;
}

export function parseEffectiveWeek(
  weekParam: string | undefined,
  fallbackCurrentWeek: number,
  minWeek = 1,
  maxWeek = 4
): number {
  if (!weekParam) return fallbackCurrentWeek;
  const n = Number.parseInt(weekParam, 10);
  if (!Number.isInteger(n)) return fallbackCurrentWeek;
  return Math.max(minWeek, Math.min(maxWeek, n));
}

/** true, если нужен отдельный запрос get*Filtered для таблицы (не только client-side). */
export function hasAdvancedScheduleFilterParams(params: ScheduleSearchFilterParams): boolean {
  const d = params.fDay?.trim();
  const subj = params.fSubject?.trim();
  const typ = params.fType?.trim();
  const aud = params.fAuditory?.trim();
  const emp = params.fEmployee?.trim();
  return Boolean(d || subj || typ || aud || emp);
}

function resolveWeekday(code: string | undefined): Weekday | undefined {
  if (!code?.trim()) return undefined;
  const t = code.trim();
  if (VALID_WEEKDAYS.has(t)) return t as Weekday;
  const mapped = DAY_CODE[t.toLowerCase()];
  return mapped;
}

/**
 * Опции для client.schedule.getGroupFiltered / getEmployeeFiltered.
 */
export function buildScheduleFilterOptions(
  params: ScheduleSearchFilterParams,
  weekNumber: number
): ScheduleFilterOptions {
  const filter: ScheduleFilterOptions = {
    source: "schedules",
    weekNumber,
  };

  const sg = params.subgroup;
  if (sg === "1" || sg === "2") {
    filter.subgroup = Number(sg);
  }

  const weekday = resolveWeekday(params.fDay);
  if (weekday) filter.weekday = weekday;

  const subj = params.fSubject?.trim();
  if (subj) filter.subjectQuery = subj;

  const typ = params.fType?.trim();
  if (typ) filter.lessonTypeAbbrev = typ;

  const aud = params.fAuditory?.trim();
  if (aud) filter.auditory = aud;

  const emp = params.fEmployee?.trim();
  if (emp && /^[a-zA-Z0-9-]+$/.test(emp)) {
    filter.employeeUrlId = emp;
  }

  return filter;
}

export { DAY_CODE };
