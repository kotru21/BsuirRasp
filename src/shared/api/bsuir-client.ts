import { createBsuirClient } from "bsuir-iis-api";
import {
  API_BASE_URL,
  BSUIR_RETRY_DELAY_MS,
  BSUIR_RETRY_JITTER,
  BSUIR_RETRY_MAX_DELAY_MS,
  BSUIR_USER_AGENT,
} from "@/shared/config";

export const bsuirClient = createBsuirClient({
  baseUrl: API_BASE_URL,
  timeoutMs: 10000,
  retries: 2,
  retryDelayMs: BSUIR_RETRY_DELAY_MS,
  retryMaxDelayMs: BSUIR_RETRY_MAX_DELAY_MS,
  retryJitter: BSUIR_RETRY_JITTER,
  userAgent: BSUIR_USER_AGENT,
});
