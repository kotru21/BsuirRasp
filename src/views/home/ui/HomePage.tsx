import { CatalogShowcase } from "@/features/catalog-showcase";
import {
  AnnouncementsUiProvider,
  DepartmentPassportGate,
} from "@/features/department-passport";
import { PageErrorToasts } from "@/features/notifications";
import { SdkProductLanding } from "@/features/sdk-product-landing";
import { SdkQuickStartSection } from "@/features/sdk-quick-start";
import { SdkShowcaseHero } from "@/features/sdk-showcase-hero";
import { SdkInsights, type SdkInsightsData } from "@/features/sdk-insights";
import { Header } from "@/widgets/header";
import { SiteFooter } from "@/widgets/site-footer";
import { ApiShowcaseIntro } from "./ApiShowcaseIntro";
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

function employeeScheduleLabel(schedule: NormalizedScheduleResponse | null): string | null {
  const e = schedule?.employeeDto;
  if (!e) return null;
  return [e.lastName, e.firstName, e.middleName].filter(Boolean).join(" ");
}

export interface HomePageProps {
  announcementsUiRouteKey: string;
  groups: StudentGroup[];
  employees: Employee[];
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
  departments: Department[];
  selectedDepartmentId: number | null;
  departmentAnnouncements: Announcement[];
  showDepartmentPassport: boolean;
  groupsError?: string | null;
  employeesError?: string | null;
  scheduleError?: string | null;
  currentWeekError?: string | null;
  sdkInsightsError?: string | null;
  scheduleFilterError?: string | null;
  /** Ошибки запросов второй группы (`compareGroup`) — тост, страница жива */
  compareGroupError?: string | null;
  advancedFilterLessons?: FlattenedScheduleLesson[] | null;
  /** Плоский список из getGroupExams / getEmployeeExams */
  examLessons?: FlattenedScheduleLesson[];
  /** get*Filtered с source: "exams" и lessonTypeAbbrev */
  examFilteredLessons?: FlattenedScheduleLesson[];
  examLessonTypesLabel?: string;
  employeeAnnouncements: Announcement[];
  faculties: Faculty[];
  specialities: Speciality[];
  auditories: Auditory[];
  sdkInsights?: SdkInsightsData | null;
  compareGroupNumber?: string | null;
  compareSchedule?: NormalizedScheduleResponse | null;
  compareScheduleError?: string | null;
  compareExamLessons?: FlattenedScheduleLesson[];
  compareExamFilteredLessons?: FlattenedScheduleLesson[];
  compareAdvancedFilterLessons?: FlattenedScheduleLesson[] | null;
  compareScheduleFilterError?: string | null;
}

export function HomePage({
  announcementsUiRouteKey,
  groups,
  employees,
  schedule,
  currentWeek,
  departments,
  selectedDepartmentId,
  departmentAnnouncements,
  showDepartmentPassport,
  groupsError,
  employeesError,
  scheduleError,
  currentWeekError,
  sdkInsightsError,
  scheduleFilterError,
  compareGroupError,
  advancedFilterLessons,
  examLessons = [],
  examFilteredLessons = [],
  examLessonTypesLabel = "",
  employeeAnnouncements,
  faculties,
  specialities,
  auditories,
  sdkInsights,
  compareGroupNumber = null,
  compareSchedule = null,
  compareScheduleError = null,
  compareExamLessons = [],
  compareExamFilteredLessons = [],
  compareAdvancedFilterLessons = null,
  compareScheduleFilterError = null,
}: HomePageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <PageErrorToasts
        groupsError={groupsError}
        employeesError={employeesError}
        scheduleError={scheduleError}
        currentWeekError={currentWeekError}
        sdkInsightsError={sdkInsightsError}
        scheduleFilterError={scheduleFilterError}
        compareGroupError={compareGroupError}
      />
      <AnnouncementsUiProvider
        key={announcementsUiRouteKey}
        initialOpen={showDepartmentPassport}
      >
        <Header groups={groups} employees={employees} />
        <SdkProductLanding>
          <SdkShowcaseHero showJumpLinks />
          <SdkQuickStartSection />
        </SdkProductLanding>
        <DepartmentPassportGate
          departments={departments}
          selectedDepartmentId={selectedDepartmentId}
          announcements={departmentAnnouncements}
          employeeAnnouncements={employeeAnnouncements}
          employeeLabel={employeeScheduleLabel(schedule)}
          className="fixed right-4 bottom-4 z-40 w-[min(92vw,640px)] sm:right-6 sm:bottom-6"
        />
        <SdkInsights insights={sdkInsights ?? null} />
        <ApiShowcaseIntro />
        <ScheduleView
          schedule={schedule}
          currentWeek={currentWeek}
          advancedFilterLessons={advancedFilterLessons ?? null}
          examLessons={examLessons}
          examFilteredLessons={examFilteredLessons}
          examLessonTypesLabel={examLessonTypesLabel}
          employeeAnnouncements={employeeAnnouncements}
          showEmployeeUrlFilter={Boolean(schedule?.studentGroupDto)}
          compareGroupNumber={compareGroupNumber}
          compareSchedule={compareSchedule}
          compareScheduleError={compareScheduleError}
          compareExamLessons={compareExamLessons}
          compareExamFilteredLessons={compareExamFilteredLessons}
          compareAdvancedFilterLessons={compareAdvancedFilterLessons}
          compareScheduleFilterError={compareScheduleFilterError}
        />
        <CatalogShowcase
          groups={groups}
          employees={employees}
          faculties={faculties}
          departments={departments}
          specialities={specialities}
          auditories={auditories}
        />
        <SiteFooter />
      </AnnouncementsUiProvider>
    </main>
  );
}
