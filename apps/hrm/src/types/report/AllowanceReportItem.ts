export interface AllowanceReportItem {
  userId: string;
  userProfileId: string;
  employeeCode: string;
  fullName: string;
  departmentId: string;
  departmentName: string;
  performanceScore: number;
  attendanceScore: number;
  performanceAllowance: number;
  attendanceAllowance: number;
  totalAllowance: number;
}

export interface AllowanceReportData {
  periodType: "MONTH" | "QUARTER";
  year: number;
  month: number | null;
  quarter: number | null;
  includedMonths: number[];
  items: AllowanceReportItem[];
}

export interface AllowanceReportResponse {
  data: AllowanceReportData;
  message?: string;
  status?: string;
}
