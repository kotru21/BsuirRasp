import { bsuirClient } from "@/shared/api";
import type { NormalizedScheduleResponse } from "../model/types";

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
