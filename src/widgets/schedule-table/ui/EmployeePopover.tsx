import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui";
import type { ScheduleLesson } from "@/entities/schedule";
import { formatEmployeeShort } from "../lib/format-lesson";

type Employee = NonNullable<ScheduleLesson["employees"]>[number];

interface EmployeePopoverProps {
  employee: Employee;
  isLast?: boolean;
}

export function EmployeePopover({ employee, isLast }: EmployeePopoverProps) {
  const fullName = [employee.lastName, employee.firstName, employee.middleName]
    .filter(Boolean)
    .join(" ");

  const academicDepartment =
    (employee as unknown as { academicDepartment?: string[] | null })
      .academicDepartment ?? [];

  const rankAndDegree = [employee.rank, employee.degree].filter(Boolean).join(", ");

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        closeDelay={200}
        className="cursor-pointer rounded-sm px-0.5 py-0.5 text-left hover:underline decoration-dotted focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      >
        {formatEmployeeShort(employee)}
        {!isLast && ","}
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-64 p-3 text-xs">
        <div className="space-y-1.5">
          <div className="font-semibold leading-snug">{fullName}</div>
          {rankAndDegree && (
            <div className="text-muted-foreground leading-snug">{rankAndDegree}</div>
          )}
          {academicDepartment.length > 0 && (
            <div className="text-muted-foreground leading-snug">
              {academicDepartment.join(", ")}
            </div>
          )}
          <Link
            href={`/?employee=${employee.urlId}`}
            className="inline-flex pt-1 text-primary hover:underline"
          >
            Открыть расписание
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

