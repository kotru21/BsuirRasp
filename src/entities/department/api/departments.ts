import { bsuirClient } from "@/shared/api";
import type { Department } from "../model/types";

export async function getDepartments(): Promise<Department[]> {
  return bsuirClient.departments.listAll();
}

