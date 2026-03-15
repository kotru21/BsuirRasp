import { API_BASE_URL } from "@/shared/config";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type FetchApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * GET-запрос к API с базовым URL и обработкой ошибок.
 */
export async function fetchApi<T>(path: string, options: FetchApiOptions = {}): Promise<T> {
  const base = API_BASE_URL.replace(/\/$/, "");
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const { body, ...init } = options;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(
      `API error: ${response.status} ${response.statusText}`,
      response.status,
      url
    );
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(`Invalid JSON response`, response.status, url);
  }
}
