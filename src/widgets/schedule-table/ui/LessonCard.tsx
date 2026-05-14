import { Card, CardContent, Badge } from "@/shared/ui";
import type { ScheduleLesson } from "@/entities";
import { MapPinIcon, UserIcon, UsersIcon } from "lucide-react";
import { EmployeePopover } from "./EmployeePopover";

interface LessonCardProps {
  lesson: ScheduleLesson;
  showStudentGroups?: boolean;
}

function getLessonTypeVariant(
  type: string | null | undefined
): "default" | "secondary" | "destructive" | "outline" {
  const t = (type ?? "").toLowerCase();
  if (t.includes("лк") || t.includes("лекция")) return "default";
  if (t.includes("лр") || t.includes("лабораторная")) return "destructive";
  if (t.includes("пз") || t.includes("практика")) return "secondary";
  return "outline";
}

export function LessonCard({ lesson, showStudentGroups = false }: LessonCardProps) {
  const groupNames = (lesson.studentGroups ?? [])
    .map((group) => group.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="border-border/50 bg-background/50 transition-colors hover:bg-accent/50">
      <CardContent className="flex flex-col gap-2.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant={getLessonTypeVariant(lesson.lessonTypeAbbrev)}
            className="px-1.5 py-0 text-[10px] leading-4 font-semibold uppercase tracking-wider"
          >
            {lesson.lessonTypeAbbrev}
          </Badge>
          {lesson.numSubgroup !== 0 && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
              {lesson.numSubgroup} подгр.
            </span>
          )}
        </div>

        <div className="font-semibold leading-tight line-clamp-2" title={lesson.subjectFullName}>
          {lesson.subject}
        </div>

        <div className="mt-auto flex flex-col gap-1.5 text-xs text-muted-foreground">
          {showStudentGroups && groupNames && (
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-3.5 shrink-0" />
              <span className="truncate">{groupNames}</span>
            </div>
          )}

          {lesson.auditories?.length > 0 && (
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 shrink-0" />
              <span className="truncate">{lesson.auditories.join(", ")}</span>
            </div>
          )}

          {lesson.employees && lesson.employees.length > 0 && (
            <div className="flex items-center gap-1.5">
              <UserIcon className="size-3.5 shrink-0" />
              <div className="flex flex-wrap gap-x-1 gap-y-0.5 text-foreground">
                {(lesson.employees ?? []).map((employee, index, arr) => (
                  <EmployeePopover
                    key={`${employee.lastName}-${index}`}
                    employee={employee}
                    isLast={index === arr.length - 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
