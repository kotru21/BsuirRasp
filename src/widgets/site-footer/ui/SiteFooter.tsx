import Link from "next/link";
import {
  BSUIR_IIS_API_NPM_URL,
  BSUIR_IIS_API_REPO_URL,
  BSUIR_IIS_API_VERSION,
} from "@/shared/config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
      <p>
        Showcase на <code className="rounded bg-muted px-1">bsuir-iis-api</code>{" "}
        <span className="text-foreground/80">{BSUIR_IIS_API_VERSION}</span>
        {" · "}
        <Link
          href={BSUIR_IIS_API_NPM_URL}
          className="underline underline-offset-2 hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          npm
        </Link>
        {" · "}
        <Link
          href={BSUIR_IIS_API_REPO_URL}
          className="underline underline-offset-2 hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          репозиторий SDK
        </Link>
      </p>
      <nav
        className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.8rem]"
        aria-label="Демонстрации SDK"
      >
        <Link href="/abort-demo" className="hover:text-foreground">
          AbortSignal
        </Link>
        <span className="text-border" aria-hidden>
          ·
        </span>
        <Link href="/validation-demo" className="hover:text-foreground">
          ValidationError
        </Link>
        <span className="text-border" aria-hidden>
          ·
        </span>
        <Link href="/mock-demo" className="hover:text-foreground">
          Mock-клиент
        </Link>
      </nav>
    </footer>
  );
}
