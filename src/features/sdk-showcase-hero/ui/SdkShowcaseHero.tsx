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
  "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-h-11 sm:min-h-0";

const jumpPill =
  "inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-11 sm:min-h-0 sm:text-sm";

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
        <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          npm package
        </p>

        <h1
          id="sdk-showcase-heading"
          className="max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl"
        >
          <span className="bg-linear-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Типобезопасный клиент
          </span>
          <br />
          <span className="font-mono text-[0.85em] font-semibold text-zinc-200 sm:text-[0.9em]">
            bsuir-iis-api
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
          Один пакет для API ИИС БГУИР: расписание, справочники, объявления. Ниже — живой showcase;
          здесь — установка, документация и первый код.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href="#schedule-demo"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-zinc-200 backdrop-blur-sm">
            <span className="min-w-0 flex-1 truncate">{INSTALL_CMD}</span>
            <button
              type="button"
              onClick={copyInstall}
              className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-h-11 sm:min-h-0"
            >
              Копировать
            </button>
          </div>
          <p className="flex items-center text-xs text-zinc-500 sm:shrink-0 sm:self-center sm:px-2">
            v{BSUIR_IIS_API_VERSION}
          </p>
        </div>

        {showJumpLinks && (
          <nav
            className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-10 sm:flex-row sm:flex-wrap sm:items-center"
            aria-label="Разделы страницы"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">На странице</span>
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
