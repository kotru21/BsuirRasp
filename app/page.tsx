import { HomePage } from "@/views/home";
import { getStudentGroups } from "@/entities/student-group";
import { getCurrentWeek } from "@/entities/current-week";
import { getGroupSchedule } from "@/entities/schedule";

interface PageProps {
  searchParams: Promise<{ group?: string; week?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const groupNumber = params?.group;

  const [groups, currentWeek, schedule] = await Promise.all([
    getStudentGroups(),
    getCurrentWeek(),
    groupNumber ? getGroupSchedule(groupNumber).catch(() => null) : Promise.resolve(null),
  ]);

  return <HomePage groups={groups} schedule={schedule} currentWeek={currentWeek} />;
}
