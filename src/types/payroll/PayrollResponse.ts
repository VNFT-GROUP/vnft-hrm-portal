export type PayrollStatus =
  | "DRAFT"
  | "CALCULATED"
  | "FINALIZED"
  | "APPROVED"
  | "LOCKED"
  | "CANCELED";

export interface PayrollTotalsResponse {
  employeeCount: number;
  basicSalary: number;
  targetSalary: number;
  targetThreshold: number;
  commission: number;
  parkingAllowance: number;
  fuelAllowance: number;
  phoneAllowance: number;
  seniorityAllowance: number;
  performanceAttitudeAllowance: number;
  punctualityDisciplineAllowance: number;
  outstandingAllowance: number;
  insuranceBalance: number;
  usaOfficeAllowance: number;
  hotBonus: number;
  monthlyBonus: number;
  managementAllowance: number;
  businessTripFee: number;
  mealAllowance: number;
  jobAllowance: number;
  clientEntertainment: number;
  socialInsuranceSalary: number;
  companySocialInsurance: number;
  companyHealthInsurance: number;
  companyUnemploymentInsurance: number;
  employeeSocialInsurance: number;
  employeeHealthInsurance: number;
  employeeUnemploymentInsurance: number;
  workdaySalary: number;
  taxableIncome: number;
  personalDeduction: number;
  dependentCount: number;
  dependentTaxDeductionAmount: number;
  dependentDeduction: number;
  assessableIncome: number;
  personalIncomeTax: number;
  netSalary: number;
  bankTransfer: number;
  cashPayment: number;
  standardWorkdays: number;
  actualWorkdays: number;
}

export interface PayrollResponse {
  id: string;
  name: string;
  payrollYear: number;
  payrollMonth: number;
  periodStartDate: string;
  periodEndDate: string;
  status: PayrollStatus;
  calculatedAt?: string | null;
  snapshotAt?: string | null;
  approvedAt?: string | null;
  lockedAt?: string | null;
  canceledAt?: string | null;
  note?: string | null;
  totalWorkdaySalary: number;
  totalTaxableIncome: number;
  totalAssessableIncome: number;
  totalNetSalary: number;
  totalBankTransfer: number;
  totalCashPayment: number;
  totals: PayrollTotalsResponse;
  employees: PayrollEmployeeResponse[];
}

export interface PayrollEmployeeResponse {
  id: string;
  userId?: string | null;
  userProfileId: string;
  personnelCode?: string | null;
  personnelName?: string | null;
  avatarUrl?: string | null;
  departmentName?: string | null;
  basicSalary: number;
  targetSalary: number;
  targetThreshold: number;
  commission: number;
  parkingAllowance: number;
  fuelAllowance: number;
  phoneAllowance: number;
  seniorityAllowance: number;
  performanceAttitudeAllowance: number;
  punctualityDisciplineAllowance: number;
  outstandingAllowance: number;
  insuranceBalance: number;
  usaOfficeAllowance: number;
  hotBonus: number;
  monthlyBonus: number;
  managementAllowance: number;
  businessTripFee: number;
  mealAllowance: number;
  jobAllowance: number;
  clientEntertainment: number;
  socialInsuranceSalary: number;
  companySocialInsurance: number;
  companyHealthInsurance: number;
  companyUnemploymentInsurance: number;
  employeeSocialInsurance: number;
  employeeHealthInsurance: number;
  employeeUnemploymentInsurance: number;
  workdaySalary: number;
  taxableIncome: number;
  personalDeduction: number;
  dependentCount: number;
  dependentTaxDeductionAmount: number;
  dependentDeduction: number;
  assessableIncome: number;
  personalIncomeTax: number;
  netSalary: number;
  bankTransfer: number;
  cashPayment: number;
  salaryNote?: string | null;
  standardWorkdays: number;
  actualWorkdays: number;
}
