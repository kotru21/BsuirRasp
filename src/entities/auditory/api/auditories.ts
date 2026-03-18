import { bsuirClient } from "@/shared/api";
import type { Auditory } from "../model/types";

export async function getAuditories(): Promise<Auditory[]> {
  return bsuirClient.auditories.listAll();
}

