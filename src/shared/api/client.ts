import { fetchApi } from "@/shared/lib";

/**
 * Базовый клиент для запросов к ИИС БГУИР.
 * Все пути относительно https://iis.bsuir.by/api/v1
 */
export const api = {
  get: <T>(path: string, init?: RequestInit) => fetchApi<T>(path, { ...init, method: "GET" }),
};
