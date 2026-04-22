export interface PayrollImportRequest {
  employeeCode?: string;
  userProfileId?: number;
  targetSalary: number;
  commission: number;
  seniorityAllowance: number;
  performanceAttitudeAllowance: number;
  punctualityDisciplineAllowance: number;
  outstandingAllowance: number;
  hotBonus: number;
  monthlyBonus: number;
  businessTripFee: number;
  mealAllowance: number;
  clientEntertainment: number;
  personalIncomeTax: number;
  bankTransfer: number;
}

export interface CalculatePayrollRequest {
  year: number;
  month: number;
  name: string;
  note?: string;
  imports: PayrollImportRequest[];
}

export interface CreatePayrollRequest {
  year: number;
  month: number;
  name?: string;
  note?: string;
  userProfileIds?: string[];
  employeeCodes?: string[];
}
