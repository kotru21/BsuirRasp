export const API_BASE_URL = "https://iis.bsuir.by/api/v1";

/** Задержка перед повтором запроса (мс). */
export const BSUIR_RETRY_DELAY_MS = 300;
/** Максимальная задержка ретрая с backoff (мс). */
export const BSUIR_RETRY_MAX_DELAY_MS = 3000;
/** Включить jitter для ретраев. */
export const BSUIR_RETRY_JITTER = true;
/** User-Agent для запросов к BSUIR API. */
export const BSUIR_USER_AGENT = "BsuirRasp/0.1.0";

/** Формат даты в API: DD.MM.YYYY */
export const API_DATE_FORMAT = "dd.MM.yyyy";

/** Формат времени в API: HH:mm */
export const API_TIME_FORMAT = "HH:mm";

export type { ThemeValue } from "./theme";
export { THEME_LABELS } from "./theme";

export {
  BSUIR_IIS_API_NPM_URL,
  BSUIR_IIS_API_README_URL,
  BSUIR_IIS_API_REPO_URL,
  BSUIR_IIS_API_VERSION,
} from "./bsuir-sdk-meta";

export { getMetadataBase } from "./site-url";

export {
  OPEN_GRAPH_DEFAULT_IMAGE_ALT,
  OPEN_GRAPH_DEFAULT_IMAGE_PATH,
  OPEN_GRAPH_DEFAULT_IMAGE_SIZE,
} from "./open-graph-defaults";
