import type { ScheduleLesson } from "@/entities/schedule";

export function formatLessonTime(lesson: ScheduleLesson): string {
  return `${lesson.startLessonTime} – ${lesson.endLessonTime}`;
}

export function formatEmployees(lesson: ScheduleLesson): string {
  if (!lesson.employees?.length) return "—";
  return lesson.employees
    .map((e) => {
      const first = e.firstName?.[0] ?? "";
      const middle = e.middleName?.[0] ?? "";
      return `${e.lastName} ${first}.${middle}.`.trim();
    })
    .join(", ");
}
