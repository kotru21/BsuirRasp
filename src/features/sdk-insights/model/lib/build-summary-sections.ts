import type { SdkInsightsData, SummaryRow, SummarySection } from "../types";

export function buildSummarySections(insights: SdkInsightsData | null): SummarySection[] {
  if (!insights) return [];

  const { pageContext } = insights.raw;
  const isSchedulePage = Boolean(pageContext.scheduleMode && pageContext.scheduleKey);
  const isEmployeePage = pageContext.scheduleMode === "employee";
  const hasDepartmentContext = pageContext.departmentId !== null;

  const sections: SummarySection[] = [];

  sections.push({
    title: "Справочники (listAll)",
    rows: [
      { label: "Группы (pageData, groups.listAll)", value: insights.raw.pageData.groups.length },
      {
        label: "Преподаватели (pageData, employees.listAll)",
        value: insights.raw.pageData.employees.length,
      },
      { label: "Факультеты (references)", value: insights.references.faculties },
      { label: "Кафедры (references)", value: insights.references.departments },
      { label: "Специальности (references)", value: insights.references.specialities },
      { label: "Аудитории (references)", value: insights.references.auditories },
    ],
  });

  if (isSchedulePage) {
    sections.push({
      title: "Неделя",
      rows: [
        { label: "Текущая неделя (schedule.getCurrentWeek)", value: insights.weeks.currentWeek },
        {
          label: "Текущая неделя в pageData",
          value: insights.raw.pageData.currentWeek,
        },
      ],
    });

    sections.push({
      title: "Last update (легаси ИИС)",
      rows: [
        {
          label: "Строка для UI (getScheduleLastUpdate*)",
          value:
            insights.raw.pageData.lastUpdateDate ?? "нет данных (эндпоинт не отвечает / легаси)",
        },
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
              value: nu.date ?? "нет ответа (легаси last-update ИИС, часто 404)",
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
