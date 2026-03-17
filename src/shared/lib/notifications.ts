import { toast } from "sonner";

/** Показать уведомление об ошибке (тост). */
export function showError(message: string): void {
  toast.error(message);
}

/** Показать уведомление об успехе (тост). */
export function showSuccess(message: string): void {
  toast.success(message);
}

/** Показать информационное уведомление (тост). */
export function showInfo(message: string): void {
  toast.info(message);
}
