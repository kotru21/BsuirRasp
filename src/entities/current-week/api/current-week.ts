import { bsuirClient } from "@/shared/api";

/** Номер текущей недели в 4-недельном цикле (1–4). */
export async function getCurrentWeek(): Promise<number> {
  return bsuirClient.currentWeek.getCycle();
}
