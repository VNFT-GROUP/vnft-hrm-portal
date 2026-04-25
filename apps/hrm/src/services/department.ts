import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { DepartmentResponse } from '@/types/department/DepartmentResponse';
import type { UpsertDepartmentRequest } from '@/types/department/UpsertDepartmentRequest';

export const departmentService = {
  getDepartments: async (search?: string): Promise<ApiResponse<DepartmentResponse[]>> => {
    const response = await apiClient.get('/departments', { params: { search } });
    return response.data;
  },
  getDepartmentById: async (id: string): Promise<ApiResponse<DepartmentResponse>> => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },
  createDepartment: async (data: UpsertDepartmentRequest): Promise<ApiResponse<DepartmentResponse>> => {
    const response = await apiClient.post('/departments', data);
    return response.data;
  },
  updateDepartment: async (id: string, data: UpsertDepartmentRequest): Promise<ApiResponse<DepartmentResponse>> => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  },
  deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  }
};
