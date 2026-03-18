"use client";

import { WeekSwitcher, useWeekNumber } from "@/features/week-switcher";
import { SubgroupSwitcher, useSubgroup } from "@/features/subgroup-switcher";
import { ScheduleTable } from "@/widgets/schedule-table";
import type { NormalizedScheduleResponse } from "@/entities";

interface ScheduleViewProps {
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
  lastUpdateDate?: string | null;
}

function formatLastUpdate(dateStr: string): string {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("ru-RU");
}

export function ScheduleView({
  schedule,
  currentWeek,
  lastUpdateDate,
}: ScheduleViewProps) {
  const isEmployeeSchedule = Boolean(schedule?.employeeDto);
  const { weekNumber, setWeekNumber, minWeek, maxWeek } = useWeekNumber({
    defaultWeek: currentWeek,
    minWeek: 1,
    maxWeek: 4,
  });
  const { subgroupFilter, setSubgroupFilter } = useSubgroup();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {schedule && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              {schedule.studentGroupDto ? (
                <>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Группа {schedule.studentGroupDto.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {schedule.studentGroupDto.specialityName}
                  </p>
                </>
              ) : schedule.employeeDto ? (
                <>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Преподаватель{" "}
                    {[
                      schedule.employeeDto.lastName,
                      schedule.employeeDto.firstName,
                      schedule.employeeDto.middleName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </h2>
                  {(schedule.employeeDto.rank || schedule.employeeDto.degree) && (
                    <p className="text-muted-foreground">
                      {[schedule.employeeDto.rank, schedule.employeeDto.degree]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </>
              ) : (
                <h2 className="text-2xl font-bold tracking-tight">Расписание</h2>
              )}
              {lastUpdateDate && (
                <p className="mt-0.5 text-xs text-muted-foreground" title="ИИС может выдавать странные значения">
                  Обновлено: {formatLastUpdate(lastUpdateDate)} (ИИС может выдавать странные значения)
                </p>
              )}
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <WeekSwitcher
                weekNumber={weekNumber}
                setWeekNumber={setWeekNumber}
                minWeek={minWeek}
                maxWeek={maxWeek}
                currentWeek={currentWeek}
              />
              {!isEmployeeSchedule && (
                <SubgroupSwitcher
                  subgroupFilter={subgroupFilter}
                  setSubgroupFilter={setSubgroupFilter}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <ScheduleTable
        schedule={schedule}
        weekNumber={weekNumber}
        subgroupFilter={isEmployeeSchedule ? "all" : subgroupFilter}
        showStudentGroups={isEmployeeSchedule}
      />
    </div>
  );
}
