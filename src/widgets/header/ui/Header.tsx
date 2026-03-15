"use client";

import { GroupSelect } from "@/features/group-select";
import { ThemeToggle } from "@/features/theme-toggle";
import type { StudentGroup } from "@/entities/student-group";

interface HeaderProps {
  groups: StudentGroup[];
}

export function Header({ groups }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold tracking-tight shrink-0">Расписание БГУИР</h1>
        <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
          <GroupSelect groups={groups} placeholder="Поиск группы..." />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
