import type { SdkInsightsData, SummaryRow, SummarySection } from "../types";

export function buildSummarySections(insights: SdkInsightsData | null): SummarySection[] {
  if (!insights) return [];

  const { pageContext } = insights.raw;
  const isSchedulePage = Boolean(pageContext.scheduleMode && pageContext.scheduleKey);
  const isEmployeePage = pageContext.scheduleMode === "employee";
  const hasDepartmentContext = pageContext.departmentId !== null;

  const sections: SummarySection[] = [];

  if (isSchedulePage) {
    sections.push({
      title: "Неделя",
      rows: [
        { label: "Текущая неделя (SDK)", value: insights.weeks.currentWeek },
      ],
    });

    sections.push({
      title: "Расписание",
      rows: [
        { label: "Экзамены", value: insights.schedule.examsCount },
        {
          label: "Пары на текущей неделе",
          value: insights.schedule.currentWeekLessons,
        },
        {
          label: "Пары подгруппы 1",
          value: insights.schedule.subgroup1Lessons,
        },
        {
          label: "Пары подгруппы 2",
          value: insights.schedule.subgroup2Lessons,
        },
      ],
    });
  }

  const announcementRows: SummaryRow[] = [];
  if (isEmployeePage) {
    announcementRows.push({
      label: "По преподавателю",
      value: insights.announcements.employeeCount,
    });
  }
  if (hasDepartmentContext) {
    announcementRows.push({
      label: "По кафедре",
      value: insights.announcements.departmentCount,
    });
  }
  if (announcementRows.length > 0) {
    sections.push({
      title: "Объявления",
      rows: announcementRows,
    });
  }

  const adv = insights.advanced;
  if (adv) {
    const rawRows: SummaryRow[] = [
      { label: "Запрошен raw-ответ (`rawSchedule=1`)", value: adv.rawSchedule.requested },
    ];
    if (adv.rawSchedule.requested) {
      rawRows.push({
        label: "Сырой payload получен",
        value: adv.rawSchedule.payload !== null,
      });
    }
    sections.push({ title: "SDK raw / сравнение ключей", rows: rawRows });

    if (isSchedulePage) {
      const nu = adv.lastUpdateByNumericId;
      const nuRows: SummaryRow[] = nu.error
        ? [{ label: "Ошибка (by id)", value: nu.error }]
        : [
            {
              label: "Дата (by id)",
              value:
                nu.date ??
                "нет ответа (легаси last-update ИИС, часто 404)",
            },
          ];
      nuRows.push({
        label: "Совпадает с запросом по строковому ключу",
        value: nu.matchesStringKey,
      });
      sections.push({ title: "Last update по numeric id", rows: nuRows });
    }
  }

  return sections;
}
