import type { ScheduleLesson } from "@/entities";

export function formatLessonTime(lesson: ScheduleLesson): string {
  return `${lesson.startLessonTime} – ${lesson.endLessonTime}`;
}

type Employee = NonNullable<ScheduleLesson["employees"]>[number];

export function formatEmployeeShort(employee: Employee): string {
  const first = employee.firstName?.[0] ?? "";
  const middle = employee.middleName?.[0] ?? "";
  return `${employee.lastName} ${first}.${middle}.`.trim();
}

export function formatEmployeeTooltip(employee: Employee): string {
  const fullName = [employee.lastName, employee.firstName, employee.middleName]
    .filter(Boolean)
    .join(" ");

  const extras: string[] = [];

  if (employee.rank) extras.push(employee.rank);
  if (employee.degree) extras.push(employee.degree);

  const academicDepartment =
    (employee as unknown as { academicDepartment?: string[] | null }).academicDepartment ??
    undefined;

  if (academicDepartment?.length) {
    extras.push(academicDepartment.join(", "));
  }

  if (!extras.length) return fullName || formatEmployeeShort(employee);

  return `${fullName} — ${extras.join(", ")}`;
}

export function formatEmployees(lesson: ScheduleLesson): string {
  if (!lesson.employees?.length) return "—";
  return lesson.employees.map(formatEmployeeShort).join(", ");
}
