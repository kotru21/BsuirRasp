export { bsuirClient } from "./bsuir-client";
export {
  getBsuirErrorMessage,
  isScheduleLastUpdateUnavailable,
} from "./bsuir-error";
export type {
  ApiDateResponse,
  BsuirClient,
  BsuirClientOptions,
  EmployeeCatalogItem,
  ReadOptions,
  RequestOptions,
  StudentGroupCatalogItem,
} from "./bsuir-types";
export { BsuirApiError, BsuirNetworkError, BsuirTimeoutError, BsuirValidationError } from "bsuir-iis-api";
