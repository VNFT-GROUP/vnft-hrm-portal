import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Book, Globe, Key, LogOut, Briefcase, BadgeCheck, Settings } from "lucide-react";
import { CRM_NAV } from "@/lib/crmNavigation";
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import { useAuthStore } from "@/store/useAuthStore";
import "./CRMHeader.css";

export default function CRMHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Determine active L1 tab
  const activeTab = CRM_NAV.find((item) => {
    if (item.path === "/app") return pathname === "/app";
    return pathname.startsWith(item.path);
  }) ?? CRM_NAV[0];

  // Determine active L2 sub-item
  const activeSub = activeTab.subItems?.find((s) => pathname === s.path)
    ?? activeTab.subItems?.[0];

  return (
    <header>
      {/* ══ TIER 1 ══ */}
      <div className="crm-header-l1 relative">
        {/* BACKGROUND ANIMATIONS WRAPPER (to contain overflow) */}
        <div className="topbar-bg-wrapper">
          {/* Animated Ambient Color Blobs */}
          <div className="topbar-ambient">
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
          </div>

          {/* Animated Floating Logistics-themed Particles */}
          <div className="topbar-flow">
            <svg viewBox="0 0 600 72" className="obj-abstract">
               <g className="floating-obj float-1">
                 <polygon points="30,22 40,17 50,22 50,32 40,37 30,32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round"/>
                 <polyline points="30,22 40,27 50,22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round"/>
                 <line x1="40" y1="27" x2="40" y2="37" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                 <circle cx="40" cy="20" r="2" fill="rgba(247,148,29,0.7)" />
               </g>

               <g className="floating-obj float-2">
                 <path d="M120,20 C114,20 110,25 110,31 C110,39 120,50 120,50 C120,50 130,39 130,31 C130,25 126,20 120,20 Z" fill="none" stroke="rgba(247,148,29,0.4)" strokeWidth="1.5" />
                 <circle cx="120" cy="31" r="3" fill="rgba(255,255,255,0.7)" />
               </g>

               <g className="floating-obj float-3">
                 <line x1="200" y1="25" x2="225" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="2 2" />
                 <line x1="225" y1="35" x2="215" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="2 2" />
                 <circle cx="200" cy="25" r="4" fill="rgba(247,148,29,0.7)" />
                 <circle cx="225" cy="35" r="3" fill="rgba(255,255,255,0.6)" />
                 <circle cx="215" cy="50" r="4" fill="rgba(247,148,29,0.7)" />
               </g>
               
               <g className="floating-obj float-4">
                 <path d="M290,30 L300,40 L290,50" fill="none" stroke="rgba(247,148,29,0.4)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                 <path d="M300,30 L310,40 L300,50" fill="none" stroke="rgba(247,148,29,0.4)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                 <circle cx="285" cy="40" r="2.5" fill="rgba(255,255,255,0.6)" />
               </g>
               
               <g className="floating-obj float-5">
                 <circle cx="400" cy="30" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                 <ellipse cx="400" cy="30" rx="5" ry="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                 <line x1="388" y1="30" x2="412" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                 <circle cx="400" cy="18" r="3" fill="rgba(247,148,29,0.8)" />
               </g>
            </svg>
          </div>
        </div>

        {/* Logo */}
        <div className="crm-header-logo" onClick={() => navigate("/app")} style={{ cursor: "pointer" }}>
          <div className="crm-header-logo-mark">
            <img
              src="/logo/Logo-VNFT-1024x1024.webp"
              alt="VNFT Logo"
              style={{ width: 26, height: 26, objectFit: "contain", borderRadius: 4 }}
            />
          </div>
          <div className="crm-header-logo-text">
            <span className="crm-header-logo-title">VNFT CRM</span>
            <span className="crm-header-logo-sub">Logistics Platform</span>
          </div>
        </div>

        {/* Main navigation tabs */}
        <nav className="crm-header-tabs">
          {CRM_NAV.map((item) => {
            const isActive = activeTab.id === item.id;
            return (
              <div key={item.id} className="crm-header-tab-wrapper">
                <button
                  className={`crm-header-tab${isActive ? " active" : ""}`}
                  onClick={() => {
                    if (item.subItems?.length) {
                      navigate(item.subItems[0].path);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  {item.icon}
                  <span>{t(`nav.${item.id}`, { defaultValue: item.label })}</span>
                </button>

                {item.subItems && item.subItems.length > 0 && (
                  <div className="crm-header-dropdown">
                    <div className="crm-dropdown-inner">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          className="crm-dropdown-item"
                          onClick={() => navigate(sub.path)}
                        >
                          {sub.icon}
                          <span>{t(`nav.${sub.id}`, { defaultValue: sub.label })}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action buttons */}
        <div className="crm-header-actions">
          <div className="relative z-110">
            {/* BACKDROP IS NOW INSIDE THIS LOCAL STACKING CONTEXT WITH Z-INDEX -1 */}
            {isProfileOpen && (
              <div className="profile-backdrop" onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(false);
              }}></div>
            )}
            
            <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="user-info">
               <span className="user-name">Người Dùng</span>
               <span className="user-role">Quản trị viên</span>
            </div>
            <AvatarPlaceholder name="Người Dùng" className="user-avatar-circle" />
          </div>

          {/* PROFILE DROPDOWN */}
          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="pd-header">
                <AvatarPlaceholder name="Người Dùng" className="pd-avatar-large" />
                <div className="pd-info">
                  <h3 className="pd-name">Người Dùng</h3>
                  <div className="pd-role-item"><Briefcase size={15}/> Operation Dept</div>
                  <div className="pd-role-item"><BadgeCheck size={15}/> Quản trị viên</div>
                </div>
              </div>
              
              <div className="pd-divider"></div>
              
              <div className="pd-body">
                <button className="pd-item text-left" onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/app/settings');
                }}>
                  <Settings size={18} className="pd-icon" /> <span className="flex-1">{t('sidebar.settings', { defaultValue: 'Cài đặt hệ thống' })}</span>
                </button>
                <button className="pd-item text-left" onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/app/user-guide');
                }}>
                  <Book size={18} className="pd-icon" /> <span>{t('profile.guide', { defaultValue: 'Hướng dẫn sử dụng' })}</span>
                </button>
                <button className="pd-item text-left" onClick={(e) => {
                  e.stopPropagation();
                  const nextLang = i18n.language === 'en' ? 'zh' : (i18n.language === 'zh' ? 'vi' : 'en');
                  i18n.changeLanguage(nextLang);
                }}>
                  <Globe size={18} className="pd-icon" /> <span className="flex-1">{t('profile.language', { defaultValue: 'Ngôn ngữ' })}</span>
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
                <button className="pd-item text-left" onClick={() => {
                  setIsProfileOpen(false);
                  // modal
                }}>
                  <Key size={18} className="pd-icon" /> <span className="flex-1">{t('profile.changePassword', { defaultValue: 'Đổi mật khẩu' })}</span>
                </button>
                <button className="pd-item text-left text-red-500" onClick={() => {
                  setIsProfileOpen(false);
                  useAuthStore.getState().logout();
                }}>
                  <LogOut size={18} className="pd-icon-red" /> <span>{t('profile.logout', { defaultValue: 'Đăng xuất' })}</span>
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ══ TIER 2 — Sub-navigation ══ */}
      <div className="crm-header-l2">
        {activeTab.subItems && activeTab.subItems.length > 0 ? (
          activeTab.subItems.map((sub) => {
            const isSub = activeSub?.id === sub.id;
            return (
              <button
                key={sub.id}
                className={`crm-sub-tab${isSub ? " active" : ""}`}
                onClick={() => navigate(sub.path)}
              >
                {sub.icon}
                <span>{t(`nav.${sub.id}`, { defaultValue: sub.label })}</span>
              </button>
            );
          })
        ) : (
          <span className="crm-header-l2-empty">
            {t(`nav.${activeTab.id}`, { defaultValue: activeTab.label })} — {t('nav.overview', { defaultValue: 'Tổng quan' })}
          </span>
        )}
      </div>
    </header>
  );
}
