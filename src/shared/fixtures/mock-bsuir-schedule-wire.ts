/**
 * Минимальное тело ответа ИИС для `schedule.getGroup`, достаточное для нормализации SDK.
 * Используется на `/mock-demo` без сети.
 */
export const MOCK_BSUIR_GROUP_SCHEDULE_WIRE = {
  studentGroupDto: {
    id: 1,
    name: "250500 (mock)",
    specialityName: "Демо-специальность",
  },
  schedules: {
    Понедельник: [],
    Вторник: [],
    Среда: [],
    Четверг: [],
    Пятница: [],
    Суббота: [],
  },
  startDate: "01.09.2025",
  endDate: "31.12.2025",
  startExamsDate: "01.01.2026",
  endExamsDate: "31.01.2026",
} as const;
