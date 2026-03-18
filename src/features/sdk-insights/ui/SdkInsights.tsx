"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { SdkInsightsData } from "../model/types";
import { buildSummarySections } from "../model/lib/build-summary-sections";
import { buildJsonDumps } from "../model/lib/json-dumps";
import { SdkInsightsSummary } from "./SdkInsightsSummary";
import { JsonDetails } from "./JsonDetails";

interface SdkInsightsProps {
  insights: SdkInsightsData | null;
}

export function SdkInsights({ insights }: SdkInsightsProps) {
  const [open, setOpen] = useState(false);

  const summarySections = useMemo(() => buildSummarySections(insights), [insights]);
  const dumps = useMemo(() => buildJsonDumps(insights), [insights]);

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
            <SdkInsightsSummary sections={summarySections} />
          )}

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
          <JsonDetails summary="Объявления SDK (employee / department)">
            {dumps.announcements}
          </JsonDetails>
          <JsonDetails summary="Полный дамп SDK Insights (JSON)" maxHeight="45vh">
            {dumps.raw}
          </JsonDetails>
        </div>
      </section>
    </div>
  );
}
