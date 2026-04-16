import type { AttendanceAdjustmentTimeType, RequestFormStatus, RequestFormType } from "./RequestFormEnums";

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
