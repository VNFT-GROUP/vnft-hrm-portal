export interface AttendanceMonthlySummaryResponse {
  id: string;
  userProfileId: string;
  attendanceCode: string;
  employeeCode: string;
  employeeName: string;
  summaryYear: number;
  summaryMonth: number;
  periodStartDate: string;
  periodEndDate: string;
  workingDays: number;
  workUnits: number;
  lateDays: number;
  absentDays: number;
  locked: boolean;
  note: string | null;
}
