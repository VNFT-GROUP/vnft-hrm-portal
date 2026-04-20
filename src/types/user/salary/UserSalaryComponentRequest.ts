import type { UserSalaryComponentItemRequest } from './UserSalaryComponentItemRequest';

export interface UserSalaryComponentRequest {
  effectiveFrom: string;
  note?: string;
  salaryComponents: UserSalaryComponentItemRequest[];
}
