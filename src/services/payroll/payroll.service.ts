import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PayrollResponse, PayrollEmployeeResponse } from "@/types/payroll/PayrollResponse";
import type { CreatePayrollRequest, PayrollCalculateRequest } from "@/types/payroll/CalculatePayrollRequest";

export const payrollService = {
  createPayroll: async (payload: CreatePayrollRequest): Promise<PayrollResponse> => {
    const { data } = await apiClient.post<ApiResponse<PayrollResponse>>("/payrolls", payload);
    return data.data!;
  },

  calculatePayroll: async (payload: PayrollCalculateRequest): Promise<PayrollResponse> => {
    const { data } = await apiClient.post<ApiResponse<PayrollResponse>>("/payrolls/calculate", payload);
    return data.data!;
  },

  getPayrollByYearMonth: async (year: number, month: number): Promise<PayrollResponse | null> => {
    const { data } = await apiClient.get<ApiResponse<PayrollResponse>>("/payrolls", { params: { year, month } });
    return data.data ?? null;
  },

  getPayrollById: async (id: string): Promise<PayrollResponse> => {
    const { data } = await apiClient.get<ApiResponse<PayrollResponse>>(`/payrolls/${id}`);
    return data.data!;
  },

  getPayrollEmployees: async (id: string): Promise<PayrollEmployeeResponse[]> => {
    const { data } = await apiClient.get<ApiResponse<PayrollEmployeeResponse[]>>(`/payrolls/${id}/employees`);
    return data.data ?? [];
  },

  getPayrollCandidates: async (year: number, month: number): Promise<PayrollEmployeeResponse[]> => {
    const { data } = await apiClient.get<ApiResponse<PayrollEmployeeResponse[]>>("/payrolls/candidates", {
      params: { year, month },
    });
    return data.data ?? [];
  },
};
