"use client";

import { showError, uniqueStringsInOrder } from "@/shared/lib";
import { useEffect, useRef } from "react";

interface PageErrorToastsProps {
  groupsError?: string | null;
  employeesError?: string | null;
  scheduleError?: string | null;
  currentWeekError?: string | null;
  sdkInsightsError?: string | null;
  /** Ошибка запроса get*Filtered при активном расширенном фильтре */
  scheduleFilterError?: string | null;
  /** Ошибки запросов для `compareGroup` (вторая колонка) */
  compareGroupError?: string | null;
}

export function PageErrorToasts({
  groupsError,
  employeesError,
  scheduleError,
  currentWeekError,
  sdkInsightsError,
  scheduleFilterError,
  compareGroupError,
}: PageErrorToastsProps) {
  const messages = uniqueStringsInOrder(
    [
      groupsError,
      employeesError,
      scheduleError,
      currentWeekError,
      sdkInsightsError,
      scheduleFilterError,
      compareGroupError,
    ].filter(Boolean) as string[]
  );
  const messageText = messages.join(" ");
  const lastShownMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!messageText) {
      lastShownMessageRef.current = null;
      return;
    }
    if (lastShownMessageRef.current === messageText) return;
    lastShownMessageRef.current = messageText;
    showError(messageText);
  }, [messageText]);

  return null;
}
