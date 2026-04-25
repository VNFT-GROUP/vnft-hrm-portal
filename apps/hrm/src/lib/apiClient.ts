import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { AuthResponse } from '@/types/auth/AuthResponse';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Bắt buộc bật để tự động cookie qua header
});

// Cache Refresh Promise để chống việc call /refresh nhiều lần cùng lúc
let refreshTokenPromise: Promise<string | void> | null = null;

// Gắn Access Token (nếu có) trước khi gửi
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý tự động Refresh Token và Error Handler
apiClient.interceptors.response.use(
  (response) => {
    // Trường hợp Backend trả 200 OK nhưng body có chứa errorCode (lỗi logic nghiệp vụ)
    const data = response.data as ApiResponse<unknown>;
    if (data && data.errorCode) {
      // Dùng Sonner để báo lỗi lên màn hình
      toast.error(data.errorMessage || "Đã xảy ra lỗi dữ liệu.");
      // Trả reject để nhảy vào khối catch của lệnh đang gọi (ví dụ await login(..))
      return Promise.reject(new Error(data.errorMessage || 'API Error'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const errMsg = error.response?.data?.errorMessage;
    const errCode = error.response?.data?.errorCode;

    // Check xem có phải lỗi mốc Token Expired (1102) hay không
    const isTokenExpired = error.response?.status === 401 && errCode === 1102;

    // Hiển thị Toast thông báo cho TẤT CẢ các lỗi từ Backend nếu KHÔNG PHẢI là lỗi Refresh Token
    // (Bao gồm cả 401 nhưng bị sai MK = 1103)
    if (error.response && !isTokenExpired) {
      if (errMsg) {
        toast.error(errMsg);
      } else {
        toast.error("Lỗi kết nối hoặc hệ thống, vui lòng thử lại.");
      }
    }

    // Xử lý 401 Unauthorized VÀ errorCode 1102 -> Call chức năng Refresh
    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = axios
          .post<ApiResponse<AuthResponse>>(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
          .then((res) => {
            const dataResult = res.data.data;
            if (dataResult && dataResult.accessToken && dataResult.user) {
              useAuthStore.getState().login(dataResult.user, dataResult.accessToken);
              return dataResult.accessToken;
            }
          })
          .catch((err) => {
            useAuthStore.getState().logout();
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshTokenPromise;
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
