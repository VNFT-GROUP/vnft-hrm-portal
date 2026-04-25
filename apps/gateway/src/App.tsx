import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { useGatewayAuthStore } from "@/store/useGatewayAuthStore";
import "@/lib/i18n";

const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const ModuleSelector = lazy(() => import("@/pages/modules/ModuleSelector"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useGatewayAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useGatewayAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/* Loading fallback */
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Pulsing background circle */}
          <div className="absolute w-24 h-24 bg-[#2E3192]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          
          <div className="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-xl shadow-[#2E3192]/5 border border-slate-100 flex items-center justify-center p-3">
            <img src="/logo/Logo-VNFT-1024x1024.webp" alt="VNFT" className="w-full h-full object-contain animate-pulse" style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Spinners around the logo */}
          <div className="absolute -inset-3 border-2 border-transparent border-t-[#2E3192] border-r-[#2E3192] rounded-3xl animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute -inset-3 border-2 border-transparent border-b-[#F7941D] border-l-[#F7941D] rounded-3xl animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-2">
          <span className="text-base font-bold text-[#1E2062] tracking-widest uppercase">VNFT Group</span>
          <span className="text-xs font-semibold tracking-wider text-slate-400 animate-pulse">ĐANG TẢI DỮ LIỆU...</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ModuleSelector />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  );
}
