import type { UserSalaryComponentItemResponse } from './UserSalaryComponentItemResponse';

export interface UserSalaryComponentResponse {
  id: string;
  effectiveFrom: string;
  note: string;
  active: boolean;
  salaryComponents: UserSalaryComponentItemResponse[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
