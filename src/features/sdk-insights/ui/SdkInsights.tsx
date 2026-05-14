"use client";

import { Suspense, useMemo, useState } from "react";
import { cn } from "@/shared/lib";
import type { SdkInsightsData } from "../model/types";
import { buildSummarySections } from "../model/lib/build-summary-sections";
import { buildJsonDumps } from "../model/lib/json-dumps";
import { SdkInsightsSummary } from "./SdkInsightsSummary";
import { JsonDetails } from "./JsonDetails";
import { SdkInsightsToolbar } from "./SdkInsightsToolbar";

interface SdkInsightsProps {
  insights: SdkInsightsData | null;
}

export function SdkInsights({ insights }: SdkInsightsProps) {
  const [open, setOpen] = useState(false);

  const summarySections = useMemo(() => buildSummarySections(insights), [insights]);
  const dumps = useMemo(() => buildJsonDumps(insights), [insights]);
  const hasFullInsights = insights !== null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-50 flex flex-col items-start gap-2 p-4 sm:p-6">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto min-h-11 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-0"
        >
          SDK Insights
        </button>
      )}

      {open && (
        <section
          className={cn(
            "pointer-events-auto max-h-[85vh] w-[min(92vw,680px)] rounded-xl border bg-card text-sm shadow-2xl"
          )}
          aria-labelledby="sdk-insights-title"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 id="sdk-insights-title" className="text-base font-semibold">
                SDK Insights
              </h3>
              <p className="text-xs text-muted-foreground">
                Floating runtime-отчёт по данным `bsuir-iis-api`
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border px-2 py-1 text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 sm:min-h-0"
            >
              Скрыть
            </button>
          </div>

          <div className="max-h-[70vh] overflow-auto p-4">
            {hasFullInsights ? (
              <p className="mb-3 text-xs text-muted-foreground">
                Ниже отображаются все данные, полученные на текущей странице через SDK.
              </p>
            ) : (
              <p className="mb-3 text-xs text-muted-foreground">
                Выберите группу или преподавателя в шапке — здесь появится сводка запросов и JSON по
                текущей странице. Ниже всегда доступны ссылки на отдельные демо SDK.
              </p>
            )}

            <Suspense fallback={null}>
              <SdkInsightsToolbar scheduleContextActive={hasFullInsights} />
            </Suspense>

            {hasFullInsights && insights.advanced && (
              <div className="mb-3 space-y-1 rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                <p>{insights.advanced.lastUpdateNamespaceNote}</p>
                <p>{insights.advanced.currentWeekAliasNote}</p>
                <p>{insights.advanced.requestQueryRecipeNote}</p>
              </div>
            )}

            {hasFullInsights && summarySections.length > 0 && (
              <SdkInsightsSummary sections={summarySections} />
            )}

            {hasFullInsights && (
              <>
                <JsonDetails summary="Контекст текущей страницы (pageContext)" maxHeight="30vh">
                  {dumps.pageContext}
                </JsonDetails>
                <JsonDetails summary="Основные данные страницы (groups / employees / schedule / currentWeek / lastUpdate)">
                  {dumps.pageData}
                </JsonDetails>
                <JsonDetails summary="Ошибки страницы (pageErrors)" maxHeight="24vh">
                  {dumps.pageErrors}
                </JsonDetails>
                <JsonDetails summary="Справочники SDK (faculties / departments / specialities / auditories)">
                  {dumps.references}
                </JsonDetails>
                <JsonDetails summary="Расширенные данные расписания SDK">
                  {dumps.schedule}
                </JsonDetails>
                <JsonDetails
                  summary="Advanced: raw vs normalized, lastUpdate(by id), заметки (JSON)"
                  maxHeight="36vh"
                >
                  {dumps.advanced}
                </JsonDetails>
                <JsonDetails summary="Объявления SDK (employee / department)">
                  {dumps.announcements}
                </JsonDetails>
                <JsonDetails summary="Полный дамп SDK Insights (JSON)" maxHeight="45vh">
                  {dumps.raw}
                </JsonDetails>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
