import type { AttendanceDailySummaryResponse } from "./AttendanceDailySummaryResponse";

export interface MonthlyAttendanceResponse {
  year: number;
  month: number;
  periodStartDate: string;
  periodEndDate: string;
  records: AttendanceDailySummaryResponse[];
}
