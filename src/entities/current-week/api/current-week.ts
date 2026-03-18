import { bsuirClient } from "@/shared/api";

/** Номер текущей недели в семестре (как в ИИС). */
export async function getCurrentSemesterWeek(): Promise<number> {
  return bsuirClient.currentWeek.get();
}

/** Номер текущей недели в 4-недельном цикле (1–4). */
export async function getCurrentWeek(): Promise<number> {
  return bsuirClient.currentWeek.getCycle();
}

/** Номер текущей недели в цикле с настраиваемой длиной. */
export async function getCurrentCycleWeek(
  weeksPerCycle?: number
): Promise<number> {
  return bsuirClient.currentWeek.getCycle({ weeksPerCycle });
}
