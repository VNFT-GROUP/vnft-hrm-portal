import type { AllowanceReportItem } from "@/types/report/AllowanceReportItem";
import { FolderKanban } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface AllowanceReportTableProps {
  items: AllowanceReportItem[];
}

export function AllowanceReportTable({ items }: AllowanceReportTableProps) {
  const formatScore = (val: number | undefined | null) => {
    if (val === null || val === undefined) return "—";
    return Number(val).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full relative min-h-[400px] border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col bg-white">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[13px] text-slate-500 uppercase bg-slate-50/80 sticky top-0 z-10 
                            after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-slate-200">
            <tr>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062]">Mã NV</th>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062]">Họ Tên</th>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062]">Phòng Ban</th>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">Hiệu Suất</th>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062] text-center">Chuyên Cần</th>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062] text-right border-l border-slate-200/50">PC Hiệu Suất</th>
              <th className="px-5 py-4 font-bold tracking-wider text-[#1E2062] text-right">PC Chuyên Cần</th>
              <th className="px-5 py-4 font-extrabold tracking-wider text-rose-700 text-right bg-rose-50/50 border-l border-rose-200/50">Tổng Phụ Cấp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr 
                key={item.userId || index} 
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="px-5 py-3.5 font-mono text-slate-600 font-medium">
                  {item.employeeCode}
                </td>
                <td className="px-5 py-3.5 font-bold text-[#1E2062] truncate max-w-[200px]" title={item.fullName}>
                  {item.fullName}
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {item.departmentName || "—"}
                </td>
                
                {/* Scores */}
                <td className="px-5 py-3.5 text-center font-semibold text-indigo-700 border-l border-transparent group-hover:border-slate-100">
                  {formatScore(item.performanceScore)}
                </td>
                <td className="px-5 py-3.5 text-center font-semibold text-emerald-600">
                  {formatScore(item.attendanceScore)}
                </td>

                {/* Money Details */}
                <td className="px-5 py-3.5 text-right font-medium text-slate-700 border-l border-transparent group-hover:border-slate-100">
                  {formatVND(item.performanceAllowance || 0)}
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-slate-700">
                  {formatVND(item.attendanceAllowance || 0)}
                </td>

                {/* Total */}
                <td className="px-5 py-3.5 text-right font-bold text-rose-600 bg-rose-50/30 border-l border-transparent group-hover:border-rose-100/50">
                  {formatVND(item.totalAllowance || 0)}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FolderKanban size={40} className="mb-3 opacity-30" />
                    <p className="text-base font-semibold text-slate-800">Không có dữ liệu phụ cấp cho kỳ đã chọn</p>
                    <p className="text-sm mt-1 text-slate-500">Vui lòng thay đổi tiêu chí lọc hoặc chọn kỳ khác để xem thêm.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer Summary (Optional, can show count) */}
      {items.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <span className="text-sm font-medium text-slate-500">Tổng cộng {items.length} nhân viên</span>
        </div>
      )}
    </div>
  );
}
