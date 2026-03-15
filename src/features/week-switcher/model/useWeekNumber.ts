"use client";

import { useRouter, useSearchParams } from "next/navigation";

const DEFAULT_WEEK = 1;
const MIN_WEEK = 1;
const MAX_WEEK = 4;

export interface UseWeekNumberOptions {
  /** Номер недели по умолчанию (например, из getCurrentWeek()) */
  defaultWeek?: number;
  minWeek?: number;
  maxWeek?: number;
}

export function useWeekNumber(options: UseWeekNumberOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { defaultWeek = DEFAULT_WEEK, minWeek = MIN_WEEK, maxWeek = MAX_WEEK } = options;

  const param = searchParams.get("week");
  const weekNumber = param
    ? Math.max(minWeek, Math.min(maxWeek, parseInt(param, 10)))
    : defaultWeek;
  const safeWeek = Number.isNaN(weekNumber) ? defaultWeek : weekNumber;

  function setWeekNumber(week: number) {
    const next = new URLSearchParams(searchParams.toString());
    const clamped = Math.max(minWeek, Math.min(maxWeek, week));
    next.set("week", String(clamped));
    router.push(`?${next.toString()}`, { scroll: false });
  }

  return {
    weekNumber: safeWeek,
    setWeekNumber,
    minWeek,
    maxWeek,
  };
}
