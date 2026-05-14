"use client";

import {
  SCHEDULE_DAY_KEYS,
  filterLessonsByWeek,
  filterLessonsBySubgroup,
  type FlattenedScheduleLesson,
  type NormalizedScheduleResponse,
  type ScheduleDayKey,
  type ScheduleLesson,
  type SubgroupFilter,
} from "@/entities";
import { ClockIcon } from "lucide-react";
import { cn } from "@/shared/lib";
import { LessonCard } from "./LessonCard";

interface ScheduleTableProps {
  schedule: NormalizedScheduleResponse | null;
  weekNumber: number;
  subgroupFilter?: SubgroupFilter;
  showStudentGroups?: boolean;
  className?: string;
  /**
   * Результат getGroupFiltered / getEmployeeFiltered (плоский список).
   * Если задан — таблица строится по нему, а не по schedule.schedules.
   */
  flattenedLessons?: FlattenedScheduleLesson[] | null;
}

type TimeSlot = string;

const WEEKDAY_BY_JS_DAY: Array<ScheduleDayKey | null> = [
  null,
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

function resolveDayFromDate(value: string | null | undefined): ScheduleDayKey | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  let date: Date | null = null;

  const ddMmYyyy = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  const ddMmYyyyMatch = ddMmYyyy.exec(trimmed);
  if (ddMmYyyyMatch) {
    const day = Number.parseInt(ddMmYyyyMatch[1], 10);
    const month = Number.parseInt(ddMmYyyyMatch[2], 10);
    const year = Number.parseInt(ddMmYyyyMatch[3], 10);
    date = new Date(Date.UTC(year, month - 1, day));
  } else {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) return null;

  return WEEKDAY_BY_JS_DAY[date.getUTCDay()] ?? null;
}

function resolveFlattenedLessonDay(lesson: FlattenedScheduleLesson): ScheduleDayKey | null {
  return (
    lesson.day ??
    resolveDayFromDate(lesson.dateLesson) ??
    resolveDayFromDate(lesson.startLessonDate) ??
    resolveDayFromDate(lesson.endLessonDate)
  );
}

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

function getTimeSlotsFromFlattened(lessons: FlattenedScheduleLesson[]): TimeSlot[] {
  const times = new Set<string>();
  for (const l of lessons) {
    times.add(l.startLessonTime);
  }
  return Array.from(times).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function getFlattenedAt(
  lessons: FlattenedScheduleLesson[],
  day: ScheduleDayKey,
  timeSlot: TimeSlot
): FlattenedScheduleLesson[] {
  return lessons.filter(
    (l) => resolveFlattenedLessonDay(l) === day && l.startLessonTime === timeSlot
  );
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
  flattenedLessons = null,
}: ScheduleTableProps) {
  const flatLessons = flattenedLessons;
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

  const useFlat = flatLessons != null;
  const timeSlots = useFlat
    ? getTimeSlotsFromFlattened(flatLessons)
    : getTimeSlots(schedule, weekNumber, subgroupFilter);

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
            {useFlat
              ? "По выбранному фильтру SDK занятий нет. Смягчите условия или сбросьте фильтр."
              : `На ${weekNumber}-й неделе у этой группы нет пар. Можно отдыхать!`}
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
                  const lessons = useFlat
                    ? getFlattenedAt(flatLessons, day, timeSlot)
                    : getLessonsAt(schedule, day, timeSlot, weekNumber, subgroupFilter);
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
