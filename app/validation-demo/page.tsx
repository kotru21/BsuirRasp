import { getGroupSchedule } from "@/entities";
import { BsuirValidationError } from "@/shared/api";
import Link from "next/link";

export default async function ValidationDemoPage() {
  let outcome: string;
  try {
    await getGroupSchedule("not-only-digits");
    outcome = "Неожиданно: запрос прошёл";
  } catch (e) {
    if (e instanceof BsuirValidationError) {
      outcome = `BsuirValidationError: ${e.message}`;
    } else {
      outcome = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <main className="mx-auto max-w-lg space-y-4 p-6">
      <Link href="/" className="text-sm underline">
        На главную
      </Link>
      <h1 className="text-xl font-semibold">BsuirValidationError</h1>
      <p className="text-sm text-muted-foreground">
        Сервер вызывает <code className="rounded bg-muted px-1">getGroupSchedule</code> с
        невалидным номером группы — SDK отклоняет запрос до HTTP (см. README пакета).
      </p>
      <pre className="whitespace-pre-wrap rounded-lg border bg-card p-4 text-sm">{outcome}</pre>
    </main>
  );
}
