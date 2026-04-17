export interface AttendanceSettingsResponse {
  lateGraceMinutes: number;
  earlyCheckInIgnoreMinutes: number;
  halfWorkUnitHours: number;
  fullWorkUnitHours: number;
  lunchBreakStart: string;
  lunchBreakEnd: string;
}
