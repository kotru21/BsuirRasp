"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getResolvedSearchParams, getUrlSearchParamsForNavigation } from "@/shared/lib";
import { useCallback, useMemo } from "react";
import {
  DEFAULT_EXAM_LESSON_TYPES,
  parseExamLessonTypesParam,
} from "../model/parse-exam-lesson-types";

const PRESET: readonly string[] = DEFAULT_EXAM_LESSON_TYPES;

function splitPresetsFromParam(param: string | undefined): {
  consult: boolean;
  exam: boolean;
  other: string;
} {
  const parsed = parseExamLessonTypesParam(param);
  const consult = parsed.includes("Консультация");
  const exam = parsed.includes("Экзамен");
  const rest = parsed.filter((p) => p !== "Консультация" && p !== "Экзамен");
  return {
    consult,
    exam,
    other: rest.join(", "),
  };
}

/**
 * Редактирование query `examTypes` для вкладки «Сессия (filtered)».
 */
export function ExamSessionFilteredBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examTypesParam =
    getResolvedSearchParams(searchParams).get("examTypes") ?? undefined;
  const formKey = `examTypes-${examTypesParam ?? "default"}`;

  const initial = useMemo(() => splitPresetsFromParam(examTypesParam), [examTypesParam]);

  const apply = useCallback(
    (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const parts: string[] = [];
      if (fd.get("type-consult") === "on") parts.push("Консультация");
      if (fd.get("type-exam") === "on") parts.push("Экзамен");
      const otherRaw = fd.get("examTypesOther");
      const other = typeof otherRaw === "string" ? otherRaw.trim() : "";
      if (other) {
        for (const bit of other.split(",")) {
          const t = bit.trim();
          if (t && !parts.includes(t)) parts.push(t);
        }
      }
      const next = getUrlSearchParamsForNavigation();
      if (parts.length === 0) next.delete("examTypes");
      else next.set("examTypes", parts.join(","));
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [router]
  );

  const defaultDisplay = PRESET.join(", ");

  return (
    <form
      key={formKey}
      className="rounded-md border border-dashed border-border bg-muted/20 p-3 text-xs"
      onSubmit={(e) => {
        e.preventDefault();
        apply(e.currentTarget);
      }}
    >
      <p className="mb-2 text-muted-foreground">
        Параметр URL <code className="rounded bg-muted px-1">examTypes</code> —{" "}
        <code className="rounded bg-muted px-1">lessonTypeAbbrev</code> для filtered exams. По умолчанию
        (пустой параметр):{" "}
        <code className="rounded bg-muted px-1">{defaultDisplay}</code>
      </p>
      <div className="mb-2 flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="type-consult"
            defaultChecked={initial.consult}
            className="size-4 rounded border-input"
          />
          Консультация
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="type-exam"
            defaultChecked={initial.exam}
            className="size-4 rounded border-input"
          />
          Экзамен
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          name="examTypesOther"
          className="min-w-48 flex-1 rounded-md border border-input bg-background px-2 py-1.5"
          defaultValue={initial.other}
          placeholder="Другое (через запятую)"
          aria-label="Дополнительные типы занятий"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90"
        >
          Применить
        </button>
      </div>
    </form>
  );
}
