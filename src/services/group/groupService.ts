import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { GroupResponse } from '@/types/group/GroupResponse';
import type { UpsertGroupRequest } from '@/types/group/UpsertGroupRequest';

export const groupService = {
  createGroup: async (
    data: UpsertGroupRequest,
  ): Promise<ApiResponse<GroupResponse>> => {
    const response = await apiClient.post("/groups", data);
    return response.data;
  },

  getGroupById: async (id: string): Promise<ApiResponse<GroupResponse>> => {
    const response = await apiClient.get(`/groups/${id}`);
    return response.data;
  },

  getGroups: async (
    search?: string,
  ): Promise<ApiResponse<GroupResponse[]>> => {
    const response = await apiClient.get("/groups", {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  updateGroup: async (
    id: string,
    data: UpsertGroupRequest,
  ): Promise<ApiResponse<GroupResponse>> => {
    const response = await apiClient.put(`/groups/${id}`, data);
    return response.data;
  },

  deleteGroup: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/groups/${id}`);
    return response.data;
  },
};
