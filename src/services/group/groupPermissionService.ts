import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { GroupPermissionResponse } from "@/types/group/GroupPermissionResponse";
import type { UpsertGroupPermissionRequest } from "@/types/group/UpsertGroupPermissionRequest";

export const groupPermissionService = {
  createGroupPermission: async (
    data: UpsertGroupPermissionRequest,
  ): Promise<ApiResponse<GroupPermissionResponse>> => {
    const response = await apiClient.post("/group-permissions", data);
    return response.data;
  },

  getGroupPermissionById: async (
    id: string,
  ): Promise<ApiResponse<GroupPermissionResponse>> => {
    const response = await apiClient.get(`/group-permissions/${id}`);
    return response.data;
  },

  getGroupPermissions: async (
    search?: string,
  ): Promise<ApiResponse<GroupPermissionResponse[]>> => {
    const response = await apiClient.get("/group-permissions", {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  updateGroupPermission: async (
    id: string,
    data: UpsertGroupPermissionRequest,
  ): Promise<ApiResponse<GroupPermissionResponse>> => {
    const response = await apiClient.put(`/group-permissions/${id}`, data);
    return response.data;
  },

  deleteGroupPermission: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/group-permissions/${id}`);
    return response.data;
  },
};
