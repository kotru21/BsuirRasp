"use client";

import type { Announcement } from "@/entities";

interface EmployeeAnnouncementsPanelProps {
  items: Announcement[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ru-RU");
}

export function EmployeeAnnouncementsPanel({ items }: EmployeeAnnouncementsPanelProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-dashed bg-muted/20 p-4">
      <h3 className="text-sm font-medium">
        Объявления преподавателя{" "}
        <span className="font-normal text-muted-foreground">
          (<code className="rounded bg-muted px-1">announcements.byEmployee</code>)
        </span>
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((a) => (
          <li key={a.id} className="rounded-md border bg-card p-2 text-sm">
            <div className="text-xs text-muted-foreground">
              {formatDate(a.date)} · {a.employee}
            </div>
            <div className="mt-1 leading-snug">{a.content}</div>
            {a.studentGroups.length > 0 && (
              <div className="mt-1 text-xs text-muted-foreground">
                Группы: {a.studentGroups.map((g) => `${g.name} (id ${g.id})`).join(", ")}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
