"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BellIcon, Link2Icon } from "lucide-react";
import { useAnnouncementsUi } from "@/features/department-passport";
import { GroupSelect } from "@/features/group-select";
import { ThemeToggle } from "@/features/theme-toggle";
import { copyTextToClipboard, showError, showSuccess } from "@/shared/lib";
import { cn } from "@/shared/lib";
import type { Employee, StudentGroup } from "@/entities";

const headerActionClass =
  "inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-md border px-2 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-9 md:min-h-0 md:min-w-0 md:px-3 md:text-sm";

interface HeaderProps {
  groups: StudentGroup[];
  employees: Employee[];
}

export function Header({ groups, employees }: HeaderProps) {
  const searchParams = useSearchParams();
  const { isAnnouncementsOpen, toggleAnnouncements } = useAnnouncementsUi();

  async function copyPageLink() {
    const ok = await copyTextToClipboard(window.location.href);
    if (ok) showSuccess("Ссылка скопирована в буфер обмена");
    else showError("Не удалось скопировать ссылку");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/60">
      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] px-4 py-1.5 [grid-template-areas:'hdr-title_hdr-actions'_'hdr-search_hdr-search']",
          "max-md:items-center max-md:gap-x-2 max-md:gap-y-1.5 md:gap-4 md:py-2",
          "md:min-h-16 md:grid-cols-[auto_minmax(0,1fr)_auto] md:grid-rows-1 md:items-center md:[grid-template-areas:'hdr-title_hdr-search_hdr-actions']",
          "lg:px-8"
        )}
      >
        <Link
          href="/"
          className="group block min-w-0 [grid-area:hdr-title] hover:opacity-80 md:w-auto"
        >
          <span className="block font-mono text-base font-semibold tracking-tight text-foreground md:text-lg">
            bsuir-iis-api
          </span>
          <span className="block text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground md:text-[0.7rem]">
            showcase
          </span>
        </Link>
        <div className="flex shrink-0 items-center justify-end gap-1 [grid-area:hdr-actions] md:gap-2">
          <button
            type="button"
            onClick={copyPageLink}
            className={headerActionClass}
            aria-label="Поделиться ссылкой"
          >
            <Link2Icon className="size-4 shrink-0" aria-hidden />
            <span className="hidden md:inline">Поделиться ссылкой</span>
          </button>
          <button
            type="button"
            onClick={toggleAnnouncements}
            className={cn(headerActionClass, isAnnouncementsOpen && "bg-muted")}
            aria-label="Объявления"
          >
            <BellIcon className="size-4 shrink-0" aria-hidden />
            <span className="hidden md:inline">Объявления</span>
          </button>
          <ThemeToggle />
        </div>
        <GroupSelect
          groups={groups}
          employees={employees}
          placeholder="Поиск группы или преподавателя..."
          className="min-w-0 w-full [grid-area:hdr-search] md:max-w-md lg:max-w-lg"
        />
      </div>
    </header>
  );
}
