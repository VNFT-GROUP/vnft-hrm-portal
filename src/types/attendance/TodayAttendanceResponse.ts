export interface TodayAttendanceResponse {
  attendanceDate: string;
  attendanceCode: string;
  scheduledCheckIn?: string;
  scheduledCheckOut?: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInValid?: boolean;
  checkOutValid?: boolean;
  workMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  workUnit?: number;
  recorded: boolean;
}
