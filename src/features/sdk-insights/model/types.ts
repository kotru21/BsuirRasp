import type {
  Announcement,
  Auditory,
  Department,
  Employee,
  NormalizedScheduleResponse,
  Faculty,
  FlattenedScheduleLesson,
  Speciality,
  StudentGroup,
} from "@/entities";

export interface SdkInsightsData {
  references: {
    faculties: number;
    departments: number;
    specialities: number;
    auditories: number;
  };
  weeks: {
    currentWeek: number | null;
  };
  schedule: {
    examsCount: number | null;
    currentWeekLessons: number | null;
    subgroup1Lessons: number | null;
    subgroup2Lessons: number | null;
  };
  announcements: {
    employeeCount: number;
    departmentCount: number;
    employeeItems: Announcement[];
    departmentItems: Announcement[];
  };
  raw: {
    pageContext: {
      group: string | null;
      employee: string | null;
      week: string | null;
      departmentId: number | null;
      scheduleMode: "group" | "employee" | null;
      scheduleKey: string | null;
    };
    pageData: {
      groups: StudentGroup[];
      employees: Employee[];
      schedule: NormalizedScheduleResponse | null;
      currentWeek: number | null;
      lastUpdateDate: string | null;
    };
    pageErrors: {
      groupsError: string | null;
      employeesError: string | null;
      scheduleError: string | null;
      currentWeekError: string | null;
      lastUpdateError: string | null;
      sdkInsightsError: string | null;
    };
    faculties: Faculty[];
    departments: Department[];
    specialities: Speciality[];
    auditories: Auditory[];
    exams: FlattenedScheduleLesson[];
    filteredCurrentWeek: FlattenedScheduleLesson[];
    subgroup1: FlattenedScheduleLesson[];
    subgroup2: FlattenedScheduleLesson[];
    lastUpdateDate: string | null;
  };
}

export interface SummaryRow {
  label: string;
  value: number | null | boolean;
}

export interface SummarySection {
  title: string;
  rows: SummaryRow[];
}

