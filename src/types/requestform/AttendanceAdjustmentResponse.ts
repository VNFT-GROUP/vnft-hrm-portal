import type { AttendanceAdjustmentTimeType } from "./CreateAttendanceAdjustmentRequest";

export type RequestFormType = "ATTENDANCE_ADJUSTMENT" | "ABSENT" | "LEAVE" | "RESIGNATION" | "BUSINESS_TRIP" | "WFH" | string;
export type RequestFormStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | string;

export interface AttendanceAdjustmentResponse {
  id: string;
  requestFormId: string;
  requesterId: string;
  type: RequestFormType;
  status: RequestFormStatus;
  reason: string;
  description: string;
  timeType: AttendanceAdjustmentTimeType;
  attendanceDate: string; // YYYY-MM-DD
  requestedTime: string;  // HH:mm / HH:mm:ss
  submittedAt: string;    // ISO Instant
  approvedAt?: string;
  rejectedAt?: string;
  canceledAt?: string;
  active: boolean;
  createdAt: string;      // ISO Instant
  updatedAt: string;      // ISO Instant
  createdBy: string;
  updatedBy: string;
}
