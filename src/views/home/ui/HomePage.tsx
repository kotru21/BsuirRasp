import { CatalogShowcase } from "@/features/catalog-showcase";
import { DepartmentPassport } from "@/features/department-passport";
import { PageErrorToasts } from "@/features/notifications";
import { SdkInsights, type SdkInsightsData } from "@/features/sdk-insights";
import { Header } from "@/widgets/header";
import { ScheduleView } from "./ScheduleView";
import type {
  Announcement,
  Auditory,
  Department,
  Employee,
  Faculty,
  FlattenedScheduleLesson,
  NormalizedScheduleResponse,
  Speciality,
  StudentGroup,
} from "@/entities";

interface HomePageProps {
  groups: StudentGroup[];
  employees: Employee[];
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
  departments: Department[];
  selectedDepartmentId: number | null;
  departmentAnnouncements: Announcement[];
  showDepartmentPassport: boolean;
  lastUpdateDate?: string | null;
  groupsError?: string | null;
  employeesError?: string | null;
  scheduleError?: string | null;
  currentWeekError?: string | null;
  lastUpdateError?: string | null;
  sdkInsightsError?: string | null;
  scheduleFilterError?: string | null;
  advancedFilterLessons?: FlattenedScheduleLesson[] | null;
  /** Плоский список из getGroupExams / getEmployeeExams */
  examLessons?: FlattenedScheduleLesson[];
  employeeAnnouncements: Announcement[];
  faculties: Faculty[];
  specialities: Speciality[];
  auditories: Auditory[];
  sdkInsights?: SdkInsightsData | null;
}

export function HomePage({
  groups,
  employees,
  schedule,
  currentWeek,
  departments,
  selectedDepartmentId,
  departmentAnnouncements,
  showDepartmentPassport,
  lastUpdateDate,
  groupsError,
  employeesError,
  scheduleError,
  currentWeekError,
  lastUpdateError,
  sdkInsightsError,
  scheduleFilterError,
  advancedFilterLessons,
  examLessons = [],
  employeeAnnouncements,
  faculties,
  specialities,
  auditories,
  sdkInsights,
}: HomePageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <PageErrorToasts
        groupsError={groupsError}
        employeesError={employeesError}
        scheduleError={scheduleError}
        currentWeekError={currentWeekError}
        lastUpdateError={lastUpdateError}
        sdkInsightsError={sdkInsightsError}
        scheduleFilterError={scheduleFilterError}
      />
      <Header groups={groups} employees={employees} />
      {showDepartmentPassport && (
        <DepartmentPassport
          departments={departments}
          selectedDepartmentId={selectedDepartmentId}
          announcements={departmentAnnouncements}
          className="fixed right-4 bottom-4 z-40 w-[min(92vw,640px)] sm:right-6 sm:bottom-6"
        />
      )}
      <SdkInsights insights={sdkInsights ?? null} />
      <ScheduleView
        schedule={schedule}
        currentWeek={currentWeek}
        lastUpdateDate={lastUpdateDate}
        advancedFilterLessons={advancedFilterLessons ?? null}
        examLessons={examLessons}
        employeeAnnouncements={employeeAnnouncements}
        showEmployeeUrlFilter={Boolean(schedule?.studentGroupDto)}
      />
      <CatalogShowcase
        faculties={faculties}
        departments={departments}
        specialities={specialities}
        auditories={auditories}
      />
    </main>
  );
}
