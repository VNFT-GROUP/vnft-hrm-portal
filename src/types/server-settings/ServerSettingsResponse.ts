export interface ServerSettingsResponse {
  timeZone: string;
  attendanceLateGraceMinutes: number;
  attendanceEarlyLeaveGraceMinutes: number;
  attendanceHalfWorkUnitHours: number;
  attendanceFullWorkUnitHours: number;
  attendanceMorningStart: string;
  attendanceMorningEnd: string;
  attendanceAfternoonStart: string;
  attendanceAfternoonEnd: string;
  attendanceLunchBreakStart: string;
  attendanceLunchBreakEnd: string;
  attendanceDailySummaryEnabled: boolean;
  attendanceDailySummaryCron: string;
}
