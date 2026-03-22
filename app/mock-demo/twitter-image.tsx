import { buildHeroOgImage } from "@/shared/og";

export const alt = "Mock SDK demo — bsuir-iis-api с локальным JSON-фикстуром.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function TwitterImage() {
  return buildHeroOgImage({
    eyebrow: "Demo",
    title: "Mock SDK",
    monoLine: "bsuir-iis-api",
    subtitle: "Локальный JSON-фикстур без вызова ИИС: стабильная проверка парсинга расписания.",
    footer: "mock-demo · bsuir-iis-api showcase",
  });
}
