import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { EmployeeCodeResponse } from '@/types/user/EmployeeCodeResponse';
import type { UpsertEmployeeCodeRequest } from '@/types/user/UpsertEmployeeCodeRequest';
import type { UpdateEmployeeCodeDescriptionRequest } from '@/types/user/UpdateEmployeeCodeDescriptionRequest';

export const employeeCodeService = {
  getEmployeeCodes: async (): Promise<ApiResponse<EmployeeCodeResponse[]>> => {
    const response = await apiClient.get('/employee-codes');
    return response.data;
  },
  getEmployeeCodeById: async (id: string): Promise<ApiResponse<EmployeeCodeResponse>> => {
    const response = await apiClient.get(`/employee-codes/${id}`);
    return response.data;
  },
  createEmployeeCode: async (data: UpsertEmployeeCodeRequest): Promise<ApiResponse<EmployeeCodeResponse>> => {
    const response = await apiClient.post('/employee-codes', data);
    return response.data;
  },
  updateEmployeeCode: async (id: string, data: UpsertEmployeeCodeRequest): Promise<ApiResponse<EmployeeCodeResponse>> => {
    const response = await apiClient.put(`/employee-codes/${id}`, data);
    return response.data;
  },
  toggleActiveEmployeeCode: async (id: string): Promise<ApiResponse<EmployeeCodeResponse>> => {
    const response = await apiClient.patch(`/employee-codes/${id}/toggle-active`);
    return response.data;
  },
  updateEmployeeCodeDescription: async (id: string, data: UpdateEmployeeCodeDescriptionRequest): Promise<ApiResponse<EmployeeCodeResponse>> => {
    const response = await apiClient.patch(`/employee-codes/${id}/description`, data);
    return response.data;
  }
};
