import Link from "next/link";
import { createBsuirClient } from "bsuir-iis-api";
import { MOCK_BSUIR_GROUP_SCHEDULE_WIRE } from "@/shared/fixtures/mock-bsuir-schedule-wire";

export const metadata = {
  title: "Mock SDK demo — BsuirRasp",
};

export default async function MockDemoPage() {
  const mockFetch: typeof fetch = async () =>
    new Response(JSON.stringify(MOCK_BSUIR_GROUP_SCHEDULE_WIRE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  const client = createBsuirClient({
    baseUrl: "http://mock.local",
    fetch: mockFetch,
    timeoutMs: 5000,
  });

  const schedule = await client.schedule.getGroup("250500");

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6 text-sm">
      <p>
        <Link href="/" className="text-primary underline underline-offset-2">
          ← На главную
        </Link>
      </p>
      <h1 className="text-xl font-semibold">Mock `createBsuirClient`</h1>
      <p className="text-muted-foreground">
        Локальный <code className="rounded bg-muted px-1">fetch</code> возвращает фикстуру из{" "}
        <code className="rounded bg-muted px-1">src/shared/fixtures/mock-bsuir-schedule-wire.ts</code> — без
        запросов к ИИС.
      </p>
      <pre className="max-h-[60vh] overflow-auto rounded-lg border bg-muted/40 p-4 text-xs">
        {JSON.stringify(schedule, null, 2)}
      </pre>
    </main>
  );
}
