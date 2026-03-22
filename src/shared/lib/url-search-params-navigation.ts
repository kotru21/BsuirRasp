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
