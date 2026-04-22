import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";

export interface AttendanceDailySummaryResponse {
  id?: string | null;
  userId?: string | null;
  userProfileId?: string | null;
  employeeCode?: string | null;
  attendanceCode?: string | null;
  employeeName?: string | null;
  attendanceDate?: string | null;
  scheduledCheckIn?: string | null;
  scheduledCheckOut?: string | null;
  actualCheckIn?: string | null;
  actualCheckOut?: string | null;
  checkInValid?: boolean | null;
  checkOutValid?: boolean | null;
  workMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  workUnit?: number;
  absent?: boolean;
  locked?: boolean;
  note?: string;
  active?: boolean;
  recorded?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  requestForms?: RequestFormResponse[];
}
