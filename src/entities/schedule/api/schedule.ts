import type { ScheduleResponse } from "bsuir-iis-api";
import { bsuirClient } from "@/shared/api";
import type {
  NormalizedScheduleResponse,
  FlattenedScheduleLesson,
  ScheduleFilterOptions,
} from "../model/types";

export async function getGroupSchedule(
  groupNumber: string
): Promise<NormalizedScheduleResponse> {
  return bsuirClient.schedule.getGroup(groupNumber);
}

export async function getEmployeeSchedule(
  urlId: string
): Promise<NormalizedScheduleResponse> {
  return bsuirClient.schedule.getEmployee(urlId);
}

export async function getGroupScheduleFiltered(
  groupNumber: string,
  filter: ScheduleFilterOptions
): Promise<FlattenedScheduleLesson[]> {
  return bsuirClient.schedule.getGroupFiltered(groupNumber, filter);
}

export async function getEmployeeScheduleFiltered(
  urlId: string,
  filter: ScheduleFilterOptions
): Promise<FlattenedScheduleLesson[]> {
  return bsuirClient.schedule.getEmployeeFiltered(urlId, filter);
}

export async function getGroupExams(
  groupNumber: string
): Promise<FlattenedScheduleLesson[]> {
  return bsuirClient.schedule.getGroupExams(groupNumber);
}

export async function getEmployeeExams(
  urlId: string
): Promise<FlattenedScheduleLesson[]> {
  return bsuirClient.schedule.getEmployeeExams(urlId);
}

export async function getGroupScheduleBySubgroup(
  groupNumber: string,
  subgroup: number
): Promise<FlattenedScheduleLesson[]> {
  return bsuirClient.schedule.getGroupBySubgroup(groupNumber, subgroup);
}

export async function getEmployeeScheduleBySubgroup(
  urlId: string,
  subgroup: number
): Promise<FlattenedScheduleLesson[]> {
  return bsuirClient.schedule.getEmployeeBySubgroup(urlId, subgroup);
}

/** Сырой ответ API ИИС (`schedules` может быть `null`, см. README SDK). */
export async function getGroupScheduleRaw(
  groupNumber: string
): Promise<ScheduleResponse> {
  return bsuirClient.schedule.getGroup(groupNumber, { raw: true });
}

export async function getEmployeeScheduleRaw(
  urlId: string
): Promise<ScheduleResponse> {
  return bsuirClient.schedule.getEmployee(urlId, { raw: true });
}
