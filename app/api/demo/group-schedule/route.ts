import { bsuirClient, getBsuirErrorMessage } from "@/shared/api";

/**
 * Демо: `request.signal` пробрасывается в SDK — при отмене fetch на клиенте
 * запрос к ИИС прерывается (см. /abort-demo).
 */
export async function GET(request: Request) {
  const group = new URL(request.url).searchParams.get("group")?.trim();
  if (!group || !/^\d+$/.test(group)) {
    return Response.json(
      { error: "Укажите ?group=номер (только цифры)" },
      { status: 400 }
    );
  }

  try {
    const schedule = await bsuirClient.schedule.getGroup(group, {
      signal: request.signal,
    });
    return Response.json({
      ok: true,
      lessonCount: schedule.lessons.length,
      topKeys: Object.keys(schedule).sort(),
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return Response.json({ aborted: true });
    }
    return Response.json(
      { error: getBsuirErrorMessage(e) },
      { status: 502 }
    );
  }
}
