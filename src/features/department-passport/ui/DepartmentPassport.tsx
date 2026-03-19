"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Announcement, Department } from "@/entities";
import { cn } from "@/shared/lib/utils";

interface DepartmentPassportProps {
  departments: Department[];
  selectedDepartmentId: number | null;
  announcements: Announcement[];
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ru-RU");
}

export function DepartmentPassport({
  departments,
  selectedDepartmentId,
  announcements,
  className,
}: DepartmentPassportProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = useMemo(
    () => departments.find((d) => d.id === selectedDepartmentId) ?? null,
    [departments, selectedDepartmentId]
  );

  return (
    <section
      id="department-passport"
      className={cn("scroll-mt-24 rounded-xl border bg-card p-4 text-sm shadow-sm", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Паспорт кафедры</h3>
          <p className="text-xs text-muted-foreground">
            Объявления кафедры через методы `announcements.byDepartment`
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = new URLSearchParams(searchParams.toString());
            next.delete("announcements");
            router.push(`?${next.toString()}`, { scroll: false });
          }}
          className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
        >
          Скрыть
        </button>
      </div>

      <label className="mt-3 flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Кафедра</span>
        <select
          className="h-9 rounded-md border bg-background px-2 text-sm"
          value={selectedDepartmentId ?? ""}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams.toString());
            const value = e.target.value;
            if (!value) {
              next.delete("departmentId");
            } else {
              next.set("departmentId", value);
            }
            router.push(`?${next.toString()}`, { scroll: false });
          }}
        >
          <option value="">Выберите кафедру</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.abbrev})
            </option>
          ))}
        </select>
      </label>

      {selected ? (
        <div className="mt-3 rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">Выбрана кафедра</div>
          <div className="mt-1 text-sm font-medium">{selected.name}</div>
          <div className="text-xs text-muted-foreground">
            ID: {selected.id}, сокращение: {selected.abbrev}
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          Выберите кафедру, чтобы загрузить объявления.
        </div>
      )}

      <div className="mt-3 rounded-lg border p-3">
        <h4 className="text-xs font-medium text-muted-foreground">
          Объявления ({announcements.length})
        </h4>
        {announcements.length === 0 ? (
          <div className="mt-2 text-sm text-muted-foreground">Нет объявлений</div>
        ) : (
          <ul className="mt-2 space-y-2">
            {announcements.map((a) => (
              <li key={a.id} className="rounded-md border bg-muted/20 p-2">
                <div className="text-xs text-muted-foreground">
                  {formatDate(a.date)} · {a.employee}
                </div>
                <div className="mt-1 text-sm leading-snug">{a.content}</div>
                {a.studentGroups.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Группы:{" "}
                    {a.studentGroups.map((g) => `${g.name} (id ${g.id})`).join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

