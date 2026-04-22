export interface PayrollResponse {
  id: number;
  name: string;
  payrollYear: number;
  payrollMonth: number;
  periodStartDate: string;
  periodEndDate: string;
  status: string;
  totalWorkdaySalary: number;
  totalTaxableIncome: number;
  totalAssessableIncome: number;
  totalNetSalary: number;
  totalBankTransfer: number;
  totalCashPayment: number;
}
