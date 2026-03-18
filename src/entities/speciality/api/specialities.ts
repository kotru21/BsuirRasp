import { bsuirClient } from "@/shared/api";
import type { Speciality } from "../model/types";

export async function getSpecialities(): Promise<Speciality[]> {
  return bsuirClient.specialities.listAll();
}

