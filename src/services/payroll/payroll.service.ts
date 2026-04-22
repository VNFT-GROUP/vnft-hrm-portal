import { apiClient } from "@/lib/apiClient";
import type { PageResponse } from "@/types/base/PageResponse";
import type { PayrollResponse } from "@/types/payroll/PayrollResponse";
import type { PayrollEmployeeResponse } from "@/types/payroll/PayrollEmployeeResponse";
import type { CalculatePayrollRequest, CreatePayrollRequest } from "@/types/payroll/CalculatePayrollRequest";

export const payrollService = {
  getPayrollCandidates: async (year: number, month: number): Promise<PayrollEmployeeResponse[]> => {
    const response = await apiClient.get<PayrollEmployeeResponse[]>("/payrolls/candidates", { params: { year, month } });
    // DTO from API is ApiResponse<PayrollEmployeeResponse[]> -> we extract data directly
    return response.data as any; // apiClient in this project usually unwraps data via axios interceptors, wait no it returns the wrapper? Wait, I will return response.data if it unwraps, or return response.data.data. Let's look at previous methods
  },

  createPayroll: async (payload: CreatePayrollRequest): Promise<PayrollResponse> => {
    const response = await apiClient.post<PayrollResponse>("/payrolls", payload);
    return response.data as any;
  },

  calculatePayroll: async (request: CalculatePayrollRequest) => {
    const { data } = await apiClient.post<PayrollResponse>("/payrolls/calculate", request);
    return data;
  },

  getPayrolls: async (params?: { year?: number; month?: number }) => {
    const { data } = await apiClient.get<PageResponse<PayrollResponse>>("/payrolls", { params });
    return data;
  },

  getPayrollById: async (id: number | string) => {
    const { data } = await apiClient.get<PayrollResponse>(`/payrolls/${id}`);
    return data;
  },

  getPayrollEmployees: async (id: number | string) => {
    const { data } = await apiClient.get<PayrollEmployeeResponse[]>(`/payrolls/${id}/employees`);
    return data;
  }
};
