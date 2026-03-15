"use client";

import {
  SCHEDULE_DAY_KEYS,
  filterLessonsByWeek,
  type ScheduleResponse,
  type ScheduleDayKey,
  type ScheduleLesson,
} from "@/entities/schedule";
import { Card, CardContent, Badge } from "@/shared/ui";
import { formatEmployees } from "../lib/format-lesson";
import { ClockIcon, MapPinIcon, UserIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ScheduleTableProps {
  schedule: ScheduleResponse | null;
  weekNumber: number;
  className?: string;
}

type TimeSlot = string;

function getTimeSlots(schedule: ScheduleResponse, weekNumber: number): TimeSlot[] {
  const times = new Set<string>();
  const schedules: Partial<Record<ScheduleDayKey, ScheduleLesson[]>> = schedule.schedules ?? {};
  for (const day of SCHEDULE_DAY_KEYS) {
    const lessons = filterLessonsByWeek(schedules[day] ?? [], weekNumber);
    for (const lesson of lessons) {
      times.add(lesson.startLessonTime);
    }
  }
  return Array.from(times).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function getLessonAt(
  schedule: ScheduleResponse,
  day: ScheduleDayKey,
  timeSlot: TimeSlot,
  weekNumber: number
): ScheduleLesson | undefined {
  const schedules: Partial<Record<ScheduleDayKey, ScheduleLesson[]>> = schedule.schedules ?? {};
  const lessons = filterLessonsByWeek(schedules[day] ?? [], weekNumber);
  return lessons.find((l) => l.startLessonTime === timeSlot);
}

function getLessonTypeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  const t = type.toLowerCase();
  if (t.includes("лк") || t.includes("лекция")) return "default";
  if (t.includes("лр") || t.includes("лабораторная")) return "destructive";
  if (t.includes("пз") || t.includes("практика")) return "secondary";
  return "outline";
}

export function ScheduleTable({ schedule, weekNumber, className }: ScheduleTableProps) {
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

  const timeSlots = getTimeSlots(schedule, weekNumber);

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
                  className="min-w-[240px] px-4 py-3 text-left font-medium text-muted-foreground"
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
                  const lesson = getLessonAt(schedule, day, timeSlot, weekNumber);
                  return (
                    <td key={day} className="p-2 align-top">
                      {lesson ? (
                        <Card className="h-full border-border/50 bg-background/50 transition-colors hover:bg-accent/50">
                          <CardContent className="flex flex-col gap-2.5 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <Badge
                                variant={getLessonTypeVariant(lesson.lessonTypeAbbrev)}
                                className="px-1.5 py-0 text-[10px] leading-4 font-semibold uppercase tracking-wider"
                              >
                                {lesson.lessonTypeAbbrev}
                              </Badge>
                              {lesson.numSubgroup !== 0 && (
                                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                                  {lesson.numSubgroup} подгр.
                                </span>
                              )}
                            </div>

                            <div
                              className="font-semibold leading-tight line-clamp-2"
                              title={lesson.subjectFullName}
                            >
                              {lesson.subject}
                            </div>

                            <div className="mt-auto flex flex-col gap-1.5 text-xs text-muted-foreground">
                              {lesson.auditories?.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <MapPinIcon className="size-3.5 shrink-0" />
                                  <span className="truncate">{lesson.auditories.join(", ")}</span>
                                </div>
                              )}

                              {lesson.employees && lesson.employees.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <UserIcon className="size-3.5 shrink-0" />
                                  <span className="truncate">{formatEmployees(lesson)}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="flex h-full min-h-[120px] items-center justify-center rounded-xl border border-dashed border-transparent p-3 text-muted-foreground/30">
                          —
                        </div>
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
