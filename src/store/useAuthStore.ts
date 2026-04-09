import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSummaryResponse } from '@/types/response/user/UserSummaryResponse';
import type { UserSessionResponse } from '@/types/response/user/UserSessionResponse';

interface AuthState {
  id: string | null;
  session: Partial<UserSessionResponse> | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  // Actions
  login: (user: UserSummaryResponse, accessToken: string) => void;
  updateSession: (data: Partial<UserSessionResponse>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      session: null,
      isAuthenticated: false,
      accessToken: null,

      login: (user, accessToken) =>
        set({
          id: user.id,
          session: {
            id: user.id,
            username: user.username,
            passwordChangedAt: user.passwordChangedAt || "",
          },
          isAuthenticated: true,
          accessToken: accessToken,
        }),
        
      updateSession: (data) => 
        set((state) => ({ 
          session: state.session ? { ...state.session, ...data } : data 
        })),

      logout: () =>
        set({
          id: null,
          session: null,
          isAuthenticated: false,
          accessToken: null,
        }),
    }),
    {
      name: 'vnft-auth-storage', // Lưu vào localStorage để giữ đăng nhập khi F5
    }
  )
);
