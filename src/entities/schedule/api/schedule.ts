import { bsuirClient } from "@/shared/api";
import type { NormalizedScheduleResponse } from "../model/types";

export async function getGroupSchedule(
  groupNumber: string
): Promise<NormalizedScheduleResponse> {
  return bsuirClient.schedule.getGroup(groupNumber);
}
