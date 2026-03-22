import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
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
        <div
          className={cn(
            "mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] px-4 py-1.5 [grid-template-areas:'hdr-title_hdr-actions'_'hdr-search_hdr-search']",
            "max-md:items-center max-md:gap-x-2 max-md:gap-y-1.5 md:gap-4 md:py-2",
            "md:min-h-16 md:grid-cols-[auto_minmax(0,1fr)_auto] md:grid-rows-1 md:items-center md:[grid-template-areas:'hdr-title_hdr-search_hdr-actions']",
            "lg:px-8"
          )}
        >
          <div className="flex min-w-0 flex-col gap-1 [grid-area:hdr-title]">
            <Skeleton className="h-5 w-36 md:h-6 md:w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1 [grid-area:hdr-actions] md:gap-2">
            <div className="flex items-center gap-1 md:hidden">
              <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
              <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
              <Skeleton className="size-10 shrink-0 rounded-md" />
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <Skeleton className="h-9 w-[8.5rem] shrink-0 rounded-md" />
              <Skeleton className="h-9 w-28 shrink-0 rounded-md" />
              <Skeleton className="size-9 shrink-0 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-full min-w-0 [grid-area:hdr-search] md:h-9 md:max-w-md lg:max-w-lg" />
        </div>
      </header>

      <div className="relative overflow-hidden border-b border-border bg-background text-foreground dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="relative">
          <section className="px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <Skeleton className="h-3 w-28 dark:bg-white/10" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full max-w-2xl sm:h-14 dark:bg-white/10" />
                <Skeleton className="h-10 w-full max-w-xl sm:h-12 dark:bg-white/10" />
                <Skeleton className="h-5 w-full max-w-lg dark:bg-white/10" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-11 w-44 rounded-full dark:bg-white/10" />
                <Skeleton className="h-11 w-36 rounded-full dark:bg-white/10" />
                <Skeleton className="h-11 w-24 rounded-full dark:bg-white/10" />
                <Skeleton className="h-11 w-28 rounded-full dark:bg-white/10" />
              </div>
              <div className="flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
                <Skeleton className="h-12 min-h-12 flex-1 rounded-xl dark:bg-white/10" />
                <Skeleton className="h-4 w-16 sm:shrink-0 dark:bg-white/10" />
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border pt-8 dark:border-white/10">
                <Skeleton className="h-9 w-24 rounded-full dark:bg-white/10" />
                <Skeleton className="h-9 w-36 rounded-full dark:bg-white/10" />
                <Skeleton className="h-9 w-32 rounded-full dark:bg-white/10" />
                <Skeleton className="h-9 w-28 rounded-full dark:bg-white/10" />
              </div>
            </div>
          </section>

          <section className="border-t border-border px-4 py-12 sm:px-6 lg:px-8 dark:border-white/10">
            <div className="mx-auto max-w-7xl space-y-6">
              <Skeleton className="h-3 w-24 dark:bg-white/10" />
              <Skeleton className="h-8 w-48 sm:h-9 sm:w-56 dark:bg-white/10" />
              <Skeleton className="h-4 w-full max-w-xl dark:bg-white/10" />
              <div className="overflow-hidden rounded-2xl border border-border bg-muted/50 dark:border-white/10 dark:bg-black/40">
                <div className="flex border-b border-border px-4 py-3 sm:px-5 dark:border-white/10">
                  <Skeleton className="h-4 w-32 dark:bg-white/10" />
                  <div className="ml-auto">
                    <Skeleton className="h-9 w-36 rounded-full dark:bg-white/10" />
                  </div>
                </div>
                <div className="space-y-3 p-5 sm:p-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full max-w-2xl dark:bg-white/10" />
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
