"use client";

import { copyTextToClipboard, showError, showSuccess } from "@/shared/lib";

interface JsonDetailsProps {
  summary: string;
  children: string;
  maxHeight?: string;
}

export function JsonDetails({ summary, children, maxHeight = "40vh" }: JsonDetailsProps) {
  async function copyJson(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyTextToClipboard(children);
    if (ok) showSuccess("JSON скопирован");
    else showError("Не удалось скопировать");
  }

  return (
    <details className="mt-3 rounded-lg border bg-muted/30 first:mt-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{summary}</span>
        <button
          type="button"
          onClick={copyJson}
          onMouseDown={(e) => e.stopPropagation()}
          className="shrink-0 rounded border border-border bg-background px-2 py-1 text-[0.65rem] font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Копировать
        </button>
      </summary>
      <pre
        className="overflow-auto border-t p-3 font-mono text-xs leading-relaxed sm:text-sm"
        style={{ maxHeight }}
      >
        {children}
      </pre>
    </details>
  );
}
