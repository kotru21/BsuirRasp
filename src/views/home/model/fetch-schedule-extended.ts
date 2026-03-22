import {
  getAnnouncementsByEmployee,
  type Announcement,
} from "@/entities/announcement";
import {
  getEmployeeExams,
  getEmployeeScheduleBySubgroup,
  getEmployeeScheduleFiltered,
  getGroupExams,
  getGroupScheduleBySubgroup,
  getGroupScheduleFiltered,
  type ScheduleFilterOptions,
} from "@/entities/schedule";
import { getBsuirErrorMessage } from "@/shared/api";

export type ScheduleExtendedItemResult<T> = {
  items: T;
  error: string | null;
};

export type ScheduleExtendedResult = [
  ScheduleExtendedItemResult<Awaited<ReturnType<typeof getEmployeeExams>>>,
  ScheduleExtendedItemResult<Awaited<ReturnType<typeof getEmployeeScheduleFiltered>>>,
  ScheduleExtendedItemResult<Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>>,
  ScheduleExtendedItemResult<Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>>,
  ScheduleExtendedItemResult<Announcement[]>,
];

export async function fetchScheduleExtended(
  scheduleMode: "employee" | "group" | null,
  scheduleKey: string | null,
  filteredScheduleOptions: ScheduleFilterOptions
): Promise<ScheduleExtendedResult | null> {
  if (scheduleMode === "employee" && scheduleKey) {
    return Promise.all([
      getEmployeeExams(scheduleKey)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getEmployeeExams>>,
          error: getBsuirErrorMessage(e),
        })),
      getEmployeeScheduleFiltered(scheduleKey, filteredScheduleOptions)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getEmployeeScheduleFiltered>>,
          error: getBsuirErrorMessage(e),
        })),
      getEmployeeScheduleBySubgroup(scheduleKey, 1)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>,
          error: getBsuirErrorMessage(e),
        })),
      getEmployeeScheduleBySubgroup(scheduleKey, 2)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getEmployeeScheduleBySubgroup>>,
          error: getBsuirErrorMessage(e),
        })),
      getAnnouncementsByEmployee(scheduleKey)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Announcement[],
          error: getBsuirErrorMessage(e),
        })),
    ]);
  }

  if (scheduleMode === "group" && scheduleKey) {
    return Promise.all([
      getGroupExams(scheduleKey)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getGroupExams>>,
          error: getBsuirErrorMessage(e),
        })),
      getGroupScheduleFiltered(scheduleKey, filteredScheduleOptions)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getGroupScheduleFiltered>>,
          error: getBsuirErrorMessage(e),
        })),
      getGroupScheduleBySubgroup(scheduleKey, 1)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getGroupScheduleBySubgroup>>,
          error: getBsuirErrorMessage(e),
        })),
      getGroupScheduleBySubgroup(scheduleKey, 2)
        .then((items) => ({ items, error: null as string | null }))
        .catch((e) => ({
          items: [] as Awaited<ReturnType<typeof getGroupScheduleBySubgroup>>,
          error: getBsuirErrorMessage(e),
        })),
      Promise.resolve({
        items: [] as Announcement[],
        error: null as string | null,
      }),
    ]);
  }

  return null;
}
