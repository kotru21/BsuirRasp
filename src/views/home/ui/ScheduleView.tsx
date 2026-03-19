"use client";

import { EmployeeAnnouncementsPanel } from "@/features/employee-announcements";
import { ScheduleAdvancedFilterPanel } from "@/features/schedule-advanced-filter";
import { SubgroupSwitcher, useSubgroup } from "@/features/subgroup-switcher";
import { WeekSwitcher, useWeekNumber } from "@/features/week-switcher";
import { cn } from "@/shared/lib/utils";
import { ScheduleTable } from "@/widgets/schedule-table";
import type {
  Announcement,
  FlattenedScheduleLesson,
  NormalizedScheduleResponse,
} from "@/entities";
import { useState } from "react";

interface ScheduleViewProps {
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
  lastUpdateDate?: string | null;
  advancedFilterLessons?: FlattenedScheduleLesson[] | null;
  /** Элементы из getGroupExams / getEmployeeExams */
  examLessons?: FlattenedScheduleLesson[];
  employeeAnnouncements?: Announcement[];
  showEmployeeUrlFilter?: boolean;
}

function formatLastUpdate(dateStr: string): string {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("ru-RU");
}

function schedulePeriodCaption(s: NormalizedScheduleResponse): string | null {
  const bits: string[] = [];
  if (s.startDate && s.endDate) {
    bits.push(`Занятия: ${s.startDate} — ${s.endDate}`);
  } else if (s.startDate) {
    bits.push(`С ${s.startDate}`);
  }
  if (s.startExamsDate || s.endExamsDate) {
    bits.push(
      `Сессия: ${s.startExamsDate ?? "…"} — ${s.endExamsDate ?? "…"}`
    );
  }
  return bits.length ? bits.join(" · ") : null;
}

export function ScheduleView({
  schedule,
  currentWeek,
  lastUpdateDate,
  advancedFilterLessons = null,
  examLessons = [],
  employeeAnnouncements = [],
  showEmployeeUrlFilter = false,
}: ScheduleViewProps) {
  const [tableMode, setTableMode] = useState<"main" | "exams">("main");
  const isEmployeeSchedule = Boolean(schedule?.employeeDto);
  const periodCaption = schedule ? schedulePeriodCaption(schedule) : null;
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
              {periodCaption && (
                <p className="mt-1 text-xs text-muted-foreground" title="Поля из ответа расписания (normalized)">
                  {periodCaption}
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
          <div className="mt-3 flex flex-wrap gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => setTableMode("main")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tableMode === "main"
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              Основное расписание
            </button>
            <button
              type="button"
              onClick={() => setTableMode("exams")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tableMode === "exams"
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              Экзамены{" "}
              <span className="text-muted-foreground">(getGroupExams / getEmployeeExams)</span>
            </button>
          </div>
          {tableMode === "exams" && (
            <p className="text-xs text-muted-foreground">
              Список ниже — плоский ответ{" "}
              <code className="rounded bg-muted px-1">getGroupExams</code> /{" "}
              <code className="rounded bg-muted px-1">getEmployeeExams</code>.
            </p>
          )}
          <ScheduleAdvancedFilterPanel
            showEmployeeUrlFilter={showEmployeeUrlFilter}
            className="mt-2"
          />
          {tableMode === "main" && advancedFilterLessons != null && (
            <p className="text-xs text-muted-foreground">
              Таблица ниже — результат{" "}
              <code className="rounded bg-muted px-1">getGroupFiltered</code> /{" "}
              <code className="rounded bg-muted px-1">getEmployeeFiltered</code> с учётом{" "}
              <code className="rounded bg-muted px-1">week</code> и{" "}
              <code className="rounded bg-muted px-1">subgroup</code> из URL.
            </p>
          )}
        </div>
      )}
      <ScheduleTable
        schedule={schedule}
        weekNumber={weekNumber}
        subgroupFilter={isEmployeeSchedule ? "all" : subgroupFilter}
        showStudentGroups={isEmployeeSchedule}
        flattenedLessons={
          tableMode === "exams" ? examLessons : advancedFilterLessons
        }
      />
      {schedule && isEmployeeSchedule && (
        <EmployeeAnnouncementsPanel items={employeeAnnouncements} />
      )}
    </div>
  );
}
