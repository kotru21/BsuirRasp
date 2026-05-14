export interface StudentGroup {
  id: number;
  name: string;
  facultyId: number;
  facultyName: string;
  specialityDepartmentEducationFormId?: number;
  specialityName: string;
  course: number;
  calendarId: string;
  educationDegree?: number;
}
