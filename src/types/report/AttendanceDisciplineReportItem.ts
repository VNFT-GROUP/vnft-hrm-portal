export interface AttendanceDisciplineReportItem {
  userId: string;
  userProfileId: string;
  employeeCode: string;
  fullName: string;
  departmentId: string | null;
  departmentName: string | null;
  attendanceScore: number;
  attendanceAllowance: number;
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
  lockedMonths: number;
  note: string | null;
}

export interface AttendanceDisciplineReportResponse {
  data: {
    periodType: "MONTH" | "QUARTER";
    year: number;
    month: number | null;
    quarter: number | null;
    includedMonths: number[];
    items: AttendanceDisciplineReportItem[];
  };
  errorCode?: number | null;
  errorMessage?: string | null;
}
