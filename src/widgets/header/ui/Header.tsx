"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GroupSelect } from "@/features/group-select";
import { ThemeToggle } from "@/features/theme-toggle";
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold tracking-tight shrink-0">Расписание БГУИР</h1>
        <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
          <button
            type="button"
            onClick={toggleAnnouncements}
            className={cn(
              "inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium hover:bg-muted",
              isAnnouncementsOpen && "bg-muted"
            )}
          >
            Объявления
          </button>
          <GroupSelect
            groups={groups}
            employees={employees}
            placeholder="Поиск группы или преподавателя..."
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
