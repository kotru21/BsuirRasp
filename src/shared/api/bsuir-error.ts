import {
  BsuirApiError,
  BsuirConfigurationError,
  BsuirNetworkError,
  BsuirResponseValidationError,
  BsuirTimeoutError,
  BsuirValidationError,
} from "bsuir-iis-api";

function isTlsTrustFailure(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const rec = error as { code?: string; message?: string; cause?: unknown };
  if (
    rec.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    rec.code === "CERT_HAS_EXPIRED" ||
    rec.code === "SELF_SIGNED_CERT_IN_CHAIN"
  ) {
    return true;
  }
  if (
    typeof rec.message === "string" &&
    /unable to verify the first certificate/i.test(rec.message)
  ) {
    return true;
  }
  if (rec.cause !== undefined) return isTlsTrustFailure(rec.cause);
  return false;
}

/**
 * Сообщение для пользователя по типу ошибки bsuir-iis-api.
 */
export function getBsuirErrorMessage(error: unknown): string {
  if (error instanceof BsuirApiError) {
    if (error.status === 404) return "Данные не найдены";
    return `Ошибка сервера (${error.status})`;
  }
  if (error instanceof BsuirConfigurationError) {
    return "Клиент API не настроен: в среде нет fetch — передайте fetch в createBsuirClient.";
  }
  if (error instanceof BsuirValidationError) return "Неверный запрос";
  if (error instanceof BsuirResponseValidationError) {
    return "API вернул неожиданный формат данных";
  }
  if (error instanceof BsuirTimeoutError) return "Превышено время ожидания";
  if (error instanceof BsuirNetworkError) {
    const chain = error.cause;
    if (isTlsTrustFailure(error) || isTlsTrustFailure(chain)) {
      return "Проверка TLS к API не прошла. За корпоративным прокси: bun run dev:system-ca.";
    }
    return "Сеть недоступна";
  }
  return "Не удалось загрузить данные";
}
