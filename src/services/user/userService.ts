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
import type { UserCompensationsResponse } from '@/types/user/salary/UserCompensationsResponse';
import type { UserCompensationResponse } from '@/types/user/salary/UserCompensationResponse';
import type { UpdateUserCompensationsRequest } from '@/types/user/salary/UpdateUserCompensationsRequest';
import type { ImportUserResponse } from '@/types/user/ImportUserResponse';

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
    departmentId?: string,
    positionId?: string,
  ): Promise<ApiResponse<PageResponse<UserResponse>>> => {
    const response = await apiClient.get("/users", {
      params: { 
        page, 
        size, 
        ...(keyword && { keyword }),
        ...(departmentId && { departmentId }),
        ...(positionId && { positionId }),
      },
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

  getUserCompensations: async (
    page: number = 1,
    size: number = 10,
  ): Promise<ApiResponse<PageResponse<UserCompensationsResponse>>> => {
    const response = await apiClient.get("/users/compensations", {
      params: { page, size },
    });
    return response.data;
  },

  getCompensations: async (
    id: string,
  ): Promise<ApiResponse<UserCompensationResponse[]>> => {
    const response = await apiClient.get(`/users/${id}/compensations`);
    return response.data;
  },

  updateCompensations: async (
    id: string,
    data: UpdateUserCompensationsRequest,
  ): Promise<ApiResponse<UserCompensationResponse[]>> => {
    const response = await apiClient.put(`/users/${id}/compensations`, data);
    return response.data;
  },

  importUsers: async (file: File): Promise<ApiResponse<ImportUserResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get("/users/import/template", {
      responseType: "blob",
    });
    return response.data;
  },
};
