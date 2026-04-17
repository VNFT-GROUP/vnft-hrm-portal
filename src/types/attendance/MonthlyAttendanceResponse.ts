import type { AttendanceDailySummaryResponse } from "./AttendanceDailySummaryResponse";
import type { AttendanceMonthlySummaryResponse } from "./AttendanceMonthlySummaryResponse";

export interface MonthlyAttendanceResponse {
  year: number;
  month: number;
  periodStartDate: string;
  periodEndDate: string;
  summary: AttendanceMonthlySummaryResponse | null;
  records: AttendanceDailySummaryResponse[];
}
