import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { UserProfileResponse } from "@/types/user/UserProfileResponse";
import type { UpdateCurrentUserProfileRequest } from "@/types/user/UpdateCurrentUserProfileRequest";
import type { ChangePasswordRequest } from "@/types/user/ChangePasswordRequest";

export const currentUserProfileService = {
  /**
   * API lấy hồ sơ của user hiện tại.
   */
  getCurrentUserProfile: async (): Promise<
    ApiResponse<UserProfileResponse>
  > => {
    const response =
      await apiClient.get<ApiResponse<UserProfileResponse>>("/users/me");
    return response.data;
  },

  /**
   * API tạo mới hoặc cập nhật hồ sơ của user hiện tại.
   */
  upsertCurrentUserProfile: async (
    data: UpdateCurrentUserProfileRequest,
  ): Promise<ApiResponse<UserProfileResponse>> => {
    const response = await apiClient.put<ApiResponse<UserProfileResponse>>(
      "/users/me",
      data,
    );
    return response.data;
  },

  /**
   * API đổi mật khẩu cho user hiện tại.
   */
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/me/change-password",
      data,
    );
    return response.data;
  },
};
