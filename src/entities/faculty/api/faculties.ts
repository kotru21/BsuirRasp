import { bsuirClient } from "@/shared/api";
import type { Faculty } from "../model/types";

export async function getFaculties(): Promise<Faculty[]> {
  return bsuirClient.faculties.listAll();
}

