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
  standardWorkdays: number;
  workingDays: number;
  workUnits: number;
  lateDays: number;
  absentDays: number;
  majorLateEarlyViolationTimes: number;
  leaveDeductionViolationTimes: number;
  leaveDeductionDays: number;
  approvedWfhDays: number;
  wfhOverLimitDays: number;
  wfhLeaveDeductionDays: number;
  disciplineScore: number;
  punctualityDisciplineAllowance: number;
  locked: boolean;
  note: string | null;
}
