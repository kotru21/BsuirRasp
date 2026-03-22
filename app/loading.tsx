import { HomePageSkeleton } from "@/widgets/home-page-skeleton";
import { ScheduleTableSkeleton } from "@/widgets/schedule-table";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HomePageSkeleton scheduleTableSection={<ScheduleTableSkeleton />} />
    </main>
  );
}
