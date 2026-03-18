import { bsuirClient } from "@/shared/api";
import type { Announcement } from "../model/types";

export async function getAnnouncementsByEmployee(
  urlId: string
): Promise<Announcement[]> {
  return bsuirClient.announcements.byEmployee(urlId);
}

export async function getAnnouncementsByDepartment(
  id: number
): Promise<Announcement[]> {
  return bsuirClient.announcements.byDepartment(id);
}

