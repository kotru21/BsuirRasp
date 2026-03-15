import { api } from "@/shared/api";

/**
 * Номер текущей недели в семестре (1, 2, 3, 4, …).
 * Используется для фильтрации пар по полю weekNumber.
 */
export async function getCurrentWeek(): Promise<number> {
  return api.get<number>("/schedule/current-week");
}
