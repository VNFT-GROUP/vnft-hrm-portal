import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { useLayoutStore } from "@/store/useLayoutStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const showEmployeeLegend = useLayoutStore((state) => state.showEmployeeLegend);
  const setShowEmployeeLegend = useLayoutStore((state) => state.setShowEmployeeLegend);

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
            {/* Setting Item 1 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="employee-legend-toggle" className="text-base font-semibold cursor-pointer">
                  Hiển thị bảng chú thích ở Quản lý nhân viên
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Bật/tắt thanh giải thích ý nghĩa các biểu tượng hành động (Xem, Sửa, Lương, Xóa) phía trên bảng danh sách nhân viên.
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
          </div>
        </motion.section>

        {/* Can add more sections below... */}
        
      </div>
    </div>
  );
}

