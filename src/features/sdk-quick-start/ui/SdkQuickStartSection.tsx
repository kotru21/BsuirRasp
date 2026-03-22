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
      className={cn("scroll-mt-24 border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8", className)}
      aria-labelledby="quick-start-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            First steps
          </p>
          <h2
            id="quick-start-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Quick start
          </h2>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
            Минимальный вызов в TypeScript. Типы ответов — из{" "}
            <code className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
              bsuir-iis-api
            </code>
            ; в этом репозитории — реэкспорт в{" "}
            <code className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
              src/shared/api/bsuir-types.ts
            </code>
            . Подробности в{" "}
            <Link
              href={BSUIR_IIS_API_README_URL}
              className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              target="_blank"
              rel="noreferrer"
            >
              README
            </Link>
            .
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500/90" aria-hidden />
              <span className="text-xs font-medium text-zinc-400">example.ts</span>
            </div>
            <button
              type="button"
              onClick={copySnippet}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-h-11 sm:min-h-0"
            >
              Копировать пример
            </button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-zinc-300 sm:p-6 sm:text-sm">
            {snippet}
          </pre>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600 sm:text-left">
          Дальше —{" "}
          <a href="#api-showcase" className="text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline">
            перейти к живому showcase
          </a>
        </p>
      </div>
    </section>
  );
}
