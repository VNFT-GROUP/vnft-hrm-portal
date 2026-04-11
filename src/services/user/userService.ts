import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { UserResponse } from "@/types/response/user/UserResponse";
import type { AdminCreateUserRequest } from "@/types/request/AdminCreateUserRequest";
import type { UpdateUserPasswordRequest } from "@/types/request/UpdateUserPasswordRequest";

export const userService = {
  createUser: async (
    data: AdminCreateUserRequest,
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
};
