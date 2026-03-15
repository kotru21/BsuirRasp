"use client";

import { cn } from "@/shared/lib/utils";

interface WeekSwitcherProps {
  weekNumber: number;
  setWeekNumber: (week: number) => void;
  minWeek: number;
  maxWeek: number;
  /** Номер текущей недели в семестре (для подписи «текущая») */
  currentWeek?: number;
  className?: string;
}

export function WeekSwitcher({
  weekNumber,
  setWeekNumber,
  minWeek,
  maxWeek,
  currentWeek,
  className,
}: WeekSwitcherProps) {
  const weeks = Array.from({ length: maxWeek - minWeek + 1 }, (_, i) => minWeek + i);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {weeks.map((w) => {
        const isActive = weekNumber === w;
        const isCurrent = currentWeek !== undefined && w === currentWeek;

        return (
          <button
            key={w}
            onClick={() => setWeekNumber(w)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            )}
          >
            {w} неделя
            {isCurrent && (
              <span className="ml-1.5 flex size-2 rounded-full bg-primary" title="Текущая неделя" />
            )}
          </button>
        );
      })}
    </div>
  );
}
