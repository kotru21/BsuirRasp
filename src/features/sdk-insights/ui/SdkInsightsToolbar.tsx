"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getResolvedSearchParams } from "@/shared/lib";

interface SdkInsightsToolbarProps {
  /** Есть выбранное расписание (группа или преподаватель) — для подсказки про rawSchedule. */
  scheduleContextActive?: boolean;
}

export function SdkInsightsToolbar({
  scheduleContextActive = true,
}: SdkInsightsToolbarProps) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const resolved = getResolvedSearchParams(sp);
  const isRaw = resolved.get("rawSchedule") === "1";
  const next = new URLSearchParams(resolved.toString());
  if (isRaw) next.delete("rawSchedule");
  else next.set("rawSchedule", "1");
  const q = next.toString();
  const toggleHref = q ? `${pathname}?${q}` : pathname;

  return (
    <div className="mb-3 space-y-2 text-xs">
      <div className="flex flex-wrap gap-2">
        <Link
          href={toggleHref}
          scroll={false}
          className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title={
            scheduleContextActive
              ? undefined
              : "Сначала выберите группу или преподавателя — сырой ответ строится для текущего расписания"
          }
        >
          {isRaw
            ? "Выключить rawSchedule=1"
            : "Включить rawSchedule=1 (сырой ответ API)"}
        </Link>
        <Link
          href="/abort-demo"
          className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Демо AbortSignal
        </Link>
        <Link
          href="/validation-demo"
          className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Демо ValidationError
        </Link>
        <Link
          href="/mock-demo"
          className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Демо mock-клиента
        </Link>
      </div>
      {!scheduleContextActive && (
        <p className="text-[0.7rem] leading-snug text-muted-foreground">
          Переключатель rawSchedule добавляет параметр в URL главной; полный отчёт в панели — после
          выбора расписания.
        </p>
      )}
    </div>
  );
}
