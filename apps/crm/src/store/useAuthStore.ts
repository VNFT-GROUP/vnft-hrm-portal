import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getGatewayLoginUrl } from '@/config/portal.config';

export interface CRMUserSession {
  id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

interface AuthState {
  session: CRMUserSession | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  login: (user: CRMUserSession, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      accessToken: null,

      login: (user, accessToken) =>
        set({
          session: user,
          isAuthenticated: true,
          accessToken,
        }),

      logout: () => {
        set({
          session: null,
          isAuthenticated: false,
          accessToken: null,
        });
        localStorage.removeItem('vnft-crm-auth-storage');
        window.location.href = getGatewayLoginUrl();
      },
    }),
    {
      name: 'vnft-crm-auth-storage',
    }
  )
);
