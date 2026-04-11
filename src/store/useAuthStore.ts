import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSessionResponse } from '@/types/user/UserSessionResponse';

interface AuthState {
  id: string | null;
  session: Partial<UserSessionResponse> | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  // Actions
  login: (user: UserSessionResponse, accessToken: string) => void;
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
          session: user,
          isAuthenticated: true,
          accessToken: accessToken,
        }),
        
      updateSession: (data) => 
        set((state) => ({ 
          session: state.session ? { ...state.session, ...data } : data 
        })),

      logout: () => {
        set({
          id: null,
          session: null,
          isAuthenticated: false,
          accessToken: null,
        });
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      },
    }),
    {
      name: 'vnft-auth-storage', // Lưu vào localStorage để giữ đăng nhập khi F5
    }
  )
);
