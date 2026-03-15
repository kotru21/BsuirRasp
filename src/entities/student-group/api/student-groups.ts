import { bsuirClient } from "@/shared/api";
import type { StudentGroup } from "../model/types";

export async function getStudentGroups(): Promise<StudentGroup[]> {
  const items = await bsuirClient.groups.listAll();
  return items.map((g) => ({
    id: g.id,
    name: g.name,
    facultyId: g.facultyId,
    facultyName: g.facultyName ?? "",
    specialityDepartmentEducationFormId: g.specialityDepartmentEducationFormId,
    specialityName: g.specialityName,
    course: g.course,
    calendarId: g.calendarId,
    educationDegree: g.educationDegree,
  }));
}
