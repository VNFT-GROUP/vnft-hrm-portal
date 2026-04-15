import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  Menu,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useLayoutStore } from "../../../../store/useLayoutStore";
import { useNavigationData } from "@/lib/navigation";
import "./Sidebar.css";

type SubItemType = {
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string;
  shortName?: string;
};

export default function Sidebar() {
  const navigate = useNavigate();
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const sidebarTheme = useLayoutStore((state) => state.sidebarTheme);
  const hiddenSidebarItems = useLayoutStore((state) => state.hiddenSidebarItems) || [];

  // State for sub-menus
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  // Register Ctrl + B shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // State for our custom "Toasts" (Tooltips)
  const [activeToast, setActiveToast] = useState<{
    text: string;
    top: number;
    subItems?: string[];
  } | null>(null);

  // State for Popout menus when clicked in collapsed mode
  const [activePopout, setActivePopout] = useState<{
    label: string;
    top: number;
    subItems: SubItemType[];
  } | null>(null);

  const handleToggleMenu = (
    e: React.MouseEvent | React.KeyboardEvent,
    label: string,
    hasSub: boolean,
    path?: string,
    currentlyExpanded?: boolean,
    subItems?: SubItemType[],
  ) => {
    if (isCollapsed) {
      if (hasSub && subItems) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setActivePopout(prev => prev?.label === label ? null : { label, top: rect.top, subItems });
      } else if (path) {
        navigate(path);
        setActivePopout(null);
      }
    } else {
      if (hasSub) {
        setExpandedMenus((prev) => ({ ...prev, [label]: !currentlyExpanded }));
      } else if (path) {
        navigate(path);
      }
    }
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    label: string,
    subItems?: { label: string }[],
  ) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveToast({
      text: label,
      top: rect.top,
      subItems: subItems?.map((s) => s.label),
    });
  };

  const handleMouseLeave = () => {
    setActiveToast(null);
  };

  const { t } = useTranslation();
  const { sidebarData: menuData } = useNavigationData();

  return (
    <aside
      className={`app-sidebar ${sidebarTheme} ${isCollapsed ? "collapsed" : ""}`}
    >
      {/* Floating Toggle Button */}
      <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
        {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={20} />}
      </button>

      {/* Dynamic Background Objects */}
      <div className="sidebar-bg-objects">
        <svg
          className="sb-obj obj-box"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>

        <svg
          className="sb-obj obj-ring"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>

        <svg
          className="sb-obj obj-poly"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <ScrollArea className="sidebar-scroll-area">
        <nav className="sidebar-nav">
          {menuData.map((group, gIdx) => (
            <React.Fragment key={group.section || `group-${gIdx}`}>
              {group.section && (
                <div className="nav-section">{group.section}</div>
              )}
              <ul>
                {group.items.filter(item => item.id ? !hiddenSidebarItems.includes(item.id) : true).map((item) => {
                  const hasSub = !!item.subItems;
                  // Auto expand if currently on a sub-item path OR manually expanded
                  const isItemActive = item.path === window.location.pathname;
                  const isSubActive =
                    hasSub &&
                    item.subItems!.some(
                      (sub) => sub.path === window.location.pathname,
                    );
                  // If explicit state exists, honor it; otherwise default to true if child is active
                  const explicitState = expandedMenus[item.label];
                  const isExpanded =
                    explicitState !== undefined ? explicitState : isSubActive;

                  return (
                    <React.Fragment key={item.label}>
                      <li
                        className={`relative flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-slate-300 ${isItemActive || (!hasSub && isSubActive) ? "active" : ""} ${isExpanded ? "expanded" : ""} ${activePopout?.label === item.label ? "bg-white/10" : ""} ${isCollapsed ? "flex-col justify-center py-3 px-1 gap-1.5" : "flex-row gap-3"}`}
                        onClick={(e) =>
                          handleToggleMenu(
                            e,
                            item.label,
                            hasSub,
                            item.path,
                            isExpanded,
                            item.subItems
                          )
                        }
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, item.label, item.subItems)
                        }
                        onMouseLeave={handleMouseLeave}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleToggleMenu(
                              e,
                              item.label,
                              hasSub,
                              item.path,
                              isExpanded,
                              item.subItems
                            );
                        }}
                      >
                        {item.icon}
                        {!isCollapsed && <span className="nav-label">{item.label}</span>}
                        {isCollapsed && (
                          <span className="text-[9px] uppercase font-bold text-white/80 tracking-[0.03em] text-center w-full leading-tight mt-0.5 whitespace-normal wrap-break-word">
                            {item.shortName || item.label}
                          </span>
                        )}
                        {hasSub && (
                          <div className="sub-menu-indicator">
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRightIcon size={16} />
                            )}
                          </div>
                        )}
                      </li>

                      {/* Sub Menu Level 2 */}
                      {hasSub && isExpanded && (
                        <ul className="sub-menu">
                          {item.subItems!.map((sub) => {
                            const isChildActive =
                              sub.path === window.location.pathname;
                            return (
                              <li
                                key={sub.label}
                                className={`sub-item ${isChildActive ? "text-[#F7941D]" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(sub.path);
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation();
                                    navigate(sub.path);
                                  }
                                }}
                              >
                                {sub.icon ? (
                                  sub.icon
                                ) : (
                                  <div className="sub-item-bullet" />
                                )}
                                <span
                                  className="sub-nav-label flex-1"
                                  style={{
                                    color: isChildActive ? "white" : undefined,
                                  }}
                                >
                                  {sub.label}
                                </span>
                                {"badge" in sub && !!sub.badge && (
                                  <span className="text-[9px] uppercase font-bold tracking-[0.08em] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap ml-auto">
                                    {String(sub.badge)}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </React.Fragment>
                  );
                })}
              </ul>
            </React.Fragment>
          ))}
        </nav>
      </ScrollArea>

      {/* Floating Javascript Custom Toast (Escapes overflow bounds structurally) */}
      {activeToast && isCollapsed && !activePopout && (
        <div className="custom-floating-toast" style={{ top: activeToast.top }}>
          <div className="toast-main">{activeToast.text}</div>
          {activeToast.subItems && activeToast.subItems.length > 0 && (
            <div className="toast-subs">
              {activeToast.subItems.map((s) => (
                <div key={s} className="toast-sub-item">
                  • {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Flyout Menu for Collapsed Mode */}
      {isCollapsed && activePopout && (
        <>
          <div 
            className="fixed inset-0 z-9998" 
            onClick={() => setActivePopout(null)}
          />
          <div 
            className="fixed z-9999 bg-[#1e293b] border border-white/10 shadow-2xl rounded-xl p-2 left-[105px] w-56 animate-in slide-in-from-left-2 fade-in"
            style={{ top: activePopout.top - 10 }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 px-3 pt-2">
              {activePopout.label}
            </div>
            <div className="flex flex-col gap-1">
              {activePopout.subItems.map((sub) => {
                const isChildActive = sub.path === window.location.pathname;
                return (
                  <button
                    key={sub.label}
                    onClick={() => {
                      setActivePopout(null);
                      navigate(sub.path);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isChildActive ? 'bg-[#F7941D]/10 text-[#F7941D]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                  >
                    <span className={`opacity-80 ${isChildActive ? 'text-[#F7941D]' : ''}`}>{sub.icon || <div className="w-1.5 h-1.5 rounded-full border border-current" />}</span>
                    <span className="flex-1 text-left">{sub.label}</span>
                    {"badge" in sub && !!sub.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">
                        {String(sub.badge)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Footer Navigation */}
      <div className="sidebar-footer">
        <button 
          onClick={() => navigate('/app/settings')} 
          className={`btn-shimmer flex items-center justify-center w-full gap-2.5 p-2.5 rounded-xl border border-white/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(247,148,29,0.2)] bg-linear-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 text-white/90 hover:text-white group`}
        >
          <Palette size={20} className="shrink-0 text-white group-hover:text-[#F7941D] group-hover:scale-110 transition-all duration-300" />
          {!isCollapsed && (
            <span className="font-bold text-[13px] tracking-wider uppercase text-transparent bg-clip-text bg-linear-to-r from-white to-white group-hover:from-amber-200 group-hover:to-orange-400 transition-colors duration-500">
              {t('sidebar.customize', { defaultValue: 'Cá nhân hoá' })}
            </span>
          )}
        </button>
      </div>

    </aside>
  );
}
