import { bsuirClient } from "@/shared/api";

/**
 * Легаси-эндпоинт ИИС; для части групп ответа нет (404). Дата при успехе может
 * не соответствовать реальности — см. JSDoc `bsuir-iis-api` на `getLastUpdateByGroup`.
 */
export async function getScheduleLastUpdate(
  groupNumber: string
): Promise<string> {
  return getLastUpdateByGroup({ groupNumber });
}

/**
 * Легаси-эндпоинт ИИС; см. `getLastUpdateByEmployee` в `bsuir-iis-api`.
 */
export async function getScheduleLastUpdateByEmployee(
  urlId: string
): Promise<string> {
  return getLastUpdateByEmployee({ urlId });
}

/** Легаси last-update ИИС по группе (`groupNumber` или numeric `id` в SDK). */
export async function getLastUpdateByGroup(
  params: { groupNumber: string } | { id: number }
): Promise<string> {
  const { lastUpdateDate } =
    await bsuirClient.schedule.getLastUpdateByGroup(params);
  return lastUpdateDate;
}

/** Легаси last-update ИИС по преподавателю (`urlId` или numeric `id` в SDK). */
export async function getLastUpdateByEmployee(
  params: { urlId: string } | { id: number }
): Promise<string> {
  const { lastUpdateDate } =
    await bsuirClient.schedule.getLastUpdateByEmployee(params);
  return lastUpdateDate;
}
