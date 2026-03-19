"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GroupSelect } from "@/features/group-select";
import { ThemeToggle } from "@/features/theme-toggle";
import { showError, showSuccess } from "@/shared/lib/notifications";
import { cn } from "@/shared/lib/utils";
import type { Employee, StudentGroup } from "@/entities";

interface HeaderProps {
  groups: StudentGroup[];
  employees: Employee[];
}

export function Header({ groups, employees }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAnnouncementsOpen = searchParams.get("announcements") === "1";

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess("Ссылка скопирована в буфер обмена");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  }

  function toggleAnnouncements() {
    const next = new URLSearchParams(searchParams.toString());
    if (isAnnouncementsOpen) {
      next.delete("announcements");
    } else {
      next.set("announcements", "1");
    }
    router.push(`?${next.toString()}`, { scroll: false });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0 lg:px-8">
        <h1 className="min-w-0 shrink-0 text-base font-semibold tracking-tight sm:text-lg">
          Расписание БГУИР
        </h1>
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <div className="flex items-center justify-between gap-2 sm:contents">
            <button
              type="button"
              onClick={copyPageLink}
              className="inline-flex h-9 shrink-0 items-center rounded-md border px-2.5 text-xs font-medium hover:bg-muted sm:px-3 sm:text-sm"
            >
              Поделиться ссылкой
            </button>
            <button
              type="button"
              onClick={toggleAnnouncements}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-md border px-2.5 text-xs font-medium hover:bg-muted sm:px-3 sm:text-sm",
                isAnnouncementsOpen && "bg-muted"
              )}
            >
              Объявления
            </button>
            <span className="shrink-0 sm:order-3">
              <ThemeToggle />
            </span>
          </div>
          <GroupSelect
            groups={groups}
            employees={employees}
            placeholder="Поиск группы или преподавателя..."
            className="w-full min-w-0 sm:order-2 sm:max-w-md sm:flex-1 lg:max-w-lg"
          />
        </div>
      </div>
    </header>
  );
}
