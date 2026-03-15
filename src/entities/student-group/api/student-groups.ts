import { api } from "@/shared/api";
import type { StudentGroup } from "../model/types";

export async function getStudentGroups(): Promise<StudentGroup[]> {
  return api.get<StudentGroup[]>("/student-groups");
}
