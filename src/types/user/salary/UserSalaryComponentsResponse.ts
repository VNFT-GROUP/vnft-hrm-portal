import type { UserResponse } from '../UserResponse';
import type { UserSalaryComponentResponse } from './UserSalaryComponentResponse';

export interface UserSalaryComponentsResponse {
  user: UserResponse;
  salaryComponents: UserSalaryComponentResponse[];
}
