"use client";

import Link from "next/link";
import { API_BASE_URL, BSUIR_IIS_API_README_URL } from "@/shared/config";
import { cn, copyTextToClipboard, showError, showSuccess } from "@/shared/lib";

const EXAMPLE_GROUP = "250503";

function buildSnippet(): string {
  return `import { createBsuirClient } from "bsuir-iis-api";

const client = createBsuirClient({
  baseUrl: "${API_BASE_URL}",
});

const schedule = await client.schedule.getGroup("${EXAMPLE_GROUP}");`;
}

interface SdkQuickStartSectionProps {
  className?: string;
}

export function SdkQuickStartSection({ className }: SdkQuickStartSectionProps) {
  const snippet = buildSnippet();

  async function copySnippet() {
    const ok = await copyTextToClipboard(snippet);
    if (ok) showSuccess("Пример скопирован");
    else showError("Не удалось скопировать");
  }

  return (
    <section
      id="quick-start"
      className={cn(
        "scroll-mt-24 border-t border-border px-4 py-12 sm:px-6 lg:px-8 dark:border-white/10",
        className
      )}
      aria-labelledby="quick-start-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            First steps
          </p>
          <h2
            id="quick-start-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl dark:text-white"
          >
            Quick start
          </h2>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Минимальный вызов в TypeScript. Типы ответов — из{" "}
            <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground dark:border-white/10 dark:bg-black/30 dark:text-zinc-200">
              bsuir-iis-api
            </code>
            ; в этом репозитории — реэкспорт в{" "}
            <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground dark:border-white/10 dark:bg-black/30 dark:text-zinc-200">
              src/shared/api/bsuir-types.ts
            </code>
            . Подробности в{" "}
            <Link
              href={BSUIR_IIS_API_README_URL}
              className="font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary dark:text-white dark:decoration-white/30 dark:hover:decoration-white"
              target="_blank"
              rel="noreferrer"
            >
              README
            </Link>
            .
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-[#3178C6] font-mono text-[0.5rem] font-bold leading-none text-white"
                role="img"
                aria-label="TypeScript"
              >
                TS
              </span>
              <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400">example.ts</span>
            </div>
            <button
              type="button"
              onClick={copySnippet}
              className="rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 sm:min-h-0 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:focus-visible:ring-white/40"
            >
              Копировать пример
            </button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground/90 sm:p-6 sm:text-sm dark:text-zinc-300">
            {snippet}
          </pre>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground sm:text-left dark:text-zinc-600">
          Дальше —{" "}
          <a
            href="#api-showcase"
            className="text-foreground underline-offset-2 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            перейти к живому showcase
          </a>
        </p>
      </div>
    </section>
  );
}
