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

/**
 * То же, что getScheduleLastUpdate(), но через namespace client.lastUpdate.byGroup.
 */
export async function getLastUpdateByGroup(
  params: { groupNumber: string } | { id: number }
): Promise<string> {
  const { lastUpdateDate } = await bsuirClient.lastUpdate.byGroup(params);
  return lastUpdateDate;
}

/**
 * То же, что getScheduleLastUpdateByEmployee(), но через namespace client.lastUpdate.byEmployee.
 */
export async function getLastUpdateByEmployee(
  params: { urlId: string } | { id: number }
): Promise<string> {
  const { lastUpdateDate } = await bsuirClient.lastUpdate.byEmployee(params);
  return lastUpdateDate;
}
