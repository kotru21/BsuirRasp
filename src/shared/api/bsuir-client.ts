import { createBsuirClient } from "bsuir-iis-api";
import {
  API_BASE_URL,
  BSUIR_RETRY_DELAY_MS,
  BSUIR_RETRY_JITTER,
  BSUIR_RETRY_MAX_DELAY_MS,
  BSUIR_USER_AGENT,
} from "@/shared/config";

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

const debugFetch =
  process.env.BSUIR_DEBUG_FETCH === "1"
    ? wrapFetchForDebug(globalThis.fetch.bind(globalThis))
    : undefined;

export const bsuirClient = createBsuirClient({
  baseUrl: API_BASE_URL,
  timeoutMs: 10000,
  retries: 2,
  retryDelayMs: BSUIR_RETRY_DELAY_MS,
  retryMaxDelayMs: BSUIR_RETRY_MAX_DELAY_MS,
  retryJitter: BSUIR_RETRY_JITTER,
  userAgent: BSUIR_USER_AGENT,
  ...(debugFetch ? { fetch: debugFetch } : {}),
});
