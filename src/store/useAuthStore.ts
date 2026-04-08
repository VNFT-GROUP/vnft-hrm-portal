import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSummaryResponse } from '@/types/response/user/UserSummaryResponse';

interface AuthState {
  id: string | null;
  user: UserSummaryResponse | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  // Actions
  login: (user: UserSummaryResponse, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      user: null,
      isAuthenticated: false,
      accessToken: null,

      login: (user, accessToken) =>
        set({
          id: user.id,
          user: user,
          isAuthenticated: true,
          accessToken: accessToken,
        }),

      logout: () =>
        set({
          id: null,
          user: null,
          isAuthenticated: false,
          accessToken: null,
        }),
    }),
    {
      name: 'vnft-auth-storage', // Lưu vào localStorage để giữ đăng nhập khi F5
    }
  )
);
