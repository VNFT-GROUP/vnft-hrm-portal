import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { AuthResponse } from '@/types/response/auth/AuthResponse';

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

// Xử lý tự động Refresh Token nếu request trả về 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu mã lỗi là 401 và chưa có cờ _retry đã đánh dấu thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Bật cờ _retry để tránh vòng lặp vô tận (nếu bản thân refresh cũng 401)
      originalRequest._retry = true;

      // Nếu chưa có tiến trình refresh token nào thì tạo mới
      if (!refreshTokenPromise) {
        // Dùng axios thô cơ bản (không dùng apiClient) để tránh bị gọi lại interceptor này
        refreshTokenPromise = axios
          .post<ApiResponse<AuthResponse>>(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
          .then((res) => {
            const dataResult = res.data.data;
            if (dataResult && dataResult.accessToken && dataResult.user) {
              // Cập nhật Store mới
              useAuthStore.getState().login(dataResult.user, dataResult.accessToken);
              return dataResult.accessToken;
            }
          })
          .catch((err) => {
            // Nếu Refresh JWT mà cũng lỗi ( hết hạn refreshToken trong cookie ) => Đăng xuất
            useAuthStore.getState().logout();
            return Promise.reject(err);
          })
          .finally(() => {
            // Release memory để các lần sau nếu 401 lại vẫn chạy qua đoạn request API refresh được
            refreshTokenPromise = null;
          });
      }

      try {
        // Đợi tiến trình lấy Token mới hoặc trả về Token đang được cấp chung
        const newAccessToken = await refreshTokenPromise;
        if (newAccessToken) {
          // Setup lại headers và gửi yêu cầu bị rớt
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
