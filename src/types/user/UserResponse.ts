export interface UserResponse {
  id: string;
  username: string;
  fullName?: string;
  englishName?: string;
  employeeCode?: string;
  attendanceCode?: string;
  departmentId?: string;
  groupId?: string;
  positionId?: string;
  checkInTime?: string;
  checkOutTime?: string;
  passwordChangedAt?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
