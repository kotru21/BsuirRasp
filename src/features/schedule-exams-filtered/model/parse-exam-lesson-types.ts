/** Как в README `bsuir-iis-api`: getGroupFiltered(..., { source: "exams", lessonTypeAbbrev: [...] }) */
export const DEFAULT_EXAM_LESSON_TYPES = ["Консультация", "Экзамен"] as const;

/**
 * Query `examTypes` — значения через запятую (например `Консультация,Экзамен`).
 * Пусто или только пробелы → значения по умолчанию из README.
 */
export function parseExamLessonTypesParam(param: string | undefined): string[] {
  if (!param?.trim()) return [...DEFAULT_EXAM_LESSON_TYPES];
  const parts = param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [...DEFAULT_EXAM_LESSON_TYPES];
}
