"use client";

import Link from "next/link";

function looksLikeNetworkOrIis(msg: string): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes("fetch") ||
    m.includes("network") ||
    m.includes("timeout") ||
    m.includes("iis") ||
    m.includes("bsuir") ||
    m.includes("502") ||
    m.includes("503") ||
    m.includes("504") ||
    m.includes("econn") ||
    m.includes("enotfound") ||
    m.includes("failed to fetch")
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const msg = error.message ?? "";
  const name = error.name ?? "";
  const hint =
    looksLikeNetworkOrIis(msg) || name === "BsuirNetworkError" || name === "BsuirTimeoutError"
      ? "Похоже на сбой сети или ответа ИИС. Попробуйте позже или проверьте доступность iis.bsuir.by."
      : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Произошла ошибка</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">{error.message}</p>
      {hint && <p className="max-w-md text-center text-xs text-muted-foreground">{hint}</p>}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-muted"
        >
          Повторить
        </button>
        <Link
          href="/"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-muted"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
