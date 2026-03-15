import { Header } from "@/widgets/header";
import { ScheduleView } from "./ScheduleView";
import type { StudentGroup } from "@/entities/student-group";
import type { NormalizedScheduleResponse } from "@/entities/schedule";

interface HomePageProps {
  groups: StudentGroup[];
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
}

export function HomePage({ groups, schedule, currentWeek }: HomePageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <Header groups={groups} />
      <ScheduleView schedule={schedule} currentWeek={currentWeek} />
    </main>
  );
}
