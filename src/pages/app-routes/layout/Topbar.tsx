import { useState } from "react";
import { User, Book, Globe, Key, LogOut, Briefcase, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

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

        <div className="topbar-right relative">
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
                <User size={18} className="pd-icon" /> <span>Tài khoản</span>
              </div>
              <div className="pd-item pd-item-highlight">
                <Book size={18} className="pd-icon" /> <span>Hướng dẫn sử dụng</span>
              </div>
              <div className="pd-item">
                <Globe size={18} className="pd-icon" /> <span className="flex-1">Ngôn ngữ</span>
                <span className="lang-text">VN <span className="arrow">{">"}</span></span>
              </div>
            </div>

            <div className="pd-divider"></div>
            
            <div className="pd-body">
              <div className="pd-item">
                <Key size={18} className="pd-icon" /> <span>Đổi mật khẩu</span>
              </div>
              <div className="pd-item text-red-500" onClick={() => {
                setIsProfileOpen(false);
                navigate('/login');
              }}>
                <LogOut size={18} className="pd-icon-red" /> <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BACKDROP MUST BE INSIDE HEADER FOR STACKING CONTEXT */}
      {isProfileOpen && (
        <div className="profile-backdrop" onClick={() => setIsProfileOpen(false)}></div>
      )}
    </header>
    </>
  );
}
