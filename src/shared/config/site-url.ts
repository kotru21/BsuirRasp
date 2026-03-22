/** Базовый URL сайта для абсолютных ссылок в metadata / OG. Задаётся `NEXT_PUBLIC_SITE_URL` (без завершающего `/`). */
export function getMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const normalized = raw.replace(/\/$/, "");
  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}
