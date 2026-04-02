import "server-only";

export { getStudentGroups } from "./student-group/api/student-groups";
export { getEmployees } from "./employee/api/employees";
export { getCurrentWeek } from "./current-week/api/current-week";
export { getFaculties } from "./faculty/api/faculties";
export { getDepartments } from "./department/api/departments";
export { getSpecialities } from "./speciality/api/specialities";
export { getAuditories } from "./auditory/api/auditories";
export {
  getAnnouncementsByEmployee,
  getAnnouncementsByDepartment,
} from "./announcement/api/announcements";
export {
  getGroupSchedule,
  getEmployeeSchedule,
  getGroupScheduleRaw,
  getEmployeeScheduleRaw,
  getGroupScheduleFiltered,
  getEmployeeScheduleFiltered,
  getGroupExams,
  getEmployeeExams,
  getGroupScheduleBySubgroup,
  getEmployeeScheduleBySubgroup,
} from "./schedule/api/schedule";
export {
  getScheduleLastUpdate,
  getScheduleLastUpdateByEmployee,
  getLastUpdateByGroup,
  getLastUpdateByEmployee,
  isScheduleLastUpdateUnavailable,
} from "./schedule/api/last-update";

export type { ScheduleResponse } from "bsuir-iis-api";
