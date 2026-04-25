import type { UserCompensationResponse } from './UserCompensationResponse';

export interface UserCompensationsResponse {
  userId: string;
  userProfileId: string;
  employeeCode: string;
  fullName: string;
  englishName: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  compensations: UserCompensationResponse[];
}
