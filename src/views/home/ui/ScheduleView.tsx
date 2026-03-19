"use client";

import { EmployeeAnnouncementsPanel } from "@/features/employee-announcements";
import { ExamSessionFilteredBar } from "@/features/schedule-exams-filtered";
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
import { Suspense, useState } from "react";

interface ScheduleViewProps {
  schedule: NormalizedScheduleResponse | null;
  currentWeek: number;
  lastUpdateDate?: string | null;
  advancedFilterLessons?: FlattenedScheduleLesson[] | null;
  /** Элементы из getGroupExams / getEmployeeExams */
  examLessons?: FlattenedScheduleLesson[];
  /** get*Filtered, source: "exams", lessonTypeAbbrev */
  examFilteredLessons?: FlattenedScheduleLesson[];
  examLessonTypesLabel?: string;
  employeeAnnouncements?: Announcement[];
  showEmployeeUrlFilter?: boolean;
  /** Вторая группа (`?compareGroup=`) — только вместе с основной группой */
  compareGroupNumber?: string | null;
  compareSchedule?: NormalizedScheduleResponse | null;
  compareScheduleError?: string | null;
  compareExamLessons?: FlattenedScheduleLesson[];
  compareExamFilteredLessons?: FlattenedScheduleLesson[];
  /** Параллельный getGroupFiltered для колонки B при активном расширенном фильтре */
  compareAdvancedFilterLessons?: FlattenedScheduleLesson[] | null;
  compareScheduleFilterError?: string | null;
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

function groupBLabel(
  compareGroupNumber: string,
  compareSchedule: NormalizedScheduleResponse | null
): string {
  const name = compareSchedule?.studentGroupDto?.name;
  return name ? `Группа B · ${name}` : `Группа B · ${compareGroupNumber}`;
}

export function ScheduleView({
  schedule,
  currentWeek,
  lastUpdateDate,
  advancedFilterLessons = null,
  examLessons = [],
  examFilteredLessons = [],
  examLessonTypesLabel = "",
  employeeAnnouncements = [],
  showEmployeeUrlFilter = false,
  compareGroupNumber = null,
  compareSchedule = null,
  compareScheduleError = null,
  compareExamLessons = [],
  compareExamFilteredLessons = [],
  compareAdvancedFilterLessons = null,
  compareScheduleFilterError = null,
}: ScheduleViewProps) {
  const [tableMode, setTableMode] = useState<"main" | "exams" | "examsFiltered">(
    "main"
  );
  const isEmployeeSchedule = Boolean(schedule?.employeeDto);
  const periodCaption = schedule ? schedulePeriodCaption(schedule) : null;
  const { weekNumber, setWeekNumber, minWeek, maxWeek } = useWeekNumber({
    defaultWeek: currentWeek,
    minWeek: 1,
    maxWeek: 4,
  });
  const { subgroupFilter, setSubgroupFilter } = useSubgroup();

  const compareActive = Boolean(compareGroupNumber && schedule?.studentGroupDto);

  const flatA =
    tableMode === "exams"
      ? examLessons
      : tableMode === "examsFiltered"
        ? examFilteredLessons
        : advancedFilterLessons;

  const flatB =
    tableMode === "exams"
      ? compareExamLessons
      : tableMode === "examsFiltered"
        ? compareExamFilteredLessons
        : advancedFilterLessons != null
          ? (compareAdvancedFilterLessons ?? [])
          : null;

  const subgroupForTables = isEmployeeSchedule ? "all" : subgroupFilter;

  const tablesBlock = compareActive && compareGroupNumber ? (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Сравнение групп:{" "}
        <code className="rounded bg-muted px-1">compareGroup={compareGroupNumber}</code>. Ошибки второй
        группы не блокируют страницу.
      </p>
      {compareScheduleFilterError && (
        <p className="text-xs text-destructive">
          Колонка B, расширенный фильтр: {compareScheduleFilterError}
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Группа A · {schedule?.studentGroupDto?.name ?? "—"}
          </p>
          <ScheduleTable
            schedule={schedule}
            weekNumber={weekNumber}
            subgroupFilter={subgroupForTables}
            showStudentGroups={isEmployeeSchedule}
            flattenedLessons={flatA ?? null}
          />
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {groupBLabel(compareGroupNumber, compareSchedule)}
          </p>
          {compareScheduleError && !compareSchedule ? (
            <div
              className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive"
              role="alert"
            >
              {compareScheduleError}
            </div>
          ) : (
            <ScheduleTable
              schedule={compareSchedule}
              weekNumber={weekNumber}
              subgroupFilter={subgroupForTables}
              showStudentGroups={false}
              flattenedLessons={flatB}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <ScheduleTable
      schedule={schedule}
      weekNumber={weekNumber}
      subgroupFilter={subgroupForTables}
      showStudentGroups={isEmployeeSchedule}
      flattenedLessons={flatA ?? null}
    />
  );

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
                <p
                  className="mt-0.5 text-xs text-muted-foreground"
                  title="ИИС может выдавать странные значения"
                >
                  Обновлено: {formatLastUpdate(lastUpdateDate)} (ИИС может выдавать странные значения)
                </p>
              )}
              {periodCaption && (
                <p
                  className="mt-1 text-xs text-muted-foreground"
                  title="Поля из ответа расписания (normalized)"
                >
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
              <span className="text-muted-foreground">(get*Exams)</span>
            </button>
            <button
              type="button"
              onClick={() => setTableMode("examsFiltered")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tableMode === "examsFiltered"
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              Сессия filtered{" "}
              <span className="text-muted-foreground">(get*Filtered, source: exams)</span>
            </button>
          </div>
          {tableMode === "exams" && (
            <p className="text-xs text-muted-foreground">
              Список ниже — плоский ответ{" "}
              <code className="rounded bg-muted px-1">getGroupExams</code> /{" "}
              <code className="rounded bg-muted px-1">getEmployeeExams</code>.
            </p>
          )}
          {tableMode === "examsFiltered" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Как в README SDK:{" "}
                <code className="rounded bg-muted px-1">getGroupFiltered</code> /{" "}
                <code className="rounded bg-muted px-1">getEmployeeFiltered</code> с{" "}
                <code className="rounded bg-muted px-1">
                  {"{ source: \"exams\", lessonTypeAbbrev }"}
                </code>
                . Сейчас:{" "}
                <code className="rounded bg-muted px-1">{examLessonTypesLabel}</code>
              </p>
              <Suspense fallback={null}>
                <ExamSessionFilteredBar />
              </Suspense>
            </div>
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
      {tablesBlock}
      {schedule && isEmployeeSchedule && (
        <EmployeeAnnouncementsPanel items={employeeAnnouncements} />
      )}
    </div>
  );
}
