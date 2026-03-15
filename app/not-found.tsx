import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">404 — страница не найдена</h2>
      <Link href="/" className="text-primary underline-offset-4 hover:underline">
        На главную
      </Link>
    </div>
  );
}
