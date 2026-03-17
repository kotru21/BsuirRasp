import { PageErrorToasts } from "@/features/notifications";
import { Header } from "@/widgets/header";
import { ScheduleView } from "./ScheduleView";
import type { Employee } from "@/entities/employee";
import type { StudentGroup } from "@/entities/student-group";
import type { NormalizedScheduleResponse } from "@/entities/schedule";

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
}: HomePageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <PageErrorToasts
        groupsError={groupsError}
        employeesError={employeesError}
        scheduleError={scheduleError}
        currentWeekError={currentWeekError}
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
