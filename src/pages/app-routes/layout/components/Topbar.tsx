import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Book, Globe, Key, LogOut, Briefcase, BadgeCheck, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "../../../../store/useLayoutStore";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth";
import ChangePasswordModal from "./ChangePasswordModal";
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import "./Topbar.css";

function LiveClock() {
  const [time, setTime] = useState(new Date());
  const timezone = useLayoutStore((state) => state.timezone);

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('vi-VN', { timeZone: timezone, weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('vi-VN', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // Abbreviation (e.g. ICT, UTC, EST) is trickier in JS natively without timezone name parsing, 
  // but we can extract it by passing timeZoneName: 'short' to toLocaleTimeString 
  const timeParts = time.toLocaleTimeString('en-US', { timeZone: timezone, timeZoneName: 'short' }).split(' ');
  const tzAbbr = timeParts[timeParts.length - 1];

  return (
    <div className="hidden md:flex flex-col items-end justify-center mr-6 font-mono bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold text-[#1E2062] tabular-nums whitespace-nowrap">{timeStr}</span>
        <span className="text-[10px] font-semibold bg-[#2E3192] text-white px-1.5 py-0.5 rounded shadow-sm">{tzAbbr}</span>
      </div>
      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{dateStr}</span>
    </div>
  );
}

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { session, logout: logoutAction } = useAuthStore();

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      // Gọi API xoá cookie refresh token ở Backend
      await authService.logout();
    } catch {
      // Bõ qua lỗi gọi API (ví dụ server down), ta vẫn cần cho user out ra login ở client
    } finally {
      logoutAction(); // Xoá zustand store state trong bộ nhớ
      localStorage.clear(); // Clear toàn bộ localStorage (bao gồm zustand persist)
      sessionStorage.clear(); // Clear toàn bộ session
      window.location.href = '/login'; // F5 cứng lại app để xoá hoàn toàn memory (cực an toàn)
    }
  };

  // Register Ctrl + I shortcut for toggling User Menu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + I (or Cmd + I) to toggle menu
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsProfileOpen((prev) => !prev);
      }
      
      // Alt + I to navigate to Profile
      if (e.altKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        navigate('/app/profile');
        setIsProfileOpen(false); // Close dropdown if it happens to be open
      }
      // Alt + K to navigate to User Guide Shortcuts
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/app/user-guide#shortcuts');
        setIsProfileOpen(false);
      }
      
      // Alt + S to navigate to Settings
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        navigate('/app/settings');
        setIsProfileOpen(false);
      }
      
      // Alt + P to open Change Password Settings
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPasswordModalOpen(true);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <header className="app-topbar">
        {/* BACKGROUND ANIMATIONS WRAPPER (to contain overflow) */}
        <div className="topbar-bg-wrapper">
          {/* Animated Ambient Color Blobs */}
          <div className="topbar-ambient">
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
          </div>

          {/* Animated Floating Geometric Particles */}
          <div className="topbar-flow">
            <svg viewBox="0 0 600 72" className="obj-abstract">
               <g className="floating-obj float-1">
                 <rect x="30" y="20" width="16" height="16" rx="3" fill="none" stroke="rgba(46,49,146,0.3)" strokeWidth="1.5" />
                 <rect x="35" y="25" width="6" height="6" rx="1" fill="rgba(247,148,29,0.7)" />
               </g>

               <g className="floating-obj float-2">
                 <circle cx="120" cy="40" r="14" fill="none" stroke="rgba(247,148,29,0.3)" strokeWidth="1.5" />
                 <circle cx="120" cy="40" r="4" fill="rgba(46,49,146,0.7)" />
               </g>

               <g className="floating-obj float-3">
                 <polygon points="210,15 228,45 192,45" fill="none" stroke="rgba(46,49,146,0.3)" strokeWidth="1.5" strokeLinejoin="round" />
                 <circle cx="210" cy="33" r="3" fill="rgba(247,148,29,0.7)" />
               </g>
               
               <g className="floating-obj float-4">
                 <path d="M300,18 L322,40 L300,62 L278,40 Z" fill="none" stroke="rgba(247,148,29,0.3)" strokeWidth="1.5" strokeLinejoin="round" />
                 <rect x="295" y="35" width="10" height="10" rx="2" fill="rgba(46,49,146,0.7)" />
               </g>
               
               <g className="floating-obj float-5">
                 <circle cx="400" cy="25" r="10" fill="none" stroke="rgba(46,49,146,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                 <polygon points="400,20 405,30 395,30" fill="rgba(247,148,29,0.7)" />
               </g>
            </svg>
          </div>
        </div>

        <div className="topbar-right relative flex items-center">

          <LiveClock />

          <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="user-info">
               <span className="user-name">{session?.username || t('profile.defaultUser')}</span>
               <span className="user-role">{t('profile.roleAdmin')}</span>
            </div>
            <AvatarPlaceholder name={session?.username} src={session?.avatarUrl} className="user-avatar-circle" />
          </div>

        {/* PROFILE DROPDOWN */}
        {isProfileOpen && (
          <div className="profile-dropdown">
            <div className="pd-header">
              <AvatarPlaceholder name={session?.username} src={session?.avatarUrl} className="pd-avatar-large" />
              <div className="pd-info">
                <h3 className="pd-name">{session?.username || t('profile.defaultUser', { defaultValue: 'Người Dùng' })}</h3>
                <div className="pd-role-item"><Briefcase size={15}/> {t('profile.department', { defaultValue: 'HR & ADM' })}</div>
                <div className="pd-role-item"><BadgeCheck size={15}/> {t('profile.roleStaff', { defaultValue: 'Nhân viên' })}</div>
              </div>
            </div>
            
            <div className="pd-divider"></div>
            
            <div className="pd-body">
              <button className="pd-item w-full text-left" onClick={() => {
                setIsProfileOpen(false);
                navigate('/app/profile');
              }}>
                <User size={18} className="pd-icon" /> <span>{t('profile.title', { defaultValue: 'Hồ sơ cá nhân' })}</span>
              </button>
              <button className="pd-item w-full text-left" onClick={() => {
                setIsProfileOpen(false);
                navigate('/app/settings');
              }}>
                <Settings size={18} className="pd-icon" /> <span className="flex-1">{t('sidebar.settings', { defaultValue: 'Cài đặt hệ thống' })}</span>
                <div className="flex items-center text-[0.7rem] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                  Alt + S
                </div>
              </button>
              <button className="pd-item w-full text-left" onClick={() => {
                setIsProfileOpen(false);
                navigate('/app/user-guide');
              }}>
                <Book size={18} className="pd-icon" /> <span>{t('profile.guide', { defaultValue: 'Hướng dẫn sử dụng' })}</span>
              </button>
              <button className="pd-item w-full text-left" onClick={(e) => {
                e.stopPropagation();
                const nextLang = i18n.language === 'en' ? 'zh' : (i18n.language === 'zh' ? 'vi' : 'en');
                i18n.changeLanguage(nextLang);
              }}>
                <Globe size={18} className="pd-icon" /> <span className="flex-1">{t('profile.language')}</span>
                <span className="lang-text flex items-center gap-2">
                  <img 
                    src={i18n.language === 'zh' ? 'https://flagcdn.com/w20/cn.png' : (i18n.language === 'en' ? 'https://flagcdn.com/w20/gb.png' : 'https://flagcdn.com/w20/vn.png')} 
                    width="18" 
                    alt="flag" 
                    className="shadow-sm rounded-[2px]" 
                  />
                  {i18n.language === 'zh' ? 'CN' : (i18n.language === 'en' ? 'EN' : 'VN')} 
                  <span className="arrow ml-1">{">"}</span>
                </span>
              </button>
            </div>

            <div className="pd-divider"></div>
            
            <div className="pd-body">
              <button className="pd-item w-full text-left" onClick={() => {
                setIsProfileOpen(false);
                setIsPasswordModalOpen(true);
              }}>
                <Key size={18} className="pd-icon" /> <span className="flex-1">{t('profile.changePassword')}</span>
                <div className="flex items-center text-[0.7rem] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                  Alt + P
                </div>
              </button>
              <button className="pd-item w-full text-left text-red-500" onClick={handleLogout}>
                <LogOut size={18} className="pd-icon-red" /> <span>{t('profile.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BACKDROP MUST BE INSIDE HEADER FOR STACKING CONTEXT */}
      {isProfileOpen && (
        <div className="profile-backdrop" onClick={() => setIsProfileOpen(false)}></div>
      )}

      {/* PASSWORDS MODAL */}
      <ChangePasswordModal 
         isOpen={isPasswordModalOpen} 
         onClose={() => setIsPasswordModalOpen(false)} 
      />
    </header>
    </>
  );
}
