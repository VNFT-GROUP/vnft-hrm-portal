import { AllowanceReportFilter } from "./components/AllowanceReportFilter";
import { AllowanceReportTable } from "./components/AllowanceReportTable";
import { useAllowanceReport } from "./hooks/useAllowanceReport";
import { Loader2, AlertCircle } from "lucide-react";
import { m } from "framer-motion";

export default function ReportsPage() {
  const {
    periodType,
    setPeriodType,
    year,
    setYear,
    month,
    setMonth,
    quarter,
    setQuarter,
    data,
    isLoading,
    isError,
    isExporting,
    handleExport,
  } = useAllowanceReport();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header section */}
      <m.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1E2062] tracking-tight">
            Bảo Cáo
          </h1>
          <p className="text-slate-500 font-medium">Bảng Tính Phụ Cấp Nhân Viên</p>
        </div>
      </m.div>

      {/* Filter Bar */}
      <m.div
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AllowanceReportFilter
          periodType={periodType}
          setPeriodType={setPeriodType}
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
          quarter={quarter}
          setQuarter={setQuarter}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </m.div>

      {/* Main Content Area */}
      <m.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-h-0 flex flex-col"
      >
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#2E3192] animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Đang tải dữ liệu báo cáo...</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-red-50/50 rounded-2xl border border-red-100 min-h-[400px] text-red-600">
            <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
            <p className="font-bold">Không thể tải dữ liệu báo cáo.</p>
            <p className="text-sm opacity-80 mt-1">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
          </div>
        ) : (
          <AllowanceReportTable items={data?.data?.items || []} />
        )}
      </m.div>

    </div>
  );
}
