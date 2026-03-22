/**
 * `metadataBase` для относительных путей в metadata (Next.js:
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase ).
 *
 * Задаётся одна переменная — полный URL сайта **с протоколом**, без завершающего `/`:
 * `NEXT_PUBLIC_SITE_URL` (например `https://bsuir-rasp.vercel.app`).
 * На проде без неё будет `http://localhost:3000` — задайте в Vercel → Environment Variables.
 */
export function getMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const normalized = raw.replace(/\/$/, "");
  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}
