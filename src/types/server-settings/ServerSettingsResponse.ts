export interface ServerSettingsResponse {
  timeZone: string;
  attendanceLateGraceMinutes: number;
  attendanceEarlyLeaveGraceMinutes: number;
  attendanceHalfWorkUnitHours: number;
  attendanceFullWorkUnitHours: number;
  attendanceLunchBreakStart: string;
  attendanceLunchBreakEnd: string;
  attendanceDailySummaryEnabled: boolean;
  attendanceDailySummaryCron: string;
}
