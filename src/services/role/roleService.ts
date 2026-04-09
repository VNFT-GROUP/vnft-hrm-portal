import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { RoleResponse } from "@/types/response/role/RoleResponse";
import type { UpsertRoleRequest } from "@/types/request/role/UpsertRoleRequest";

export const roleService = {
  createRole: async (
    data: UpsertRoleRequest,
  ): Promise<ApiResponse<RoleResponse>> => {
    const response = await apiClient.post("/roles", data);
    return response.data;
  },

  getRoleById: async (id: string): Promise<ApiResponse<RoleResponse>> => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  getRoles: async (
    search?: string,
  ): Promise<ApiResponse<RoleResponse[]>> => {
    const response = await apiClient.get("/roles", {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  updateRole: async (
    id: string,
    data: UpsertRoleRequest,
  ): Promise<ApiResponse<RoleResponse>> => {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },
};
