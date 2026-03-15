"use client";

import { WeekSwitcher, useWeekNumber } from "@/features/week-switcher";
import { ScheduleTable } from "@/widgets/schedule-table";
import type { NormalizedScheduleResponse } from "@/entities/schedule";

interface ScheduleViewProps {
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
}

export function ScheduleView({ schedule, currentWeek }: ScheduleViewProps) {
  const { weekNumber, setWeekNumber, minWeek, maxWeek } = useWeekNumber({
    defaultWeek: currentWeek,
    minWeek: 1,
    maxWeek: 4,
  });

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {schedule && (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Группа {schedule.studentGroupDto?.name}
            </h2>
            <p className="text-muted-foreground">{schedule.studentGroupDto?.specialityName}</p>
          </div>
          <WeekSwitcher
            weekNumber={weekNumber}
            setWeekNumber={setWeekNumber}
            minWeek={minWeek}
            maxWeek={maxWeek}
            currentWeek={currentWeek}
          />
        </div>
      )}
      <ScheduleTable schedule={schedule} weekNumber={weekNumber} />
    </div>
  );
}
