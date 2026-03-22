import { getMetadataBase } from "./site-url";

/** Путь к дефолтному OG (корневой `app/opengraph-image`). */
export const OPEN_GRAPH_DEFAULT_IMAGE_PATH = "/opengraph-image" as const;

export const OPEN_GRAPH_DEFAULT_IMAGE_ALT =
  "bsuir-iis-api — типобезопасный клиент к API ИИС БГУИР, живой showcase расписания и справочников.";

export const OPEN_GRAPH_DEFAULT_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Абсолютный URL превью на том же origin, что и `metadataBase` / `og:url`.
 * Иначе Next может подставить `VERCEL_URL` деплоя, а канон — `NEXT_PUBLIC_SITE_URL`.
 */
export function getDefaultOpenGraphImageAbsoluteUrl(): string {
  return new URL(OPEN_GRAPH_DEFAULT_IMAGE_PATH, getMetadataBase()).toString();
}
