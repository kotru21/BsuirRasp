import { bsuirClient } from "@/shared/api";
import type { Employee } from "../model/types";

export async function getEmployees(): Promise<Employee[]> {
  const items = await bsuirClient.employees.listAll();
  return items.map((e) => ({
    id: e.id,
    urlId: e.urlId,
    fio: e.fio,
    firstName: e.firstName,
    lastName: e.lastName,
    middleName: e.middleName,
    rank: e.rank,
    degree: e.degree,
    academicDepartment: e.academicDepartment,
  }));
}

