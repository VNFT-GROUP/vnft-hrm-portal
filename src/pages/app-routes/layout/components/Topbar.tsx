import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Book, Globe, Key, LogOut, Briefcase, BadgeCheck, Keyboard, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import ChangePasswordModal from "./ChangePasswordModal";
import "./Topbar.css";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();

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
      // Shift + K to navigate to User Guide Shortcuts
      if (e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/app/user-guide#shortcuts');
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
          
          <button 
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="mr-5 flex items-center justify-center w-[36px] h-[36px] rounded-full bg-white/70 hover:bg-white border border-slate-200 shadow-sm dark:bg-[#1A1D2E]/80 dark:hover:bg-[#1A1D2E] dark:border-slate-800 transition-all duration-300"
            title="Toggle Dark Mode"
          >
            {resolvedTheme === 'dark' ? (
              <Sun size={18} className="text-[#FBBD6A]" />
            ) : (
              <Moon size={18} className="text-[#2E3192]" />
            )}
          </button>

          <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="user-info">
               <span className="user-name">Huỳnh Đức Phú</span>
               <span className="user-role">Quản trị viên</span>
            </div>
            <div className="user-avatar-circle">P</div>
          </div>

        {/* PROFILE DROPDOWN */}
        {isProfileOpen && (
          <div className="profile-dropdown">
            <div className="pd-header">
              <div className="pd-avatar-large">P</div>
              <div className="pd-info">
                <h3 className="pd-name">Huỳnh Đức Phú</h3>
                <div className="pd-role-item"><Briefcase size={15}/> HR & ADM</div>
                <div className="pd-role-item"><BadgeCheck size={15}/> Nhân viên</div>
              </div>
            </div>
            
            <div className="pd-divider"></div>
            
            <div className="pd-body">
              <div className="pd-item">
                <User size={18} className="pd-icon" /> <span>{t('profile.title')}</span>
              </div>
              <div className="pd-item" onClick={() => {
                setIsProfileOpen(false);
                navigate('/app/user-guide');
              }}>
                <Book size={18} className="pd-icon" /> <span>{t('profile.guide')}</span>
              </div>
              <div className="pd-item" onClick={() => {
                setIsProfileOpen(false);
                navigate('/app/user-guide#shortcuts');
              }}>
                <Keyboard size={18} className="pd-icon" /> <span className="flex-1">{t('profile.shortcuts')}</span>
                <div className="flex items-center text-[0.7rem] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Shift + K
                </div>
              </div>
              <div className="pd-item" onClick={(e) => {
                e.stopPropagation();
                i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
              }}>
                <Globe size={18} className="pd-icon" /> <span className="flex-1">{t('profile.language')}</span>
                <span className="lang-text flex items-center gap-2">
                  <img 
                    src={i18n.language === 'en' ? 'https://flagcdn.com/w20/gb.png' : 'https://flagcdn.com/w20/vn.png'} 
                    width="18" 
                    alt="flag" 
                    className="shadow-sm rounded-[2px]" 
                  />
                  {i18n.language === 'en' ? 'EN' : 'VN'} 
                  <span className="arrow ml-1">{">"}</span>
                </span>
              </div>
            </div>

            <div className="pd-divider"></div>
            
            <div className="pd-body">
              <div className="pd-item" onClick={() => {
                setIsProfileOpen(false);
                setIsPasswordModalOpen(true);
              }}>
                <Key size={18} className="pd-icon" /> <span>{t('profile.changePassword')}</span>
              </div>
              <div className="pd-item text-red-500" onClick={() => {
                setIsProfileOpen(false);
                navigate('/login');
              }}>
                <LogOut size={18} className="pd-icon-red" /> <span>{t('profile.logout')}</span>
              </div>
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
