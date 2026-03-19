"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

export function AbortSignalDemo() {
  const [group, setGroup] = useState("053503");
  const [log, setLog] = useState<string[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

  const append = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-50), line]);
  }, []);

  const fetchWithAbort = useCallback(() => {
    controllerRef.current?.abort();
    const c = new AbortController();
    controllerRef.current = c;
    append(`→ GET /api/demo/group-schedule?group=${group}`);
    fetch(`/api/demo/group-schedule?group=${encodeURIComponent(group)}`, {
      signal: c.signal,
    })
      .then(async (res) => {
        const body: { aborted?: boolean; lessonCount?: number; error?: string } = await res
          .json()
          .catch(() => ({}));
        if (body.aborted) append("← сервер: запрос прерван (signal дошёл до SDK)");
        else if (!res.ok) append(`← ${res.status} ${body.error ?? ""}`);
        else append(`← ${res.status} lessonCount=${body.lessonCount ?? "?"}`);
      })
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === "AbortError") {
          append("← AbortError: предыдущий запрос отменён новым");
        } else {
          append(`← ${e instanceof Error ? e.message : String(e)}`);
        }
      });
  }, [append, group]);

  return (
    <main className="mx-auto max-w-lg p-6">
      <Link href="/" className="text-sm underline">
        На главную
      </Link>
      <h1 className="mt-4 text-xl font-semibold">AbortSignal и bsuir-iis-api</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Новый запрос отменяет предыдущий через{" "}
        <code className="rounded bg-muted px-1">AbortController</code>. Route Handler передаёт{" "}
        <code className="rounded bg-muted px-1">request.signal</code> в{" "}
        <code className="rounded bg-muted px-1">schedule.getGroup(..., {"{ signal }"})</code>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          className="min-w-32 flex-1 rounded border border-border bg-background px-2 py-1"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          aria-label="Номер группы"
        />
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1 hover:bg-muted"
          onClick={fetchWithAbort}
        >
          Запросить
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Нажмите «Запросить» несколько раз подряд — в логе появятся отмены. Для логов HTTP на сервере
        задайте <code className="rounded bg-muted px-1">BSUIR_DEBUG_FETCH=1</code>.
      </p>
      <pre className="mt-4 max-h-[50vh] overflow-auto rounded-lg border p-3 text-xs">
        {log.length === 0 ? "Лог пуст — сделайте запрос." : log.join("\n")}
      </pre>
    </main>
  );
}
