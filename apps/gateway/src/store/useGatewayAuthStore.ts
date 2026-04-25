import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSessionResponse } from '@/types/auth';

interface GatewayAuthState {
  session: UserSessionResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (user: UserSessionResponse, accessToken: string) => void;
  logout: () => void;
}

export const useGatewayAuthStore = create<GatewayAuthState>()(
  persist(
    (set) => ({
      session: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, accessToken) =>
        set({
          session: user,
          accessToken,
          isAuthenticated: true,
        }),

      logout: () => {
        set({
          session: null,
          accessToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('vnft-gateway-auth');
      },
    }),
    {
      name: 'vnft-gateway-auth',
    }
  )
);
