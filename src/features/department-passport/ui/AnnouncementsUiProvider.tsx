"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getUrlSearchParamsForNavigation } from "@/shared/lib";
import type { Announcement, Department } from "@/entities";
import { DepartmentPassport } from "./DepartmentPassport";

interface AnnouncementsUiContextValue {
  isAnnouncementsOpen: boolean;
  toggleAnnouncements: () => void;
  closeAnnouncements: () => void;
}

const AnnouncementsUiContext = createContext<AnnouncementsUiContextValue | null>(null);

export function useAnnouncementsUi(): AnnouncementsUiContextValue {
  const ctx = useContext(AnnouncementsUiContext);
  if (!ctx) {
    throw new Error("useAnnouncementsUi must be used within AnnouncementsUiProvider");
  }
  return ctx;
}

export function AnnouncementsUiProvider({
  children,
  initialOpen,
}: {
  children: ReactNode;
  initialOpen: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(initialOpen);

  const replaceAnnouncementsInUrl = useCallback(
    (nextOpen: boolean) => {
      const next = getUrlSearchParamsForNavigation();
      if (nextOpen) next.set("announcements", "1");
      else next.delete("announcements");
      const qs = next.toString();
      const base = pathname || "/";
      const url = qs ? `${base}?${qs}` : base;
      window.history.replaceState(window.history.state, "", url);
    },
    [pathname]
  );

  const toggleAnnouncements = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      replaceAnnouncementsInUrl(next);
      return next;
    });
  }, [replaceAnnouncementsInUrl]);

  const closeAnnouncements = useCallback(() => {
    setOpen(false);
    replaceAnnouncementsInUrl(false);
  }, [replaceAnnouncementsInUrl]);

  const value = useMemo(
    () => ({
      isAnnouncementsOpen: open,
      toggleAnnouncements,
      closeAnnouncements,
    }),
    [open, toggleAnnouncements, closeAnnouncements]
  );

  return (
    <AnnouncementsUiContext.Provider value={value}>{children}</AnnouncementsUiContext.Provider>
  );
}

export interface DepartmentPassportGateProps {
  departments: Department[];
  selectedDepartmentId: number | null;
  announcements: Announcement[];
  employeeAnnouncements: Announcement[];
  employeeLabel: string | null;
  className?: string;
}

export function DepartmentPassportGate({
  departments,
  selectedDepartmentId,
  announcements,
  employeeAnnouncements,
  employeeLabel,
  className,
}: DepartmentPassportGateProps) {
  const { isAnnouncementsOpen, closeAnnouncements } = useAnnouncementsUi();
  if (!isAnnouncementsOpen) return null;
  return (
    <DepartmentPassport
      departments={departments}
      selectedDepartmentId={selectedDepartmentId}
      announcements={announcements}
      employeeAnnouncements={employeeAnnouncements}
      employeeLabel={employeeLabel}
      className={className}
      onRequestClose={closeAnnouncements}
    />
  );
}
