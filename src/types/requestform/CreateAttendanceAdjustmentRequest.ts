export type AttendanceAdjustmentTimeType = "CHECK_IN" | "CHECK_OUT";

export interface CreateAttendanceAdjustmentRequest {
  timeType: AttendanceAdjustmentTimeType;
  attendanceDate: string; // YYYY-MM-DD
  requestedTime: string;  // HH:mm / HH:mm:ss
  reason?: string;
  description: string;
}
