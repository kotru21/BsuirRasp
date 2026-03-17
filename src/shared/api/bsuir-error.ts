import {
  BsuirApiError,
  BsuirNetworkError,
  BsuirTimeoutError,
  BsuirValidationError,
} from "bsuir-iis-api";

/**
 * Возвращает сообщение для пользователя по типу ошибки bsuir-iis-api.
 * Используется при обработке запросов к API (instanceof).
 */
export function getBsuirErrorMessage(error: unknown): string {
  if (error instanceof BsuirApiError) {
    if (error.status === 404) return "Группа или данные не найдены";
    return `Ошибка сервера (${error.status})`;
  }
  if (error instanceof BsuirValidationError) return "Неверный запрос";
  if (error instanceof BsuirTimeoutError) return "Превышено время ожидания";
  if (error instanceof BsuirNetworkError) return "Сеть недоступна";
  return "Не удалось загрузить данные";
}
