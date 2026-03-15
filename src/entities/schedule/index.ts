export type {
  ScheduleResponse,
  ScheduleLesson,
  ScheduleDayKey,
  ScheduleEmployee,
  StudentGroupDto,
  StudentGroupInSchedule,
} from "./model/types";
export { SCHEDULE_DAY_KEYS } from "./model/types";
export { filterLessonsByWeek } from "./model/filter-by-week";
export { getGroupSchedule } from "./api/schedule";
