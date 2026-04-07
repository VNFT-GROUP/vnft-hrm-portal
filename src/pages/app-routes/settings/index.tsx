import { motion } from "framer-motion";
import { Monitor, Globe } from "lucide-react";
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
  const { i18n } = useTranslation();

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
        
        {/* Section 1: Display Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
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

        {/* Section 2: Language Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
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
        
      </div>
    </div>
  );
}

