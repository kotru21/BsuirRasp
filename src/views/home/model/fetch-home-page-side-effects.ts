import {
  getEmployeeScheduleRaw,
  getGroupScheduleRaw,
  getLastUpdateByEmployee,
  getLastUpdateByGroup,
  isScheduleLastUpdateUnavailable,
  type NormalizedScheduleResponse,
} from "@/entities";
import { getBsuirErrorMessage } from "@/shared/api";

export interface LastUpdateByNumericIdState {
  date: string | null;
  error: string | null;
  matchesStringKey: boolean | null;
}

export async function fetchRawScheduleIfRequested(input: {
  rawScheduleRequested: boolean;
  scheduleMode: "employee" | "group" | null;
  scheduleKey: string | null;
}): Promise<{
  rawSchedulePayload: Awaited<ReturnType<typeof getGroupScheduleRaw>> | null;
  rawScheduleError: string | null;
}> {
  const { rawScheduleRequested, scheduleMode, scheduleKey } = input;
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
  return { rawSchedulePayload, rawScheduleError };
}

export async function resolveLastUpdateByNumericId(input: {
  loadedSchedule: NormalizedScheduleResponse | null;
  scheduleMode: "employee" | "group" | null;
  lastUpdateDate: string | null;
}): Promise<LastUpdateByNumericIdState> {
  const { loadedSchedule, scheduleMode, lastUpdateDate } = input;
  const lastUpdateByNumericId: LastUpdateByNumericIdState = {
    date: null,
    error: null,
    matchesStringKey: null,
  };

  if (
    loadedSchedule &&
    scheduleMode === "group" &&
    loadedSchedule.studentGroupDto?.id != null
  ) {
    try {
      const d = await getLastUpdateByGroup({
        id: loadedSchedule.studentGroupDto.id,
      });
      lastUpdateByNumericId.date = d;
      lastUpdateByNumericId.matchesStringKey =
        lastUpdateDate != null && d === lastUpdateDate;
    } catch (e) {
      if (!isScheduleLastUpdateUnavailable(e)) {
        lastUpdateByNumericId.error = getBsuirErrorMessage(e);
      }
    }
  } else if (
    loadedSchedule &&
    scheduleMode === "employee" &&
    loadedSchedule.employeeDto?.id != null
  ) {
    try {
      const d = await getLastUpdateByEmployee({
        id: loadedSchedule.employeeDto.id,
      });
      lastUpdateByNumericId.date = d;
      lastUpdateByNumericId.matchesStringKey =
        lastUpdateDate != null && d === lastUpdateDate;
    } catch (e) {
      if (!isScheduleLastUpdateUnavailable(e)) {
        lastUpdateByNumericId.error = getBsuirErrorMessage(e);
      }
    }
  }

  return lastUpdateByNumericId;
}
