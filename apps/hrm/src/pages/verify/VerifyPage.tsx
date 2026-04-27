import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { portalConfig, getGatewayLoginUrl } from '@/lib/permission/portal.config';

/**
 * Public Verify Page — entry point for HRM.
 *
 * Flow:
 *  1. User arrives at hrm.dev.local:3001 (any non-/app route falls here)
 *  2. This page calls POST /auth/refresh with the shared `.dev.local` cookie
 *  3. If the backend returns a valid session → save to Zustand store → redirect to /app
 *  4. If the call fails (no cookie / expired) → redirect to portal.dev.local:3000/login
 */
export default function VerifyPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    // If already authenticated (localStorage data exists), go straight to /app
    if (isAuthenticated) {
      navigate('/app', { replace: true });
      return;
    }

    // Prevent double-call in StrictMode
    if (calledRef.current) return;
    calledRef.current = true;

    const verify = async () => {
      try {
        const response = await axios.post(
          `${portalConfig.api}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        let data = null;
        if (response.data) {
          if (response.data.data) {
            data = response.data.data;
          }
        }

        if (data) {
          if (data.user) {
            if (data.accessToken) {
              login(data.user, data.accessToken);
              navigate('/app', { replace: true });
              return;
            }
          }
        }
        throw new Error('Invalid response');
      } catch {
        setError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
        // Wait a moment so user can see the message, then redirect
        setTimeout(() => {
          window.location.href = getGatewayLoginUrl();
        }, 1500);
      }
    };

    verify();
  }, [isAuthenticated, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        {/* Logo */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-24 h-24 rounded-full animate-ping"
            style={{ backgroundColor: 'rgba(46, 49, 146, 0.1)', animationDuration: '3s' }}
          />
          <div className="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center p-3"
               style={{ boxShadow: '0 10px 30px rgba(46, 49, 146, 0.08)' }}>
            <img
              src="/logo/Logo-VNFT-1024x1024.webp"
              alt="VNFT"
              className="w-full h-full object-contain"
              style={{ animation: 'pulse 2s infinite' }}
            />
          </div>
          {/* Spinners */}
          <div
            className="absolute -inset-3 border-2 border-transparent rounded-3xl animate-spin"
            style={{
              borderTopColor: '#2E3192',
              borderRightColor: '#2E3192',
              animationDuration: '2s',
            }}
          />
          <div
            className="absolute -inset-3 border-2 border-transparent rounded-3xl animate-spin"
            style={{
              borderBottomColor: '#F7941D',
              borderLeftColor: '#F7941D',
              animationDuration: '3s',
              animationDirection: 'reverse',
            }}
          />
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <span className="text-base font-bold tracking-widest uppercase" style={{ color: '#1E2062' }}>
            VNFT Group
          </span>
          {error ? (
            <span className="text-sm font-semibold text-red-500">
              {error}
            </span>
          ) : (
            <span className="text-xs font-semibold tracking-wider text-slate-400 animate-pulse">
              ĐANG XÁC THỰC PHIÊN ĐĂNG NHẬP...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
