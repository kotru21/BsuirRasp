/** Дни недели в ответе API (ключи schedules) */
export const SCHEDULE_DAY_KEYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
] as const;

export type ScheduleDayKey = (typeof SCHEDULE_DAY_KEYS)[number];

export interface ScheduleEmployee {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  photoLink: string | null;
  urlId: string;
  degree?: string;
  degreeAbbrev?: string;
  rank?: string | null;
  email?: string | null;
  calendarId?: string;
  jobPositions?: unknown;
}

export interface StudentGroupInSchedule {
  name: string;
  specialityName: string;
  specialityCode: string;
  numberOfStudents: number;
  educationDegree: number;
}

/** Одна пара (занятие или экзамен) */
export interface ScheduleLesson {
  weekNumber: number[];
  studentGroups: StudentGroupInSchedule[];
  numSubgroup: number;
  auditories: string[];
  startLessonTime: string;
  endLessonTime: string;
  subject: string;
  subjectFullName: string;
  note: string | null;
  lessonTypeAbbrev: string;
  dateLesson: string | null;
  startLessonDate: string | null;
  endLessonDate: string | null;
  announcement?: boolean;
  split?: boolean;
  employees: ScheduleEmployee[] | null;
}

export interface StudentGroupDto {
  id: number;
  name: string;
  facultyId: number;
  facultyAbbrev: string;
  specialityDepartmentEducationFormId: number;
  specialityName: string;
  specialityAbbrev: string;
  course: number;
  calendarId: string;
  educationDegree: number;
}

/** Ответ API расписания группы (или преподавателя) */
export interface ScheduleResponse {
  employeeDto: unknown | null;
  studentGroupDto: StudentGroupDto | null;
  /** Может быть null при пустом расписании */
  schedules: Record<ScheduleDayKey, ScheduleLesson[]> | null;
  exams: ScheduleLesson[];
  startDate: string | null;
  endDate: string | null;
  startExamsDate: string | null;
  endExamsDate: string | null;
}
