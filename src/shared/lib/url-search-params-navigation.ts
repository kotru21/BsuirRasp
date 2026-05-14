type SearchParamsSnapshot = Pick<URLSearchParams, "toString">;

/**
 * Снимок query из адресной строки. После `history.replaceState` (панель объявлений)
 * `useSearchParams()` Next может отставать; при `router.push` копировать параметры отсюда.
 */
export function getUrlSearchParamsForNavigation(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

/**
 * Для рендера: на клиенте — фактический query из `location` (в т.ч. после `replaceState`),
 * на сервере — из снимка RSC (`useSearchParams()`).
 */
export function getResolvedSearchParams(routerSearchParams: SearchParamsSnapshot): URLSearchParams {
  if (typeof window !== "undefined") {
    return getUrlSearchParamsForNavigation();
  }
  return new URLSearchParams(routerSearchParams.toString());
}
