import { bsuirClient } from "@/shared/api";

/** Текущая неделя из SDK (`schedule.getCurrentWeek()`, bsuir-iis-api ≥0.4). */
export async function getCurrentWeek(): Promise<number> {
  return bsuirClient.schedule.getCurrentWeek();
}
