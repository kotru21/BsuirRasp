import { bsuirClient } from "@/shared/api";
import type { Announcement } from "../model/types";

/**
 * Объявления преподавателя. В bsuir-iis-api ≥0.6.5 ответы ИИС с HTTP 404 и 400
 * для списка объявлений приводятся к пустому массиву (см. SDK `requestAnnouncementList`).
 */
export async function getAnnouncementsByEmployee(urlId: string): Promise<Announcement[]> {
  return bsuirClient.announcements.byEmployee(urlId);
}

/**
 * Объявления кафедры. Как у `byEmployee`: HTTP 404 / 400 от ИИС → `[]` (bsuir-iis-api ≥0.6.5).
 */
export async function getAnnouncementsByDepartment(id: number): Promise<Announcement[]> {
  return bsuirClient.announcements.byDepartment(id);
}
