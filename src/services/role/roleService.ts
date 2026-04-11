import apiClient from '../apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { RoleResponse } from '@/types/role/RoleResponse';
import type { UpsertRoleRequest } from '@/types/role/UpsertRoleRequest';

const ENDPOINT = '/roles';

export const roleService = {
  createRole: async (data: UpsertRoleRequest): Promise<RoleResponse> => {
    const response = await apiClient.post<ApiResponse<RoleResponse>>(ENDPOINT, data);
    return response.data;
  },

  getRoleById: async (id: string): Promise<RoleResponse> => {
    const response = await apiClient.get<ApiResponse<RoleResponse>>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  getRoles: async (search?: string): Promise<ApiResponse<RoleResponse[]>> => {
    const params = search ? { search } : {};
    return apiClient.get<ApiResponse<RoleResponse[]>>(ENDPOINT, { params });
  },

  updateRole: async (id: string, data: UpsertRoleRequest): Promise<RoleResponse> => {
    const response = await apiClient.put<ApiResponse<RoleResponse>>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  }
};
