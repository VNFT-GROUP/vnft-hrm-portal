import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, UserCircle, Calendar, FolderOpen, Users, Building2, Briefcase, FileText, CheckSquare, Layers, FileEdit, ChevronLeft, Menu, ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useLayoutStore } from "../../../../store/useLayoutStore";
import { useAuthStore } from "../../../../store/useAuthStore";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const sidebarTheme = useLayoutStore((state) => state.sidebarTheme);

  // State for sub-menus
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  
  // Register Ctrl + B shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);
  
  // State for our custom "Toasts" (Tooltips)
  const [activeToast, setActiveToast] = useState<{ text: string; top: number; subItems?: string[] } | null>(null);

  const handleToggleMenu = (label: string, hasSub: boolean, path?: string, currentlyExpanded?: boolean) => {
    if (isCollapsed) {
       // If collapsed and has sub, expanding the main sidebar first is recommended
       toggleSidebar();
       if (hasSub) {
          setExpandedMenus((prev) => ({ ...prev, [label]: true }));
       } else if (path) {
          navigate(path);
       }
    } else {
       if (hasSub) {
         setExpandedMenus((prev) => ({ ...prev, [label]: !currentlyExpanded }));
       } else if (path) {
         navigate(path);
       }
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, label: string, subItems?: {label: string}[]) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveToast({
       text: label,
       top: rect.top,
       subItems: subItems?.map(s => s.label)
    });
  };

  const handleMouseLeave = () => {
    setActiveToast(null);
  };

  const { session } = useAuthStore();
  const { t } = useTranslation();

  const menuData = [
    {
      section: "",
      items: [
        { label: t('sidebar.dashboard'), path: "/app", icon: <LayoutDashboard size={20} /> },
        { 
          id: 'profile',
          label: t('sidebar.profile'), 
          path: "/app/profile", 
          icon: (
            <div className="relative">
              <UserCircle size={20} />
              {session?.requiredProfileCompleted === false && (
                <>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-80"></span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1E2062]"></span>
                </>
              )}
            </div>
          )
        },
        { label: t('sidebar.calendar'), path: "/app/calendar", icon: <Calendar size={20} /> },
        { label: t('sidebar.requests'), path: "/app/requests", icon: <FileEdit size={20} /> },
        { 
          label: t('sidebar.management'), 
          icon: <FolderOpen size={20} />, 
          subItems: [
            { label: t('sidebar.dashboardOverview'), path: "/app/management/overview", icon: <LayoutDashboard size={16} /> },
            { label: t('sidebar.employees'), path: "/app/management/employees", icon: <Users size={16} /> },
            { label: t('sidebar.employeeCodes'), path: "/app/management/employee-codes", icon: <FileText size={16} /> },
            { label: t('sidebar.departments'), path: "/app/management/departments", icon: <Building2 size={16} /> },
            { label: t('sidebar.positions', { defaultValue: 'Vị trí' }), path: "/app/management/positions", icon: <Briefcase size={16} /> },
            { label: t('sidebar.roles', { defaultValue: 'Chức vụ' }), path: "/app/management/roles", icon: <Layers size={16} /> },
            { label: t('sidebar.groups', { defaultValue: 'Nhóm quyền' }), path: "/app/management/groups", icon: <CheckSquare size={16} />, badge: "System" },
          ]
        }
      ]
    }
  ];

  return (
    <aside className={`app-sidebar ${sidebarTheme} ${isCollapsed ? "collapsed" : ""}`}>
      {/* Floating Toggle Button */}
      <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
        {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={20} />}
      </button>

      {/* Dynamic Background Objects */}
      <div className="sidebar-bg-objects">
        <svg className="sb-obj obj-box" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>

        <svg className="sb-obj obj-ring" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>

        <svg className="sb-obj obj-poly" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <ScrollArea className="sidebar-scroll-area">
        <nav className="sidebar-nav">
          {menuData.map((group, gIdx) => (
            <React.Fragment key={group.section || `group-${gIdx}`}>
              {group.section && <div className="nav-section">{group.section}</div>}
              <ul>
                {group.items.map((item) => {
                const hasSub = !!item.subItems;
                // Auto expand if currently on a sub-item path OR manually expanded
                const isItemActive = item.path === window.location.pathname;
                const isSubActive = hasSub && item.subItems!.some(sub => sub.path === window.location.pathname);
                // If explicit state exists, honor it; otherwise default to true if child is active
                const explicitState = expandedMenus[item.label];
                const isExpanded = explicitState !== undefined ? explicitState : isSubActive;

                return (
                  <React.Fragment key={item.label}>
                    <li 
                      className={`${(isItemActive || (!hasSub && isSubActive)) ? "active" : ""} ${isExpanded ? "expanded" : ""}`}
                      onClick={() => handleToggleMenu(item.label, hasSub, item.path, isExpanded)}
                      onMouseEnter={(e) => handleMouseEnter(e, item.label, item.subItems)}
                      onMouseLeave={handleMouseLeave}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleMenu(item.label, hasSub, item.path, isExpanded) }}
                    >
                      {item.icon}
                      <span className="nav-label">{item.label}</span>
                      {hasSub && (
                        <div className="sub-menu-indicator">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />}
                        </div>
                      )}
                    </li>

                    {/* Sub Menu Level 2 */}
                    {hasSub && isExpanded && (
                      <ul className="sub-menu">
                        {item.subItems!.map((sub) => {
                          const isChildActive = sub.path === window.location.pathname;
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
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation();
                                  navigate(sub.path);
                                }
                              }}
                            >
                              {sub.icon ? sub.icon : <div className="sub-item-bullet" />}
                              <span className="sub-nav-label flex-1" style={{ color: isChildActive ? "white" : undefined }}>{sub.label}</span>
                              {(sub as any).badge && (
                                <span className="text-[9px] uppercase font-bold tracking-[0.08em] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap ml-auto">
                                  {(sub as any).badge}
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
      {activeToast && isCollapsed && (
        <div className="custom-floating-toast" style={{ top: activeToast.top }}>
          <div className="toast-main">{activeToast.text}</div>
          {activeToast.subItems && activeToast.subItems.length > 0 && (
            <div className="toast-subs">
              {activeToast.subItems.map((s) => (
                <div key={s} className="toast-sub-item">• {s}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
