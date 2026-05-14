import { createBsuirClient } from "bsuir-iis-api";
import type { BsuirClientOptions } from "bsuir-iis-api";

const DEMO_MAX_RESPONSE_BYTES = 5_000_000;

/**
 * Demonstrates bsuir-iis-api v0.10.0 new features:
 * - hardened baseUrl validation
 * - response size limits
 * - runtime response validation
 * - request lifecycle hooks
 */
export function createSdkV010FeatureDemoClient(fetchImpl: typeof fetch, baseUrl: string) {
  const allowedBaseUrlHosts = [new URL(baseUrl).hostname];

  const options: BsuirClientOptions = {
    baseUrl,
    allowedBaseUrlHosts,
    fetch: fetchImpl,
    maxResponseBytes: DEMO_MAX_RESPONSE_BYTES,
    validateResponses: true,
    hooks: {
      onRequest: ({ method, path }) => {
        console.info(`[sdk-v0.10] ${method} ${path}`);
      },
      onResponse: ({ path, durationMs, fromCache }) => {
        console.info(`[sdk-v0.10] ${path} ${durationMs}ms${fromCache ? " (cache)" : ""}`);
      },
      onRetry: ({ path, attempt, delayMs, reason }) => {
        console.warn(`[sdk-v0.10] retry ${attempt} for ${path} in ${delayMs}ms (${reason})`);
      },
      onError: ({ path, error }) => {
        console.error(`[sdk-v0.10] ${path}`, error);
      },
    },
  };

  return createBsuirClient({ ...options, defaultRaw: false });
}
