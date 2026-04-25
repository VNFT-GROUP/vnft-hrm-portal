import type { SalaryComponentCategory } from './SalaryComponentCategory';
import type { SalaryComponentCode } from './SalaryComponentCode';

export interface UserCompensationItemRequest {
  code: SalaryComponentCode;
  name: string;
  category: SalaryComponentCategory;
  amount: number;
  note?: string;
}
