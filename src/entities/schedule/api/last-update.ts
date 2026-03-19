import { bsuirClient } from "@/shared/api";

/**
 * Дата последнего обновления расписания группы (строка от API, например ISO).
 */
export async function getScheduleLastUpdate(
  groupNumber: string
): Promise<string> {
  return getLastUpdateByGroup({ groupNumber });
}

/**
 * Дата последнего обновления расписания преподавателя.
 */
export async function getScheduleLastUpdateByEmployee(
  urlId: string
): Promise<string> {
  return getLastUpdateByEmployee({ urlId });
}

/**
 * Last update по группе: `groupNumber` или numeric `id` (как в SDK).
 */
export async function getLastUpdateByGroup(
  params: { groupNumber: string } | { id: number }
): Promise<string> {
  const { lastUpdateDate } =
    await bsuirClient.schedule.getLastUpdateByGroup(params);
  return lastUpdateDate;
}

/**
 * Last update по преподавателю: `urlId` или numeric `id` (как в SDK).
 */
export async function getLastUpdateByEmployee(
  params: { urlId: string } | { id: number }
): Promise<string> {
  const { lastUpdateDate } =
    await bsuirClient.schedule.getLastUpdateByEmployee(params);
  return lastUpdateDate;
}
