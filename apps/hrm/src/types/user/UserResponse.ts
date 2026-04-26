import type { UserFunctionType } from './UserFunctionType';

export interface UserResponse {
  id: string;
  profileId?: string;
  username: string;
  fullName?: string;
  englishName?: string;
  functionType?: UserFunctionType | null;
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
