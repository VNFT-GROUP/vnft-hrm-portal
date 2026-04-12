import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { UserResponse } from '@/types/user/UserResponse';
import type { CreateUserRequest } from '@/types/user/CreateUserRequest';
import type { UpdateUserPasswordRequest } from '@/types/user/UpdateUserPasswordRequest';
import type { UpdateUserWorkInformationRequest } from '@/types/user/UpdateUserWorkInformationRequest';
import type { UserWorkInformationResponse } from '@/types/user/UserWorkInformationResponse';

export const userService = {
  createUser: async (
    data: CreateUserRequest,
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  getUsers: async (
    page: number = 1,
    size: number = 10,
  ): Promise<ApiResponse<PageResponse<UserResponse>>> => {
    const response = await apiClient.get("/users", {
      params: { page, size },
    });
    return response.data;
  },

  updatePassword: async (
    id: string,
    data: UpdateUserPasswordRequest,
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.put(`/users/${id}/password`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  updateWorkInformation: async (
    id: string,
    data: UpdateUserWorkInformationRequest,
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.put(`/users/${id}/work-information`, data);
    return response.data;
  },

  getWorkInformation: async (
    id: string,
  ): Promise<ApiResponse<UserWorkInformationResponse>> => {
    const response = await apiClient.get(`/users/${id}/work-information`);
    return response.data;
  },
};
