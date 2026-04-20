import type { UserCompensationItemResponse } from './UserCompensationItemResponse';

export interface UserCompensationResponse {
  id: string;
  effectiveFrom: string;
  note: string;
  active: boolean;
  compensationItems: UserCompensationItemResponse[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
