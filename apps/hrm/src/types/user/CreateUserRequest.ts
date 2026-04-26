import type { UserFunctionType } from './UserFunctionType';

export interface CreateUserRequest {
  username: string;
  password: string;
  employeeCodeId: string;
  attendanceCode?: string;
  fullName: string;
  englishName: string;
  functionType?: UserFunctionType | null;
  departmentId?: string;
  groupId: string;
  positionId?: string;
  jobTitleId?: string;
}
