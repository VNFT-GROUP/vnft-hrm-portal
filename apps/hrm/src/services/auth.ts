import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { AuthResponse } from '@/types/auth/AuthResponse';

export const authService = {
  /**
   * API refresh session từ refresh token trong cookie
   */
  refresh: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data;
  },

  /**
   * API đăng xuất xóa cookie
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },
};
