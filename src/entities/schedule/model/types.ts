import type {
  NormalizedScheduleResponse as BsuirNormalizedScheduleResponse,
  ScheduleItem,
  ScheduleResponse as BsuirScheduleResponse,
  Weekday,
} from "bsuir-iis-api";

/** Дни недели в ответе API (ключи schedules) */
export const SCHEDULE_DAY_KEYS: Weekday[] = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export type ScheduleDayKey = Weekday;
export type ScheduleLesson = ScheduleItem;
export type ScheduleResponse = BsuirScheduleResponse;
/** Нормализованный ответ: schedules всегда объект (не null). */
export type NormalizedScheduleResponse = BsuirNormalizedScheduleResponse;

export type { ScheduleItem, Weekday } from "bsuir-iis-api";
