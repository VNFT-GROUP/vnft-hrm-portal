export interface AttendanceRecordResponse {
  id: string;
  userId: string;
  userProfileId: string;
  employeeCode: string;
  attendanceCode: string;
  employeeName: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  source?: string;
  rawPayload?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
