import { useState } from "react";
import { AllowanceReportFilter } from "./components/AllowanceReportFilter";
import { AllowanceReportTable } from "./components/AllowanceReportTable";
import { AttendanceDisciplineReportFilter } from "./components/AttendanceDisciplineReportFilter";
import { AttendanceDisciplineReportTable } from "./components/AttendanceDisciplineReportTable";
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { PERMISSIONS } from "@/lib/permission/permissions";
import { useAllowanceReport } from "./hooks/useAllowanceReport";
import { useAttendanceDisciplineReport } from "./hooks/useAttendanceDisciplineReport";
import { useTranslation } from "react-i18next";

export default function ReportsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"allowance" | "attendance">("allowance");

  const allowance = useAllowanceReport();
  const attendance = useAttendanceDisciplineReport();

  const { session } = useAuthStore();
  const perms = session?.groupPermissions?.map(p => p.code) || [];
  const isAdmin = session?.groupName === "ADMIN";
  const canView = isAdmin || perms.includes(PERMISSIONS.ALLOWANCE_REPORT_VIEW);

  if (!canView) {
    return (
      <div className="w-full min-h-full flex flex-col items-center justify-center p-6 gap-6 md:gap-8">
        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{t("reports.noAccessTitle", { defaultValue: "Không có quyền truy cập" })}</h2>
          <p className="text-slate-500 mb-6">{t("reports.noAccessDesc", { defaultValue: "Bạn không có quyền xem báo cáo phụ cấp nhân viên. Vui lòng liên hệ quản trị viên nếu bạn cần truy cập tính năng này." })}</p>
        </m.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8">
      
      {/* Header section */}
      <m.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1E2062] tracking-tight">
            {t("reports.title", { defaultValue: "Báo cáo nội bộ" })}
          </h1>
          <p className="text-slate-500 font-medium text-sm">{t("reports.subtitle", { defaultValue: "Theo dõi phụ cấp, chuyên cần và các chỉ số vận hành nhân sự theo kỳ." })}</p>
        </div>
      </m.div>

      {/* Tabs UI */}
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("allowance")}
          className={`pb-3 px-4 text-sm font-bold transition-all relative ${
            activeTab === "allowance" ? "text-[#2E3192]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t("reports.allowanceTab", { defaultValue: "Bảng Tính Phụ Cấp" })}
          {activeTab === "allowance" && (
            <m.div layoutId="activeTabReport" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E3192]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-3 px-4 text-sm font-bold transition-all relative ${
            activeTab === "attendance" ? "text-[#2E3192]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t("reports.attendanceTab", { defaultValue: "Báo Cáo Chuyên Cần" })}
          {activeTab === "attendance" && (
            <m.div layoutId="activeTabReport" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E3192]" />
          )}
        </button>
      </m.div>

      <AnimatePresence mode="wait">
        {activeTab === "allowance" && (
          <m.div 
            key="allowance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <AllowanceReportFilter
              periodType={allowance.periodType}
              setPeriodType={allowance.setPeriodType}
              year={allowance.year}
              setYear={allowance.setYear}
              month={allowance.month}
              setMonth={allowance.setMonth}
              quarter={allowance.quarter}
              setQuarter={allowance.setQuarter}
              onExport={allowance.handleExport}
              isExporting={allowance.isExporting}
            />

            <div className="flex-1 min-h-0 flex flex-col">
              {allowance.isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
                  <Loader2 className="w-10 h-10 text-[#2E3192] animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">{t("reports.allowanceLoading", { defaultValue: "Đang tải dữ liệu báo cáo..." })}</p>
                </div>
              ) : allowance.isError ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-red-50/50 rounded-2xl border border-red-100 min-h-[400px] text-red-600">
                  <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                  <p className="font-bold">{t("reports.allowanceError", { defaultValue: "Không thể tải dữ liệu báo cáo." })}</p>
                  <p className="text-sm opacity-80 mt-1">{t("reports.allowanceErrorHint", { defaultValue: "Vui lòng thử lại sau hoặc liên hệ quản trị viên." })}</p>
                </div>
              ) : (
                <AllowanceReportTable items={allowance.data?.data?.items || []} />
              )}
            </div>
          </m.div>
        )}

        {activeTab === "attendance" && (
          <m.div 
            key="attendance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <p className="text-slate-600 text-sm italic -mt-2">
              {t("reports.attendanceDesc", { defaultValue: "Tổng hợp điểm chuyên cần, ngày công, vi phạm giờ giấc và phụ cấp chuyên cần." })}
            </p>
            <AttendanceDisciplineReportFilter
              periodType={attendance.periodType}
              setPeriodType={attendance.setPeriodType}
              year={attendance.year}
              setYear={attendance.setYear}
              month={attendance.month}
              setMonth={attendance.setMonth}
              quarter={attendance.quarter}
              setQuarter={attendance.setQuarter}
              onExport={attendance.handleExport}
              isExporting={attendance.isExporting}
            />

            <div className="flex-1 min-h-0 flex flex-col">
              {attendance.isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
                  <Loader2 className="w-10 h-10 text-[#2E3192] animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">{t("reports.attendanceLoading", { defaultValue: "Đang tải báo cáo chuyên cần..." })}</p>
                </div>
              ) : attendance.isError ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-red-50/50 rounded-2xl border border-red-100 min-h-[400px] text-red-600">
                  <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                  <p className="font-bold">{t("reports.attendanceError", { defaultValue: "Không thể tải báo cáo chuyên cần. Vui lòng thử lại sau." })}</p>
                </div>
              ) : (
                <AttendanceDisciplineReportTable items={attendance.data?.data?.items || []} />
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

    </div>
  );
}
