import type { ReactNode } from "react";
import { Skeleton } from "@/shared/ui";

function CatalogCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full max-w-sm" />
      <Skeleton className="h-9 w-full" />
      <div className="space-y-2 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

interface HomePageSkeletonProps {
  /** Вынесено в слой app: виджет не импортирует другой виджет (FSD). */
  scheduleTableSection: ReactNode;
}

export function HomePageSkeleton({ scheduleTableSection }: HomePageSkeletonProps) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2 lg:px-8">
          <div className="flex shrink-0 flex-col gap-1">
            <Skeleton className="h-5 w-36 sm:h-6 sm:w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
            <div className="flex items-center justify-between gap-2 sm:contents">
              <Skeleton className="h-11 w-34 shrink-0 sm:h-9" />
              <Skeleton className="h-11 w-28 shrink-0 sm:h-9" />
              <Skeleton className="size-11 shrink-0 rounded-md sm:size-9 sm:order-3" />
            </div>
            <Skeleton className="h-11 w-full min-w-0 sm:order-2 sm:max-w-md sm:flex-1 lg:max-w-lg" />
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden border-b border-white/10 bg-zinc-950 text-zinc-50">
        <div className="relative">
          <section className="px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <Skeleton onDark className="h-3 w-28" />
              <div className="space-y-4">
                <Skeleton onDark className="h-12 w-full max-w-2xl sm:h-14" />
                <Skeleton onDark className="h-10 w-full max-w-xl sm:h-12" />
                <Skeleton onDark className="h-5 w-full max-w-lg" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton onDark className="h-11 w-44 rounded-full" />
                <Skeleton onDark className="h-11 w-36 rounded-full" />
                <Skeleton onDark className="h-11 w-24 rounded-full" />
                <Skeleton onDark className="h-11 w-28 rounded-full" />
              </div>
              <div className="flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
                <Skeleton onDark className="h-12 min-h-12 flex-1 rounded-xl" />
                <Skeleton onDark className="h-4 w-16 sm:shrink-0" />
              </div>
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-8">
                <Skeleton onDark className="h-9 w-24 rounded-full" />
                <Skeleton onDark className="h-9 w-36 rounded-full" />
                <Skeleton onDark className="h-9 w-32 rounded-full" />
                <Skeleton onDark className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <Skeleton onDark className="h-3 w-24" />
              <Skeleton onDark className="h-8 w-48 sm:h-9 sm:w-56" />
              <Skeleton onDark className="h-4 w-full max-w-xl" />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div className="flex border-b border-white/10 px-4 py-3 sm:px-5">
                  <Skeleton onDark className="h-4 w-32" />
                  <div className="ml-auto">
                    <Skeleton onDark className="h-9 w-36 rounded-full" />
                  </div>
                </div>
                <div className="space-y-3 p-5 sm:p-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} onDark className="h-4 w-full max-w-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t-2 border-border bg-linear-to-b from-muted/40 to-background px-4 pt-14 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl border-b border-border/80 pb-10">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-72 max-w-full sm:h-9 sm:w-96" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <Skeleton className="h-9 w-full max-w-md rounded-lg" />
        {scheduleTableSection}
      </div>

      <section className="mx-auto w-full max-w-7xl space-y-8 border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-full max-w-xl" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
        </div>
      </section>

      <footer className="mt-auto border-t border-border/60 bg-muted/30 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-56" />
        </div>
      </footer>
    </>
  );
}
