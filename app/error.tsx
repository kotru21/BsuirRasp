"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Произошла ошибка</h2>
      <p className="text-muted-foreground text-center text-sm">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-muted"
      >
        Повторить
      </button>
    </div>
  );
}
