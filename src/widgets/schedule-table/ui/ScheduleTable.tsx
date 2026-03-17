"use client";

import {
  SCHEDULE_DAY_KEYS,
  filterLessonsByWeek,
  filterLessonsBySubgroup,
  type NormalizedScheduleResponse,
  type ScheduleDayKey,
  type ScheduleLesson,
  type SubgroupFilter,
} from "@/entities/schedule";
import { ClockIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { LessonCard } from "./LessonCard";

interface ScheduleTableProps {
  schedule: NormalizedScheduleResponse | null;
  weekNumber: number;
  subgroupFilter?: SubgroupFilter;
  showStudentGroups?: boolean;
  className?: string;
}

type TimeSlot = string;

function getTimeSlots(
  schedule: NormalizedScheduleResponse,
  weekNumber: number,
  subgroupFilter: SubgroupFilter
): TimeSlot[] {
  const times = new Set<string>();
  const { schedules } = schedule;
  for (const day of SCHEDULE_DAY_KEYS) {
    const byWeek = filterLessonsByWeek(schedules[day] ?? [], weekNumber);
    const bySubgroup = filterLessonsBySubgroup(byWeek, subgroupFilter);
    for (const lesson of bySubgroup) {
      times.add(lesson.startLessonTime);
    }
  }
  return Array.from(times).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function getLessonsAt(
  schedule: NormalizedScheduleResponse,
  day: ScheduleDayKey,
  timeSlot: TimeSlot,
  weekNumber: number,
  subgroupFilter: SubgroupFilter
): ScheduleLesson[] {
  const byWeek = filterLessonsByWeek(schedule.schedules[day] ?? [], weekNumber);
  const bySubgroup = filterLessonsBySubgroup(byWeek, subgroupFilter);
  return bySubgroup.filter((l) => l.startLessonTime === timeSlot);
}

function EmptyCell() {
  return (
    <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-transparent p-3 text-muted-foreground/30">
      —
    </div>
  );
}

export function ScheduleTable({
  schedule,
  weekNumber,
  subgroupFilter = "all",
  showStudentGroups = false,
  className,
}: ScheduleTableProps) {
  if (!schedule) {
    return (
      <div
        className={cn(
          "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50",
          className
        )}
      >
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <ClockIcon className="size-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Расписание не выбрано</h2>
          <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            Воспользуйтесь поиском в шапке сайта, чтобы найти расписание вашей группы.
          </p>
        </div>
      </div>
    );
  }

  const timeSlots = getTimeSlots(schedule, weekNumber, subgroupFilter);

  if (timeSlots.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50",
          className
        )}
      >
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <ClockIcon className="size-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Нет занятий</h2>
          <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            На {weekNumber}-й неделе у этой группы нет пар. Можно отдыхать!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-24 px-4 py-3 text-left font-medium text-muted-foreground">Время</th>
              {SCHEDULE_DAY_KEYS.map((day) => (
                <th
                  key={day}
                  className="min-w-[240px] px-4 py-3 text-center font-medium text-muted-foreground"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot} className="group/row transition-colors hover:bg-muted/20">
                <td className="sticky left-0 z-10 border-r bg-background/95 p-4 align-top backdrop-blur group-hover/row:bg-muted/20 supports-backdrop-filter:bg-background/60">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <ClockIcon className="size-4 text-muted-foreground" />
                    {timeSlot}
                  </div>
                </td>
                {SCHEDULE_DAY_KEYS.map((day) => {
                  const lessons = getLessonsAt(schedule, day, timeSlot, weekNumber, subgroupFilter);
                  return (
                    <td key={day} className="p-2 align-top">
                      {lessons.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {lessons.map((lesson, idx) => (
                            <LessonCard
                              key={idx}
                              lesson={lesson}
                              showStudentGroups={showStudentGroups}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyCell />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
