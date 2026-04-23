export interface CreatePayrollRequest {
  year: number;
  month: number;
  name?: string | null;
  note?: string | null;
  jobTitleIds?: string[] | null;
  userProfileIds?: string[] | null;
  employeeCodes?: string[] | null;
}

export interface PayrollCalculateRequest {
  year: number;
  month: number;
  name?: string | null;
  note?: string | null;
  jobTitleIds?: string[] | null;
  userProfileIds?: string[] | null;
  employeeCodes?: string[] | null;
  imports?: PayrollEmployeeImportRequest[] | null;
}

export interface PayrollEmployeeImportRequest {
  userProfileId?: string | null;
  employeeCode?: string | null;
  targetSalary?: number | null;
  commission?: number | null;
  seniorityAllowance?: number | null;
  performanceAttitudeAllowance?: number | null;
  punctualityDisciplineAllowance?: number | null;
  outstandingAllowance?: number | null;
  hotBonus?: number | null;
  monthlyBonus?: number | null;
  businessTripFee?: number | null;
  mealAllowance?: number | null;
  clientEntertainment?: number | null;
  personalIncomeTax?: number | null;
  bankTransfer?: number | null;
}
