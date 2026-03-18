interface JsonDetailsProps {
  summary: string;
  children: string;
  maxHeight?: string;
}

export function JsonDetails({ summary, children, maxHeight = "40vh" }: JsonDetailsProps) {
  return (
    <details className="mt-3 rounded-lg border bg-muted/30 first:mt-4">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
        {summary}
      </summary>
      <pre
        className="overflow-auto border-t p-3 text-[11px] leading-4"
        style={{ maxHeight }}
      >
        {children}
      </pre>
    </details>
  );
}
