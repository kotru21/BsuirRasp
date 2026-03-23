"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getResolvedSearchParams, getUrlSearchParamsForNavigation } from "@/shared/lib";
import { useCallback } from "react";
import { DAY_CODE } from "../model/build-schedule-filter";

const DAY_OPTIONS = Object.entries(DAY_CODE).map(([code, label]) => ({
  code,
  label,
}));

const FILTER_KEYS = ["fDay", "fSubject", "fType", "fAuditory", "fEmployee"] as const;

interface ScheduleAdvancedFilterPanelProps {
  /** Режим группы: показать поле «преподаватель (urlId)» */
  showEmployeeUrlFilter: boolean;
  className?: string;
}

export function ScheduleAdvancedFilterPanel({
  showEmployeeUrlFilter,
  className = "",
}: ScheduleAdvancedFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolved = getResolvedSearchParams(searchParams);
  const resolvedQs = resolved.toString();
  const hasUrlFilters = FILTER_KEYS.some((k) => Boolean(resolved.get(k)?.trim()));

  const applyFromForm = useCallback(
    (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const next = getUrlSearchParamsForNavigation();
      const setOrDelete = (key: string, v: FormDataEntryValue | null) => {
        const t = typeof v === "string" ? v.trim() : "";
        if (t) next.set(key, t);
        else next.delete(key);
      };
      setOrDelete("fDay", fd.get("fDay"));
      setOrDelete("fSubject", fd.get("fSubject"));
      setOrDelete("fType", fd.get("fType"));
      setOrDelete("fAuditory", fd.get("fAuditory"));
      setOrDelete("fEmployee", fd.get("fEmployee"));
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [router]
  );

  const clear = useCallback(() => {
    const next = getUrlSearchParamsForNavigation();
    for (const k of FILTER_KEYS) next.delete(k);
    router.push(`?${next.toString()}`, { scroll: false });
  }, [router]);

  /** Сброс полей формы при навигации (без setState в useEffect). */
  const formKey = resolvedQs;

  return (
    <div
      className={`rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm ${className}`}
    >
      <p className="mb-2 font-medium text-foreground">Фильтр SDK</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Действует для вкладки «Основное расписание». Параметры передаются в{" "}
        <code className="rounded bg-muted px-1">getGroupFiltered</code> /{" "}
        <code className="rounded bg-muted px-1">getEmployeeFiltered</code> (
        <code className="rounded bg-muted px-1">weekday</code>,{" "}
        <code className="rounded bg-muted px-1">subjectQuery</code>,{" "}
        <code className="rounded bg-muted px-1">lessonTypeAbbrev</code>,{" "}
        <code className="rounded bg-muted px-1">auditory</code>
        {showEmployeeUrlFilter && (
          <>
            , <code className="rounded bg-muted px-1">employeeUrlId</code>
          </>
        )}
        ). Неделя и подгруппа берутся из URL (
        <code className="rounded bg-muted px-1">week</code>,{" "}
        <code className="rounded bg-muted px-1">subgroup</code>).
      </p>
      <form
        key={formKey}
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          applyFromForm(e.currentTarget);
        }}
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">День (код)</span>
            <select
              name="fDay"
              className="rounded-md border border-input bg-background px-2 py-1.5"
              defaultValue={resolved.get("fDay") ?? ""}
            >
              <option value="">Любой</option>
              {DAY_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label} ({code})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-muted-foreground">Предмет (subjectQuery)</span>
            <input
              name="fSubject"
              className="rounded-md border border-input bg-background px-2 py-1.5"
              defaultValue={resolved.get("fSubject") ?? ""}
              placeholder="Напр. физика"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Тип занятия (lessonTypeAbbrev)</span>
            <input
              name="fType"
              className="rounded-md border border-input bg-background px-2 py-1.5"
              defaultValue={resolved.get("fType") ?? ""}
              placeholder="Напр. ЛК"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Аудитория (auditory)</span>
            <input
              name="fAuditory"
              className="rounded-md border border-input bg-background px-2 py-1.5"
              defaultValue={resolved.get("fAuditory") ?? ""}
              placeholder="Напр. 101"
            />
          </label>
          {showEmployeeUrlFilter && (
            <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
              <span className="text-xs text-muted-foreground">
                Преподаватель urlId (только для группы)
              </span>
              <input
                name="fEmployee"
                className="rounded-md border border-input bg-background px-2 py-1.5"
                defaultValue={resolved.get("fEmployee") ?? ""}
                placeholder="s-nesterenkov"
              />
            </label>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Применить
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={!hasUrlFilters}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-40"
          >
            Сбросить фильтр SDK
          </button>
        </div>
      </form>
    </div>
  );
}
