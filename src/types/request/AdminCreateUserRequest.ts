export interface AdminCreateUserRequest {
  username: string;
  password: string;
  employeeCodeId: string;
  attendanceCode?: string;
  fullName: string;
  englishName: string;
  departmentId?: string;
  groupId?: string;
  positionId?: string;
  checkInTime?: string;
  checkOutTime?: string;
}
