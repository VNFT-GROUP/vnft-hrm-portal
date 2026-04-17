export interface AttendanceSettingsResponse {
  lateGraceMinutes: number;
  earlyCheckInIgnoreMinutes: number;
  halfWorkUnitThresholdRatio: number;
  fullWorkUnitThresholdRatio: number;
  lunchBreakStart: string;
  lunchBreakEnd: string;
}
