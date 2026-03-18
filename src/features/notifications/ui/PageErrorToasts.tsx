"use client";

import { showError } from "@/shared/lib/notifications";
import { useEffect, useRef } from "react";

interface PageErrorToastsProps {
  groupsError?: string | null;
  employeesError?: string | null;
  scheduleError?: string | null;
  currentWeekError?: string | null;
  lastUpdateError?: string | null;
}

export function PageErrorToasts({
  groupsError,
  employeesError,
  scheduleError,
  currentWeekError,
  lastUpdateError,
}: PageErrorToastsProps) {
  const messages = [
    groupsError,
    employeesError,
    scheduleError,
    currentWeekError,
    lastUpdateError,
  ].filter(Boolean) as string[];
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
