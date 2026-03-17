import { Skeleton } from "@/shared/ui";
import { ScheduleTableSkeleton } from "@/widgets/schedule-table";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-44 shrink-0" />
          <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
            <Skeleton className="h-9 w-[200px] sm:w-[280px]" />
            <Skeleton className="size-9 rounded-md" />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </div>

        <ScheduleTableSkeleton />
      </div>
    </main>
  );
}
