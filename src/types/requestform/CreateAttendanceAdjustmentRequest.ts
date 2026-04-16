import type { AttendanceAdjustmentTimeType } from "./RequestFormEnums";

export interface CreateAttendanceAdjustmentRequest {
  timeType: AttendanceAdjustmentTimeType;
  attendanceDate: string; // YYYY-MM-DD
  requestedTime: string;  // HH:mm / HH:mm:ss
  reason?: string;
  description: string;
}
