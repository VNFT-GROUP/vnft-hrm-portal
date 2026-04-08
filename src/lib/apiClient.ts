import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080',
  withCredentials: true, // Bắt buộc bật để gửi và nhận refresh token cookie
});
