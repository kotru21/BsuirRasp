import { buildHeroOgImage } from "@/shared/og";

export const alt = "Демо AbortSignal — отмена запросов bsuir-iis-api.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function TwitterImage() {
  return buildHeroOgImage({
    eyebrow: "Demo",
    title: "AbortSignal",
    monoLine: "bsuir-iis-api",
    subtitle: "Отмена in-flight запросов к API ИИС через AbortSignal в клиенте SDK.",
    footer: "abort-demo · bsuir-iis-api showcase",
  });
}
