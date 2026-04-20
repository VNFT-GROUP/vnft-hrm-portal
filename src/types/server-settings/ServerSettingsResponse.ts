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
  attendanceMajorLateEarlyViolationMinutes: number;
  attendanceMajorLateEarlyViolationFreeTimes: number;
  attendanceLeaveDeductionPerMajorLateEarlyViolation: number;
  attendanceDailySummaryEnabled: boolean;
  attendanceDailySummaryCron: string;
  userProfileDefaultRemainingLeaveDays: number;
  userProfileDefaultMaxLeaveDays: number;
  userProfileDefaultRemainingWfhDays: number;
  userProfileDefaultMaxWfhDays: number;
  attendanceLeaveDeductionPerExcessWfhDay: number;
  attendanceExcellentDisciplineAllowance: number;
  attendanceGoodDisciplineAllowance: number;
  attendanceAcceptableDisciplineAllowance: number;
}
