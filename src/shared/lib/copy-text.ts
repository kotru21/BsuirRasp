/** Копирование в буфер обмена; `false` при отказе окружения или ошибке. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
