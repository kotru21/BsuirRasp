import { bsuirClient } from "@/shared/api";

/**
 * Дата последнего обновления расписания группы (строка от API, например ISO).
 */
export async function getScheduleLastUpdate(
  groupNumber: string
): Promise<string> {
  const { lastUpdateDate } = await bsuirClient.schedule.getLastUpdateByGroup({
    groupNumber,
  });
  return lastUpdateDate;
}

/**
 * Дата последнего обновления расписания преподавателя.
 */
export async function getScheduleLastUpdateByEmployee(
  urlId: string
): Promise<string> {
  const { lastUpdateDate } = await bsuirClient.schedule.getLastUpdateByEmployee({
    urlId,
  });
  return lastUpdateDate;
}
