import Link from "next/link";
import {
  BSUIR_IIS_API_REPO_URL,
  BSUIR_IIS_API_VERSION,
} from "@/shared/config/bsuir-sdk-meta";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30 py-4 text-center text-xs text-muted-foreground">
      <p>
        Showcase на{" "}
        <code className="rounded bg-muted px-1">bsuir-iis-api</code>{" "}
        <span className="text-foreground/80">{BSUIR_IIS_API_VERSION}</span>
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
    </footer>
  );
}
