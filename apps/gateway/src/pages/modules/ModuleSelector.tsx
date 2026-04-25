import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, KeyRound, ChevronDown } from "lucide-react";
import { useGatewayAuthStore } from "@/store/useGatewayAuthStore";
import { portalConfig } from "@/config/portal.config";

import LoginSocialSidebar from "../login/components/LoginSocialSidebar/LoginSocialSidebar";
import NdaDialog from "@/components/custom/NdaDialog";
import { modules } from "./data/modules";
import { ModuleCard } from "./components/ModuleCard";

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const session = useGatewayAuthStore((s) => s.session);
  const logout = useGatewayAuthStore((s) => s.logout);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!session) return null;

  const initial = session.fullName?.charAt(0) || session.username?.charAt(0) || "U";
  const displayName = session.fullName || session.username;

  const handleProfile = () => {
    // Navigate to HRM verify → will auto-redirect to /app after cookie check
    window.location.href = `${portalConfig.hrm}/app/profile`;
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 h-10 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all font-medium text-sm border border-white/10"
      >
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[11px] font-bold text-[#2E3192] shrink-0">
          {initial}
        </div>
        <span className="hidden md:inline">{displayName}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
            {session.positionName && (
              <p className="text-xs text-slate-500 truncate">{session.positionName}</p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); handleProfile(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
            >
              <User size={16} className="text-slate-400" />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => { setOpen(false); /* TODO: change password modal */ }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
            >
              <KeyRound size={16} className="text-slate-400" />
              Đổi mật khẩu
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-medium"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModuleSelector() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-slate-50">
      <LoginSocialSidebar />

      {/* Solid Corporate Header */}
      <header className="sticky top-0 w-full z-50 bg-[#2E3192] shadow-md border-b border-[#1E2062]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo/Logo-VNFT-1024x1024.webp"
              alt="VNFT Group"
              className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md bg-white p-0.5"
            />
            <span className="text-sm md:text-lg font-bold text-white tracking-widest uppercase">VNFT GROUP</span>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20 flex flex-col items-center">
        <motion.div
          className="text-center mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Chọn phân hệ
            <br />
            <span className="text-[#2E3192]">
              để bắt đầu làm việc
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl">
            Nền tảng quản trị doanh nghiệp tích hợp dành cho VNFT Group.
          </p>
        </motion.div>

        {/* Standard Crisp UX Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full mb-10">
            {modules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>
        </AnimatePresence>
      </main>

      {/* Corporate Footer */}
      <footer className="w-full bg-[#2E3192] border-t border-[#1E2062] mt-auto">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/80 font-medium gap-4">
          <span className="text-center sm:text-left">© 2026 Bản quyền thuộc về VNFT Group. Đã đăng ký bản quyền.</span>
          <div className="flex items-center gap-3">
             <NdaDialog />
          </div>
        </div>
      </footer>
    </div>
  );
}
