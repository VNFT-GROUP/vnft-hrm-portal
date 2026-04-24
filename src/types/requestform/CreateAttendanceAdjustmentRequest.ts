import type {
  AttendanceAdjustmentTimeType,
  AttendanceAdjustmentReasonType,
} from "./RequestFormEnums";

export interface CreateAttendanceAdjustmentRequest {
  description?: string | null;
  timeType: AttendanceAdjustmentTimeType;
  attendanceDate: string;       // YYYY-MM-DD
  requestedTime: string;        // HH:mm or HH:mm:ss
  reasonType: AttendanceAdjustmentReasonType;
}
