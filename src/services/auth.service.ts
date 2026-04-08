import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { AuthResponse } from '@/types/response/auth/AuthResponse';
import type { DefaultLoginRequest } from '@/types/request/auth/DefaultLoginRequest';

export const authService = {
  /**
   * API đăng nhập và cấp access token + refresh token cookie
   */
  login: async (data: DefaultLoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

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
