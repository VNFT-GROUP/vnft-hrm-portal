import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { UserResponse } from '@/types/user/UserResponse';
import type { CreateUserRequest } from '@/types/user/CreateUserRequest';
import type { UpdateUserPasswordRequest } from '@/types/user/UpdateUserPasswordRequest';
import type { UpdateUserWorkInformationRequest } from '@/types/user/UpdateUserWorkInformationRequest';
import type { UserWorkInformationResponse } from '@/types/user/UserWorkInformationResponse';
import type { UpdateUserGroupRequest } from '@/types/user/UpdateUserGroupRequest';
import type { UserGroupResponse } from '@/types/user/UserGroupResponse';
import type { UpdateUserProfileRequest } from '@/types/user/UpdateUserProfileRequest';
import type { UserProfileResponse } from '@/types/user/UserProfileResponse';
import type { UserSalaryComponentsResponse } from '@/types/user/salary/UserSalaryComponentsResponse';
import type { UserSalaryComponentResponse } from '@/types/user/salary/UserSalaryComponentResponse';
import type { UpdateUserSalaryComponentsRequest } from '@/types/user/salary/UpdateUserSalaryComponentsRequest';

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
    keyword?: string,
  ): Promise<ApiResponse<PageResponse<UserResponse>>> => {
    const response = await apiClient.get("/users", {
      params: { page, size, ...(keyword && { keyword }) },
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

  getGroup: async (
    id: string,
  ): Promise<ApiResponse<UserGroupResponse>> => {
    const response = await apiClient.get(`/users/${id}/group`);
    return response.data;
  },

  updateGroup: async (
    id: string,
    data: UpdateUserGroupRequest,
  ): Promise<ApiResponse<UserGroupResponse>> => {
    const response = await apiClient.put(`/users/${id}/group`, data);
    return response.data;
  },

  getProfile: async (
    id: string,
  ): Promise<ApiResponse<UserProfileResponse>> => {
    const response = await apiClient.get(`/users/${id}/profile`);
    return response.data;
  },

  updateProfile: async (
    id: string,
    data: UpdateUserProfileRequest,
  ): Promise<ApiResponse<UserProfileResponse>> => {
    const response = await apiClient.put(`/users/${id}/profile`, data);
    return response.data;
  },

  getUserSalaryComponents: async (
    page: number = 1,
    size: number = 10,
  ): Promise<ApiResponse<PageResponse<UserSalaryComponentsResponse>>> => {
    const response = await apiClient.get("/users/salary-components", {
      params: { page, size },
    });
    return response.data;
  },

  getSalaryComponents: async (
    id: string,
  ): Promise<ApiResponse<UserSalaryComponentResponse[]>> => {
    const response = await apiClient.get(`/users/${id}/salary-components`);
    return response.data;
  },

  updateSalaryComponents: async (
    id: string,
    data: UpdateUserSalaryComponentsRequest,
  ): Promise<ApiResponse<UserSalaryComponentResponse[]>> => {
    const response = await apiClient.put(`/users/${id}/salary-components`, data);
    return response.data;
  },
};
