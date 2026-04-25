export interface UserResponse {
  id: string;
  username: string;
  fullName?: string;
  englishName?: string;
  avatarKey?: string;
  avatarUrl?: string;
  employeeCode?: string;
  attendanceCode?: string;
  departmentId?: string;
  departmentName?: string;
  groupId?: string;
  groupName?: string;
  positionId?: string;
  positionName?: string;
  jobTitleId?: string;
  jobTitleName?: string;
  passwordChangedAt?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
