/**
 * Базовый URL сайта для абсолютных ссылок в metadata / OG (в т.ч. `opengraph-image`).
 *
 * Порядок: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` (задаётся на [Vercel](https://vercel.com/docs/projects/environment-variables/system-environment-variables)) → localhost.
 * Без этого на проде без явного env OG ссылался бы на localhost и превью не подтягивались.
 */
export function getMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = process.env.VERCEL_URL?.trim();

  let raw: string;
  if (explicit) {
    raw = explicit;
  } else if (vercelHost) {
    raw = vercelHost.startsWith("http://") || vercelHost.startsWith("https://")
      ? vercelHost
      : `https://${vercelHost}`;
  } else {
    raw = "http://localhost:3000";
  }

  const normalized = raw.replace(/\/$/, "");
  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}
