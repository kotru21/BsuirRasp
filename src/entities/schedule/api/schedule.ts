import { api } from "@/shared/api";
import type { ScheduleResponse } from "../model/types";

export async function getGroupSchedule(groupNumber: string): Promise<ScheduleResponse> {
  const params = new URLSearchParams({ studentGroup: groupNumber });
  return api.get<ScheduleResponse>(`/schedule?${params.toString()}`);
}
