import axios from 'axios';
import type { ApiResponse, AuthResponse } from '@/types/auth';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// Error handler
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data && data.errorCode) {
      toast.error(data.errorMessage || "Đã xảy ra lỗi.");
      return Promise.reject(new Error(data.errorMessage || 'API Error'));
    }
    return response;
  },
  (error) => {
    const errMsg = error.response?.data?.errorMessage;
    if (errMsg) {
      toast.error(errMsg);
    } else if (error.message !== 'canceled') {
      toast.error("Lỗi kết nối, vui lòng thử lại.");
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: { username?: string; password?: string }): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },
};
