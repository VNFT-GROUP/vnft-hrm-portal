import type { SalaryComponentCategory } from './SalaryComponentCategory';
import type { SalaryComponentCode } from './SalaryComponentCode';

export interface UserSalaryComponentItemResponse {
  id: string;
  code: SalaryComponentCode;
  name: string;
  category: SalaryComponentCategory;
  amount: number;
  note: string;
  active: boolean;
}
