import { createBsuirClient } from "bsuir-iis-api";
import fs from "node:fs";
import path from "node:path";
import tls from "node:tls";
import { Agent, fetch as undiciFetch } from "undici";
import {
  API_BASE_URL,
  BSUIR_RETRY_DELAY_MS,
  BSUIR_RETRY_JITTER,
  BSUIR_RETRY_MAX_DELAY_MS,
  BSUIR_USER_AGENT,
} from "@/shared/config";

/** Имя файла: промежуточный GlobalSign GCC R6 AlphaSSL CA 2023 (ИИС БГУИР не отдаёт его в TLS-цепочке). */
const BSUIR_INTERMEDIATE_PEM = path.join(
  process.cwd(),
  "certs",
  "globalsign-gcc-r6-alphassl-ca-2023.pem"
);

/**
 * Fetch с явным CA: лист `*.bsuir.by` приходит с сервера, промежуточный — из `certs/`, корни — из Node.
 * Иначе Node/OpenSSL дают `unable to verify the first certificate` (браузеры подтягивают intermediate сами).
 */
function getFetchForBsuir(): typeof fetch {
  if (typeof process === "undefined" || !process.versions?.node) {
    return globalThis.fetch.bind(globalThis);
  }
  let extraCa: string;
  try {
    extraCa = fs.readFileSync(BSUIR_INTERMEDIATE_PEM, "utf8");
  } catch {
    return globalThis.fetch.bind(globalThis);
  }
  const ca = [...tls.rootCertificates, extraCa];
  const agent = new Agent({ connect: { ca } });
  const bound = (input: RequestInfo | URL, init?: RequestInit) =>
    undiciFetch(
      input as Parameters<typeof undiciFetch>[0],
      { ...init, dispatcher: agent } as Parameters<typeof undiciFetch>[1]
    );
  return bound as unknown as typeof fetch;
}

function wrapFetchForDebug(baseFetch: typeof fetch): typeof fetch {
  return async (input, init) => {
    const start = performance.now();
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    try {
      const res = await baseFetch(input, init);
      const ms = Math.round(performance.now() - start);
      console.info(`[bsuir-iis-api] ${res.status} ${ms}ms ${url}`);
      return res;
    } catch (e) {
      console.warn(`[bsuir-iis-api] fetch failed ${url}`, e);
      throw e;
    }
  };
}

const baseFetch = getFetchForBsuir();
const fetchImpl =
  process.env.BSUIR_DEBUG_FETCH === "1"
    ? wrapFetchForDebug(baseFetch)
    : baseFetch;

const defaultRaw =
  process.env.BSUIR_DEFAULT_RAW === "1" ? ({ defaultRaw: true } as const) : {};

export const bsuirClient = createBsuirClient({
  baseUrl: API_BASE_URL,
  timeoutMs: 10000,
  retries: 2,
  retryDelayMs: BSUIR_RETRY_DELAY_MS,
  retryMaxDelayMs: BSUIR_RETRY_MAX_DELAY_MS,
  retryJitter: BSUIR_RETRY_JITTER,
  userAgent: BSUIR_USER_AGENT,
  fetch: fetchImpl,
  ...defaultRaw,
});
