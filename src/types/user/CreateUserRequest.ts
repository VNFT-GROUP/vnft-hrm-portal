export interface CreateUserRequest {
  username: string;
  password: string;
  employeeCodeId: string;
  attendanceCode?: string;
  fullName: string;
  englishName: string;
  departmentId?: string;
  groupId?: string;
  positionId?: string;
  roleId?: string;
  checkInTime?: string;
  checkOutTime?: string;
}
