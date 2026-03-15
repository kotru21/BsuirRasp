import { createBsuirClient } from "bsuir-iis-api";
import { API_BASE_URL } from "@/shared/config";

export const bsuirClient = createBsuirClient({
  baseUrl: API_BASE_URL,
  timeoutMs: 10000,
  retries: 2,
});
