import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { UserSessionResponse } from '@/types/response/user/UserSessionResponse';
import type { ChangeCurrentUserPasswordRequest } from '@/types/request/auth/ChangeCurrentUserPasswordRequest';

export const currentUserProfileService = {
  /**
   * Get current user session info
   */
  getUserSession: async (): Promise<ApiResponse<UserSessionResponse>> => {
    const response = await apiClient.get<ApiResponse<UserSessionResponse>>('/users/me');
    return response.data;
  },

  /**
   * Change current user's password
   */
  changePassword: async (data: ChangeCurrentUserPasswordRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/users/me/change-password', data);
    return response.data;
  },
};
