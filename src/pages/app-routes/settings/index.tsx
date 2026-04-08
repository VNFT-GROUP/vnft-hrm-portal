import { motion } from "framer-motion";
import { Monitor, Globe, Palette, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLayoutStore } from "@/store/useLayoutStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
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
  const timezone = useLayoutStore((state) => state.timezone);
  const setTimezone = useLayoutStore((state) => state.setTimezone);

  const { i18n } = useTranslation();
  const [now, setNow] = useState(new Date());

  const fullTimezones = [
    "Asia/Ho_Chi_Minh",      // Vietnam & Cambodia
    "Asia/Shanghai",         // Shenzhen, China
    "America/New_York",      // New York, NY (EST)
    "America/Chicago",       // Houston, TX (CST)
    "America/Edmonton",      // Calgary, AB (MST)
    "America/Vancouver",     // Vancouver, BC & California (PST)
  ];

  useEffect(() => {
    // Update time every 10 seconds to keep dropdown time current
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const timezoneOptions = fullTimezones.map(tz => {
    try {
      const timeString = now.toLocaleTimeString('vi-VN', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
      const formatParts = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now);
      const offsetPart = formatParts.find(p => p.type === 'timeZoneName')?.value || '';
      
      let city = tz.split('/').pop()?.replace(/_/g, ' ') || tz;
      
      // Custom display names based on VNFT office locations
      if (tz === 'Asia/Ho_Chi_Minh') city = 'Việt Nam & Cambodia HQ';
      if (tz === 'Asia/Shanghai') city = 'Shenzhen (Văn phòng Trung Quốc)';
      if (tz === 'America/New_York') city = 'New York (Mỹ)';
      if (tz === 'America/Chicago') city = 'Houston, TX (Mỹ)';
      if (tz === 'America/Edmonton') city = 'Calgary, AB (Canada)';
      if (tz === 'America/Vancouver') city = 'California & Vancouver BC';

      return {
        value: tz,
        city,
        offsetPart,
        timeString
      };
    } catch {
      return { value: tz, city: tz, offsetPart: '', timeString: '' };
    }
  });

  const themePresets = [
    { id: 'theme-midnight', name: 'Midnight', color1: '#161845', color2: '#2E3192' },
    { id: 'theme-ocean', name: 'Ocean Depth', color1: '#0c4a6e', color2: '#0284c7' },
    { id: 'theme-emerald', name: 'Emerald', color1: '#064E3B', color2: '#059669' },
    { id: 'theme-ruby', name: 'Ruby', color1: '#4c0519', color2: '#be123c' },
    { id: 'theme-obsidian', name: 'Obsidian', color1: '#09090b', color2: '#27272a' },
  ];

  const fontPresets = [
    { id: 'font-roboto', name: 'Roboto', desc: 'Sạch sẽ, mặc định' },
    { id: 'font-inter', name: 'Inter', desc: 'Dễ đọc, trung tính' },
    { id: 'font-be-vietnam-pro', name: 'Be Vietnam Pro', desc: 'Tối ưu tiếng Việt' },
    { id: 'font-montserrat', name: 'Montserrat', desc: 'Sang trọng, hình học' },
    { id: 'font-nunito', name: 'Nunito', desc: 'Mềm mại, thân thiện' },
  ];



  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto min-h-full flex flex-col gap-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] uppercase tracking-wide">
          Cài đặt hệ thống
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Tùy chỉnh các chức năng, giao diện và luồng hoạt động của portal.
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6">

        {/* Section 1: Language Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#F7941D]/10 text-[#F7941D] rounded-xl">
              <Globe size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">Cài đặt ngôn ngữ</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-base font-semibold">
                  Ngôn ngữ hệ thống
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Thay đổi ngôn ngữ hiển thị tổng thể của portal. (Thay đổi có hiệu lực ngay lập tức).
                </p>
              </div>
              <div className="flex bg-muted p-1 rounded-lg border border-border">
                <button 
                  onClick={() => i18n.changeLanguage('vi')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${(i18n.language === 'vi' || i18n.language === 'vi-VN') ? 'bg-background shadow-sm text-[#2E3192]' : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'}`}
                >
                  <img src="https://flagcdn.com/w20/vn.png" width="20" alt="VN" className="rounded-sm shadow-sm" /> Tiếng Việt
                </button>
                <button 
                  onClick={() => i18n.changeLanguage('en')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${(i18n.language && i18n.language.startsWith('en')) ? 'bg-background shadow-sm text-[#2E3192]' : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'}`}
                >
                  <img src="https://flagcdn.com/w20/gb.png" width="20" alt="EN" className="rounded-sm shadow-sm" /> English
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 1.5: Timezone Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">Cài đặt múi giờ (Timezone)</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-base font-semibold">
                  Múi giờ hệ thống
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Thay đổi múi giờ được áp dụng cho đồng hồ góc phải và các báo cáo xuất ra. (Giờ hiển thị trên thẻ sẽ thay đổi thực tế theo thời gian).
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 w-full">
                {timezoneOptions.map(tz => (
                  <button
                    key={tz.value}
                    onClick={() => setTimezone(tz.value)}
                    className={`relative p-4 rounded-xl border flex flex-col items-start gap-2 transition-all duration-200 text-left ${
                      timezone === tz.value 
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 shadow-sm' 
                        : 'border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/30'
                    }`}
                  >
                    <span 
                      className={`text-[15px] font-semibold leading-tight ${timezone === tz.value ? 'text-[#8b5cf6]' : 'text-[#1E2062]'}`} 
                    >
                      {tz.city}
                    </span>
                    
                    <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
                      {tz.offsetPart}
                    </span>

                    <div className="absolute top-4 right-4 flex items-center justify-center font-bold text-lg text-foreground tabular-nums opacity-90 tracking-tight">
                       {tz.timeString}
                    </div>

                    {timezone === tz.value && (
                       <div className="absolute bottom-4 right-4 flex items-center justify-center w-5 h-5 bg-[#8b5cf6] text-white rounded-full shadow-sm">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Sidebar Theme Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#db2777]/10 text-[#db2777] rounded-xl">
              <Palette size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">Cài đặt màu sắc Sidebar</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-base font-semibold">
                  Màu nền thanh điều hướng (Sidebar)
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Thay đổi màu nền của menu điều hướng bên trái để phù hợp với sở thích của bạn.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                {themePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSidebarTheme(preset.id)}
                    className={`relative w-28 h-24 rounded-2xl flex flex-col items-center justify-end pb-3 transition-all duration-300 border-2 overflow-hidden ${
                      sidebarTheme === preset.id 
                        ? 'border-[#F7941D] scale-105 shadow-lg' 
                        : 'border-transparent shadow-sm hover:scale-105 hover:shadow-md'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})`
                    }}
                  >
                    <span className="text-xs font-semibold text-white tracking-wide text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10 w-full truncate px-2">
                      {preset.name}
                    </span>
                    {sidebarTheme === preset.id && (
                       <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-[#F7941D] text-white rounded-full z-10 shadow-sm">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Font Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#059669]/10 text-[#059669] rounded-xl">
              <Type size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">Cài đặt Phông chữ (Font)</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
               <Label className="text-base font-semibold">
                 Phông chữ hệ thống
               </Label>
               <p className="text-sm text-muted-foreground max-w-xl">
                 Lựa chọn font chữ yêu thích. Các font dưới đây đều được tối ưu hóa hiển thị chuẩn Tiếng Việt và Tiếng Anh.
               </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {fontPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setAppFont(preset.id)}
                    className={`relative p-4 rounded-xl border flex flex-col items-start gap-1 transition-all duration-200 text-left ${
                      appFont === preset.id 
                        ? 'border-[#2E3192] bg-[#2E3192]/5 shadow-sm' 
                        : 'border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/30'
                    }`}
                  >
                    <span 
                      className={`text-lg font-semibold ${preset.id} text-[#1E2062]`} 
                    >
                      {preset.name}
                    </span>
                    <span className={`text-xs text-muted-foreground ${preset.id}`}>
                      {preset.desc}
                    </span>
                    {appFont === preset.id && (
                       <div className="absolute top-4 right-4 flex items-center justify-center w-5 h-5 bg-[#2E3192] text-white rounded-full">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Display Settings (Moved to bottom) */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
              <Monitor size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">Cài đặt hiển thị</h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Setting Item 1: Employee Legend */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="employee-legend-toggle" className="text-base font-semibold cursor-pointer">
                  Hiển thị bảng chú thích ở Quản lý nhân viên
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Bật/tắt thanh giải thích ý nghĩa các biểu tượng hành động phía trên bảng danh sách nhân viên.
                </p>
              </div>
              <div className="mt-1">
                <Switch 
                  id="employee-legend-toggle"
                  checked={showEmployeeLegend}
                  onCheckedChange={setShowEmployeeLegend}
                  className="data-[state=checked]:bg-[#2E3192]"
                />
              </div>
            </div>

            {/* Setting Item 2: Department Legend */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="department-legend-toggle" className="text-base font-semibold cursor-pointer">
                  Hiển thị bảng chú thích ở Quản lý phòng ban
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Bật/tắt thanh giải thích ý nghĩa các biểu tượng hành động phía trên bảng danh sách cấu trúc phòng ban.
                </p>
              </div>
              <div className="mt-1">
                <Switch 
                  id="department-legend-toggle"
                  checked={showDepartmentLegend}
                  onCheckedChange={setShowDepartmentLegend}
                  className="data-[state=checked]:bg-[#2E3192]"
                />
              </div>
            </div>

            {/* Setting Item 3: Role Legend */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-legend-toggle" className="text-base font-semibold cursor-pointer">
                  Hiển thị bảng chú thích ở Quản lý chức vụ
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Bật/tắt thanh giải thích ý nghĩa các biểu tượng hành động phía trên bảng danh sách cấu trúc chức vụ.
                </p>
              </div>
              <div className="mt-1">
                <Switch 
                  id="role-legend-toggle"
                  checked={showRoleLegend}
                  onCheckedChange={setShowRoleLegend}
                  className="data-[state=checked]:bg-[#2E3192]"
                />
              </div>
            </div>
          </div>
        </motion.section>
        
      </div>
    </div>
  );
}
