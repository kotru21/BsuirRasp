import { Skeleton } from "@/shared/ui";

export function ScheduleTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-24 px-4 py-3 text-left">
                <Skeleton className="h-4 w-14" />
              </th>
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="min-w-[240px] px-4 py-3 text-center">
                  <Skeleton className="mx-auto h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="group/row">
                <td className="sticky left-0 z-10 border-r bg-background/95 p-4 align-top backdrop-blur supports-backdrop-filter:bg-background/60">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="size-4 rounded-sm" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </td>
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-2 align-top">
                    <div className="rounded-xl border border-border/50 bg-background/50 p-3">
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <Skeleton className="h-4 w-9" />
                          <Skeleton className="h-4 w-14" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-3/5" />
                        </div>
                        <div className="mt-auto space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Skeleton className="size-3.5 rounded-sm" />
                            <Skeleton className="h-3.5 w-2/3" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Skeleton className="size-3.5 rounded-sm" />
                            <Skeleton className="h-3.5 w-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

