import { buildHeroOgImage } from "@/shared/og";

export const alt =
  "bsuir-iis-api — типобезопасный клиент к API ИИС БГУИР, живой showcase расписания и справочников.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function TwitterImage() {
  return buildHeroOgImage();
}
