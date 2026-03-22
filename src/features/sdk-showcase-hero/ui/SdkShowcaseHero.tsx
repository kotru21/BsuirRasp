"use client";

import Link from "next/link";
import {
  BSUIR_IIS_API_NPM_URL,
  BSUIR_IIS_API_README_URL,
  BSUIR_IIS_API_REPO_URL,
  BSUIR_IIS_API_VERSION,
} from "@/shared/config";
import { cn, copyTextToClipboard, showError, showSuccess } from "@/shared/lib";
import { ArrowRightIcon } from "lucide-react";

const INSTALL_CMD = "npm i bsuir-iis-api";

const linkPill =
  "inline-flex items-center justify-center rounded-full border border-border bg-muted/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 sm:min-h-0 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:border-white/25 dark:hover:bg-white/10 dark:focus-visible:ring-white/40";

const jumpPill =
  "inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 sm:min-h-0 sm:text-sm dark:border-white/10 dark:bg-black/20 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-white/30";

interface SdkShowcaseHeroProps {
  className?: string;
  showJumpLinks?: boolean;
}

export function SdkShowcaseHero({ className, showJumpLinks = false }: SdkShowcaseHeroProps) {
  async function copyInstall() {
    const ok = await copyTextToClipboard(INSTALL_CMD);
    if (ok) showSuccess("Команда скопирована");
    else showError("Не удалось скопировать");
  }

  return (
    <section
      className={cn("scroll-mt-24 px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8", className)}
      aria-labelledby="sdk-showcase-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          npm package
        </p>

        <h1
          id="sdk-showcase-heading"
          className="max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl"
        >
          <span className="bg-linear-to-b from-foreground via-foreground/85 to-muted-foreground bg-clip-text text-transparent dark:from-white dark:via-zinc-100 dark:to-zinc-400">
            Типобезопасный клиент
          </span>
          <br />
          <span className="font-mono text-[0.85em] font-semibold text-foreground sm:text-[0.9em] dark:text-zinc-200">
            bsuir-iis-api
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Один пакет для API ИИС БГУИР: расписание, справочники, объявления. Ниже — живой showcase;
          здесь — установка, документация и первый код.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href="#schedule-demo"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-zinc-950"
          >
            Попробовать showcase
            <ArrowRightIcon className="size-4 shrink-0" aria-hidden />
          </a>
          <Link href={BSUIR_IIS_API_README_URL} className={linkPill} target="_blank" rel="noreferrer">
            Документация
          </Link>
          <Link href={BSUIR_IIS_API_NPM_URL} className={linkPill} target="_blank" rel="noreferrer">
            npm
          </Link>
          <Link href={BSUIR_IIS_API_REPO_URL} className={linkPill} target="_blank" rel="noreferrer">
            GitHub
          </Link>
        </div>

        <div className="mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-3 font-mono text-sm text-foreground backdrop-blur-sm dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
            <span className="min-w-0 flex-1 truncate">{INSTALL_CMD}</span>
            <button
              type="button"
              onClick={copyInstall}
              className="shrink-0 rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 sm:min-h-0 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:focus-visible:ring-white/40"
            >
              Копировать
            </button>
          </div>
          <p className="flex items-center text-xs text-muted-foreground sm:shrink-0 sm:self-center sm:px-2 dark:text-zinc-500">
            v{BSUIR_IIS_API_VERSION}
          </p>
        </div>

        {showJumpLinks && (
          <nav
            className="mt-12 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row sm:flex-wrap sm:items-center dark:border-white/10"
            aria-label="Разделы страницы"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-500">
              На странице
            </span>
            <div className="flex flex-wrap gap-2">
              <a href="#quick-start" className={jumpPill}>
                Quick start
              </a>
              <a href="#schedule-demo" className={jumpPill}>
                Демо расписания
              </a>
              <a href="#catalog" className={jumpPill}>
                Справочники
              </a>
              <a href="#api-showcase" className={jumpPill}>
                К showcase
              </a>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
