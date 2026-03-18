import { PageErrorToasts } from "@/features/notifications";
import { Header } from "@/widgets/header";
import { ScheduleView } from "./ScheduleView";
import type { Employee, StudentGroup, NormalizedScheduleResponse } from "@/entities";

interface HomePageProps {
  groups: StudentGroup[];
  employees: Employee[];
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
  lastUpdateDate?: string | null;
  groupsError?: string | null;
  employeesError?: string | null;
  scheduleError?: string | null;
  currentWeekError?: string | null;
  lastUpdateError?: string | null;
}

export function HomePage({
  groups,
  employees,
  schedule,
  currentWeek,
  lastUpdateDate,
  groupsError,
  employeesError,
  scheduleError,
  currentWeekError,
  lastUpdateError,
}: HomePageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <PageErrorToasts
        groupsError={groupsError}
        employeesError={employeesError}
        scheduleError={scheduleError}
        currentWeekError={currentWeekError}
        lastUpdateError={lastUpdateError}
      />
      <Header groups={groups} employees={employees} />
      <ScheduleView
        schedule={schedule}
        currentWeek={currentWeek}
        lastUpdateDate={lastUpdateDate}
      />
    </main>
  );
}
