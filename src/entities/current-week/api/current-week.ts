import { bsuirClient } from "@/shared/api";

/** Единственный источник истины: текущая неделя из SDK (currentWeek.get()). */
export async function getCurrentWeek(): Promise<number> {
  return bsuirClient.currentWeek.get();
}
