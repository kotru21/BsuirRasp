import { buildHeroOgImage } from "@/shared/og";

export const alt = "Демо BsuirValidationError — валидация номера группы в bsuir-iis-api.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function TwitterImage() {
  return buildHeroOgImage({
    eyebrow: "Demo",
    title: "BsuirValidationError",
    monoLine: "bsuir-iis-api",
    subtitle: "Невалидный номер группы — SDK отклоняет запрос до HTTP, как в контракте пакета.",
    footer: "validation-demo · bsuir-iis-api showcase",
  });
}
