"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { SdkInsightsData } from "../model/types";

interface SdkInsightsProps {
  insights: SdkInsightsData | null;
}

interface SummaryRow {
  label: string;
  value: number | null | boolean;
}

interface SummarySection {
  title: string;
  rows: SummaryRow[];
}

function Value({ value }: { value: number | null | boolean }) {
  if (typeof value === "boolean") return <span>{value ? "Да" : "Нет"}</span>;
  if (value === null) return <span className="text-muted-foreground">—</span>;
  return <span>{value}</span>;
}

export function SdkInsights({ insights }: SdkInsightsProps) {
  const [open, setOpen] = useState(false);
  const rawJson = useMemo(() => JSON.stringify(insights, null, 2), [insights]);
  const summarySections = useMemo<SummarySection[]>(() => {
    if (!insights) return [];

    const { pageContext } = insights.raw;
    const isSchedulePage = Boolean(pageContext.scheduleMode && pageContext.scheduleKey);
    const isEmployeePage = pageContext.scheduleMode === "employee";
    const hasDepartmentContext = pageContext.departmentId !== null;

    const sections: SummarySection[] = [];

    if (isSchedulePage) {
      sections.push({
        title: "Недели",
        rows: [
          {
            label: "Семестровая (currentWeek)",
            value: insights.weeks.semesterFromCurrentWeek,
          },
          {
            label: "Цикловая (currentWeek)",
            value: insights.weeks.cycleFromCurrentWeek,
          },
          {
            label: "Семестровая (schedule)",
            value: insights.weeks.semesterFromSchedule,
          },
          {
            label: "Цикловая (schedule)",
            value: insights.weeks.cycleFromSchedule,
          },
          {
            label: "Цикловая (toCycleWeek)",
            value: insights.weeks.cycleFromUtil,
          },
        ],
      });

      sections.push({
        title: "Расписание",
        rows: [
          { label: "Экзамены", value: insights.schedule.examsCount },
          {
            label: "Пары на текущей неделе",
            value: insights.schedule.currentWeekLessons,
          },
          {
            label: "Пары подгруппы 1",
            value: insights.schedule.subgroup1Lessons,
          },
          {
            label: "Пары подгруппы 2",
            value: insights.schedule.subgroup2Lessons,
          },
        ],
      });
    }

    const announcementRows: SummaryRow[] = [];
    if (isEmployeePage) {
      announcementRows.push({
        label: "По преподавателю",
        value: insights.announcements.employeeCount,
      });
    }
    if (hasDepartmentContext) {
      announcementRows.push({
        label: "По кафедре",
        value: insights.announcements.departmentCount,
      });
    }
    if (announcementRows.length > 0) {
      sections.push({
        title: "Объявления",
        rows: announcementRows,
      });
    }

    return sections;
  }, [insights]);
  const pageContextJson = useMemo(() => {
    if (!insights) return "null";
    return JSON.stringify(insights.raw.pageContext, null, 2);
  }, [insights]);
  const pageDataJson = useMemo(() => {
    if (!insights) return "null";
    return JSON.stringify(insights.raw.pageData, null, 2);
  }, [insights]);
  const pageErrorsJson = useMemo(() => {
    if (!insights) return "null";
    return JSON.stringify(insights.raw.pageErrors, null, 2);
  }, [insights]);
  const referencesJson = useMemo(
    () =>
      JSON.stringify(
        !insights
          ? null
          : {
              faculties: insights.raw.faculties,
              departments: insights.raw.departments,
              specialities: insights.raw.specialities,
              auditories: insights.raw.auditories,
            },
        null,
        2
      ),
    [insights]
  );
  const scheduleJson = useMemo(
    () =>
      JSON.stringify(
        !insights
          ? null
          : {
              exams: insights.raw.exams,
              filteredCurrentWeek: insights.raw.filteredCurrentWeek,
              subgroup1: insights.raw.subgroup1,
              subgroup2: insights.raw.subgroup2,
              lastUpdateDate: insights.raw.lastUpdateDate,
            },
        null,
        2
      ),
    [insights]
  );
  const announcementsJson = useMemo(
    () =>
      JSON.stringify(
        !insights
          ? null
          : {
              employeeItems: insights.announcements.employeeItems,
              departmentItems: insights.announcements.departmentItems,
            },
        null,
        2
      ),
    [insights]
  );

  if (!insights) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 flex flex-col items-start p-4 sm:p-6">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-lg hover:bg-muted"
        >
          SDK Insights
        </button>
      )}

      <section
        className={cn(
          "w-[min(92vw,680px)] rounded-xl border bg-card text-sm shadow-2xl transition-all",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="text-base font-semibold">SDK Insights</h3>
            <p className="text-xs text-muted-foreground">
              Floating runtime-отчет по данным `bsuir-iis-api`
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
          >
            Скрыть
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Ниже отображаются все данные, полученные на текущей странице через SDK.
          </p>

          {summarySections.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {summarySections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <h4 className="font-medium">{section.title}</h4>
                  {section.rows.map((row) => (
                    <div key={row.label}>
                      {row.label}: <Value value={row.value} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <details className="mt-4 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Контекст текущей страницы (pageContext)
            </summary>
            <pre className="max-h-[30vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {pageContextJson}
            </pre>
          </details>

          <details className="mt-3 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Основные данные страницы (groups / employees / schedule / currentWeek / lastUpdate)
            </summary>
            <pre className="max-h-[40vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {pageDataJson}
            </pre>
          </details>

          <details className="mt-3 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Ошибки страницы (pageErrors)
            </summary>
            <pre className="max-h-[24vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {pageErrorsJson}
            </pre>
          </details>

          <details className="mt-3 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Справочники SDK (faculties / departments / specialities / auditories)
            </summary>
            <pre className="max-h-[40vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {referencesJson}
            </pre>
          </details>

          <details className="mt-3 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Расширенные данные расписания SDK
            </summary>
            <pre className="max-h-[40vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {scheduleJson}
            </pre>
          </details>

          <details className="mt-3 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Объявления SDK (employee / department)
            </summary>
            <pre className="max-h-[40vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {announcementsJson}
            </pre>
          </details>

          <details className="mt-3 rounded-lg border bg-muted/30">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
              Полный дамп SDK Insights (JSON)
            </summary>
            <pre className="max-h-[45vh] overflow-auto border-t p-3 text-[11px] leading-4">
              {rawJson}
            </pre>
          </details>
        </div>
      </section>
    </div>
  );
}

