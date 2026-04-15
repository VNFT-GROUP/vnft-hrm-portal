import React from "react";
import { useTranslation } from "react-i18next";
import { Palette, Monitor, Type } from "lucide-react";
import { useLayoutStore } from "../../../../store/useLayoutStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { Switch } from "../../../../components/ui/switch";
import { Label } from "../../../../components/ui/label";
import { LayoutDashboard, UserCircle, Calendar, Clock, FileEdit, FolderOpen, Settings as SettingsIcon, MousePointer2 } from "lucide-react";

export default function QuickCustomizeSheet({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  
  const showEmployeeLegend = useLayoutStore((state) => state.showEmployeeLegend);
  const setShowEmployeeLegend = useLayoutStore((state) => state.setShowEmployeeLegend);
  const showDepartmentLegend = useLayoutStore((state) => state.showDepartmentLegend);
  const setShowDepartmentLegend = useLayoutStore((state) => state.setShowDepartmentLegend);
  const showRoleLegend = useLayoutStore((state) => state.showRoleLegend);
  const setShowRoleLegend = useLayoutStore((state) => state.setShowRoleLegend);
  
  const sidebarTheme = useLayoutStore((state) => state.sidebarTheme);
  const setSidebarTheme = useLayoutStore((state) => state.setSidebarTheme);
  
  const appFont = useLayoutStore((state) => state.appFont);
  const setAppFont = useLayoutStore((state) => state.setAppFont);
  
  const cursorStyle = useLayoutStore((state) => state.cursorStyle);
  const setCursorStyle = useLayoutStore((state) => state.setCursorStyle);
  
  const hiddenSidebarItems = useLayoutStore((state) => state.hiddenSidebarItems) || [];
  const toggleSidebarItemVisibility = useLayoutStore((state) => state.toggleSidebarItemVisibility);

  const themePresets = [
    { id: 'theme-midnight', name: 'Midnight', color1: '#161845', color2: '#2E3192' },
    { id: 'theme-ocean', name: 'Ocean Depth', color1: '#0c4a6e', color2: '#0284c7' },
    { id: 'theme-emerald', name: 'Emerald', color1: '#064E3B', color2: '#059669' },
    { id: 'theme-ruby', name: 'Ruby', color1: '#4c0519', color2: '#be123c' },
    { id: 'theme-obsidian', name: 'Obsidian', color1: '#09090b', color2: '#27272a' },
  ];

  const fontPresets = [
    { id: 'font-roboto', name: 'Roboto' },
    { id: 'font-inter', name: 'Inter' },
    { id: 'font-be-vietnam-pro', name: 'Be Vietnam Pro' },
    { id: 'font-montserrat', name: 'Montserrat' },
    { id: 'font-nunito', name: 'Nunito' },
  ];

  const cursorPresets = [
    { id: 'cursor-default', name: t('settings.cursorSection.default', { defaultValue: 'Mặc định' }), icon: <MousePointer2 size={18} className="text-muted-foreground" /> },
    { id: 'cursor-vnft', name: t('settings.cursorSection.vnft', { defaultValue: 'VNFT' }), icon: <MousePointer2 fill="#F7941D" stroke="#2E3192" size={18} className="text-[#2E3192]" /> },
    { id: 'cursor-dark', name: t('settings.cursorSection.dark', { defaultValue: 'Tối' }), icon: <MousePointer2 fill="#1E2062" stroke="white" size={18} className="text-[#1E2062]" /> },
    { id: 'cursor-neon', name: t('settings.cursorSection.neon', { defaultValue: 'Neon' }), icon: <MousePointer2 fill="#0ea5e9" stroke="white" size={18} className="text-[#0ea5e9]" /> },
    { id: 'cursor-rose', name: t('settings.cursorSection.rose', { defaultValue: 'Hồng' }), icon: <MousePointer2 fill="#f43f5e" stroke="white" size={18} className="text-[#f43f5e]" /> },
  ];

  const customizableMenus = [
    { id: "dashboard", label: t("sidebar.dashboard"), icon: <LayoutDashboard size={14} className="text-muted-foreground mr-1.5 shrink-0" /> },
    { id: "profile", label: t("sidebar.profile"), icon: <UserCircle size={14} className="text-muted-foreground mr-1.5 shrink-0" /> },
    { id: "myAttendance", label: t("sidebar.myAttendance", { defaultValue: "Bảng công của tôi" }), icon: <Clock size={14} className="text-muted-foreground mr-1.5 shrink-0" /> },
    { id: "requests", label: t("sidebar.requests"), icon: <FileEdit size={14} className="text-muted-foreground mr-1.5 shrink-0" /> },
    { id: "management", label: t("sidebar.management"), icon: <FolderOpen size={14} className="text-muted-foreground mr-1.5 shrink-0" /> },
    { id: "systemManagement", label: t("sidebar.systemManagement", { defaultValue: "Quản lý Hệ Thống" }), icon: <SettingsIcon size={14} className="text-muted-foreground mr-1.5 shrink-0" /> },
  ];

  return (
    <Sheet>
      <SheetTrigger>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[700px]! max-w-[700px]! !p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl text-[#1E2062] flex items-center gap-2">
            <Palette size={24} /> {t("settings.title", { defaultValue: "Tuỳ chỉnh nhanh" })}
          </SheetTitle>
          <SheetDescription>
            {t("settings.subtitle", { defaultValue: "Thay đổi giao diện và hiển thị theo phong cách của bạn." })}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-8">
          
          {/* Themes */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette size={18} className="text-[#db2777]" /> Giao diện Sidebar
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSidebarTheme(preset.id)}
                  className={`relative h-16 rounded-xl flex items-center justify-center transition-all duration-300 border-2 overflow-hidden ${
                    sidebarTheme === preset.id 
                      ? 'border-[#F7941D] scale-[1.02] shadow-md' 
                      : 'border-transparent shadow-sm hover:scale-[1.02]'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})` }}
                >
                  <span className="text-sm font-semibold text-white tracking-wide shadow-sm z-10">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Type size={18} className="text-[#059669]" /> Phông chữ
            </h3>
            <div className="flex flex-wrap gap-2">
              {fontPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setAppFont(preset.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    appFont === preset.id
                      ? 'bg-[#2E3192] text-white border-[#2E3192]'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cursors */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MousePointer2 size={18} className="text-[#f43f5e]" /> Con trỏ chuột
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {cursorPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setCursorStyle(preset.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 text-center ${
                    cursorStyle === preset.id 
                      ? 'border-[#f43f5e] bg-[#f43f5e]/5 shadow-sm' 
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                  title={preset.name}
                >
                  <div className="h-6 flex items-center justify-center">
                    {preset.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legends Display */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Monitor size={18} className="text-[#2E3192]" /> Tuỳ chọn hiển thị
            </h3>
            
            <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <Label htmlFor="q-emp-legend" className="cursor-pointer font-medium">Hiện chú thích Nhân viên</Label>
                <Switch id="q-emp-legend" checked={showEmployeeLegend} onCheckedChange={setShowEmployeeLegend} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="q-dep-legend" className="cursor-pointer font-medium">Hiện chú thích Phòng ban</Label>
                <Switch id="q-dep-legend" checked={showDepartmentLegend} onCheckedChange={setShowDepartmentLegend} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="q-role-legend" className="cursor-pointer font-medium">Hiện chú thích Chức vụ</Label>
                <Switch id="q-role-legend" checked={showRoleLegend} onCheckedChange={setShowRoleLegend} />
              </div>
            </div>
          </div>

          {/* Sidebar Menu Visibility Toggle */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <LayoutDashboard size={18} className="text-[#8b5cf6]" /> Trình đơn Sidebar
            </h3>
            
            <div className="flex flex-col gap-1 bg-muted/20 p-2 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground px-2 mb-2 italic">Tắt các tính năng bạn không sử dụng thường xuyên để sidebar gọn gàng hơn.</p>
              {customizableMenus.map((menu) => (
                <div key={menu.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                  <Label htmlFor={`hide-${menu.id}`} className="flex items-center cursor-pointer font-medium flex-1 h-full select-none">
                    {menu.icon}
                    <span className={hiddenSidebarItems.includes(menu.id) ? "text-muted-foreground/70" : "text-foreground"}>{menu.label}</span>
                  </Label>
                  <Switch 
                    id={`hide-${menu.id}`} 
                    checked={!hiddenSidebarItems.includes(menu.id)} 
                    onCheckedChange={() => toggleSidebarItemVisibility(menu.id)} 
                    className="data-[state=checked]:bg-[#8b5cf6]"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
