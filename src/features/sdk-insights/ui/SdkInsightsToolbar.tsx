"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function SdkInsightsToolbar() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const next = new URLSearchParams(sp.toString());
  const isRaw = next.get("rawSchedule") === "1";
  if (isRaw) next.delete("rawSchedule");
  else next.set("rawSchedule", "1");
  const q = next.toString();
  const toggleHref = q ? `${pathname}?${q}` : pathname;

  return (
    <div className="mb-3 flex flex-wrap gap-2 text-xs">
      <Link
        href={toggleHref}
        scroll={false}
        className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted"
      >
        {isRaw
          ? "Выключить rawSchedule=1"
          : "Включить rawSchedule=1 (сырой ответ API)"}
      </Link>
      <Link
        href="/abort-demo"
        className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted"
      >
        Демо AbortSignal
      </Link>
      <Link
        href="/validation-demo"
        className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted"
      >
        Демо ValidationError
      </Link>
    </div>
  );
}
