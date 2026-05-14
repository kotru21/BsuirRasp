import type { SdkInsightsData } from "../types";

function stringify(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function buildJsonDumps(insights: SdkInsightsData | null) {
  if (!insights) {
    return {
      raw: "null",
      pageContext: "null",
      pageData: "null",
      pageErrors: "null",
      references: stringify(null),
      schedule: stringify(null),
      announcements: stringify(null),
      advanced: stringify(null),
    };
  }

  return {
    raw: stringify(insights),
    pageContext: stringify(insights.raw.pageContext),
    pageData: stringify(insights.raw.pageData),
    pageErrors: stringify(insights.raw.pageErrors),
    references: stringify({
      faculties: insights.raw.faculties,
      departments: insights.raw.departments,
      specialities: insights.raw.specialities,
      auditories: insights.raw.auditories,
    }),
    schedule: stringify({
      exams: insights.raw.exams,
      filteredCurrentWeek: insights.raw.filteredCurrentWeek,
      subgroup1: insights.raw.subgroup1,
      subgroup2: insights.raw.subgroup2,
      lastUpdateDate: insights.raw.lastUpdateDate,
    }),
    announcements: stringify({
      employeeItems: insights.announcements.employeeItems,
      departmentItems: insights.announcements.departmentItems,
    }),
    advanced: insights.advanced ? stringify(insights.advanced) : stringify(null),
  };
}
