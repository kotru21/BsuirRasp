/**
 * Относительные пути для `openGraph` / `twitter` — Next.js склеивает их с `metadataBase`
 * (см. https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase ).
 * Не используйте здесь абсолютные URL в metadata: для них `metadataBase` не применяется.
 */
export const OPEN_GRAPH_DEFAULT_IMAGE_PATH = "/opengraph-image" as const;

export const OPEN_GRAPH_DEFAULT_IMAGE_ALT =
  "bsuir-iis-api — типобезопасный клиент к API ИИС БГУИР, живой showcase расписания и справочников.";

export const OPEN_GRAPH_DEFAULT_IMAGE_SIZE = { width: 1200, height: 630 } as const;
