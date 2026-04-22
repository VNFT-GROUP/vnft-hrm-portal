import type { AttendanceDisciplineReportItem } from "@/types/report/AttendanceDisciplineReportItem";
import { FolderKanban } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface AttendanceDisciplineReportTableProps {
  items: AttendanceDisciplineReportItem[];
}

export function AttendanceDisciplineReportTable({ items }: AttendanceDisciplineReportTableProps) {
  const formatNum = (val: number | undefined | null) => {
    if (val === null || val === undefined) return "—";
    return Number(val).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getScoreStyle = (score: number) => {
    if (score <= 2) return "text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-bold";
    if (score >= 4) return "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold";
    return "text-indigo-700 font-semibold";
  };

  const totalEmp = items.length;
  const avgAttScore = totalEmp ? items.reduce((acc, curr) => acc + (curr.attendanceScore || 0), 0) / totalEmp : 0;
  const totalAttAllowance = items.reduce((acc, curr) => acc + (curr.attendanceAllowance || 0), 0);
  const totalLate = items.reduce((acc, curr) => acc + (curr.lateDays || 0), 0);
  const totalAbsent = items.reduce((acc, curr) => acc + (curr.absentDays || 0), 0);

  return (
    <div className="w-full relative min-h-[400px] border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col bg-white">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[13px] text-slate-500 uppercase bg-slate-50/80 sticky top-0 z-10 
                            after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-slate-200">
            <tr>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] sticky left-0 z-20 bg-slate-50/80">Mã NV</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] sticky left-[100px] z-20 bg-slate-50/80">Họ tên</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062]">Phòng ban</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">Điểm CV</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-right">PC Chuyên Cần</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">Ngày công</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center">Công QĐ</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">Đi trễ</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center">Vắng</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center">VP lớn</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">Lần trừ phép</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center">Phép trừ</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">WFH Duyệt</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center">WFH Vượt</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center">Phép trừ WFH</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062] text-center border-l border-slate-200/50">Tháng khóa</th>
              <th className="px-4 py-4 font-bold tracking-wider text-[#1E2062]">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr 
                key={item.userId || index} 
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="px-4 py-3.5 font-mono text-slate-600 font-medium sticky left-0 z-10 bg-white group-hover:bg-indigo-50/30">
                  {item.employeeCode}
                </td>
                <td className="px-4 py-3.5 font-bold text-[#1E2062] truncate max-w-[180px] sticky left-[100px] z-10 bg-white group-hover:bg-indigo-50/30" title={item.fullName}>
                  {item.fullName}
                </td>
                <td className="px-4 py-3.5 text-slate-600 truncate max-w-[150px]" title={item.departmentName || ""}>
                  {item.departmentName || "—"}
                </td>
                
                {/* Score */}
                <td className="px-4 py-3.5 text-center border-l border-transparent group-hover:border-slate-100">
                  <span className={getScoreStyle(item.attendanceScore || 0)}>{formatNum(item.attendanceScore)}</span>
                </td>
                
                {/* Money */}
                <td className="px-4 py-3.5 text-right font-medium text-emerald-600">
                  {formatVND(item.attendanceAllowance || 0)}
                </td>

                <td className="px-4 py-3.5 text-center font-medium text-slate-700 border-l border-transparent group-hover:border-slate-100">
                  {formatNum(item.workingDays)}
                </td>
                <td className="px-4 py-3.5 text-center font-medium text-indigo-700">
                  {formatNum(item.workUnits)}
                </td>

                <td className="px-4 py-3.5 text-center text-rose-600 font-medium border-l border-transparent group-hover:border-slate-100">
                  {formatNum(item.lateDays)}
                </td>
                <td className="px-4 py-3.5 text-center text-rose-600 font-medium">
                  {formatNum(item.absentDays)}
                </td>
                <td className="px-4 py-3.5 text-center text-amber-600 font-medium">
                  {formatNum(item.majorLateEarlyViolationTimes)}
                </td>

                <td className="px-4 py-3.5 text-center text-slate-600 border-l border-transparent group-hover:border-slate-100">
                  {formatNum(item.leaveDeductionViolationTimes)}
                </td>
                <td className="px-4 py-3.5 text-center text-slate-600 font-medium">
                  {formatNum(item.leaveDeductionDays)}
                </td>

                <td className="px-4 py-3.5 text-center text-sky-600 border-l border-transparent group-hover:border-slate-100">
                  {formatNum(item.approvedWfhDays)}
                </td>
                <td className="px-4 py-3.5 text-center text-amber-600 font-medium">
                  {formatNum(item.wfhOverLimitDays)}
                </td>
                <td className="px-4 py-3.5 text-center text-slate-600 font-medium">
                  {formatNum(item.wfhLeaveDeductionDays)}
                </td>

                <td className="px-4 py-3.5 text-center text-slate-500 border-l border-transparent group-hover:border-slate-100">
                  {item.lockedMonths ? formatNum(item.lockedMonths) : "—"}
                </td>
                <td className="px-4 py-3.5 text-slate-500 truncate max-w-[150px]" title={item.note || ""}>
                  {item.note || "—"}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={17} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FolderKanban size={40} className="mb-3 opacity-30" />
                    <p className="text-base font-semibold text-slate-800">Không có dữ liệu chuyên cần cho kỳ đã chọn</p>
                    <p className="text-sm mt-1 text-slate-500">Vui lòng thay đổi tiêu chí lọc hoặc chọn kỳ khác để xem thêm.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {items.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-x-8 gap-y-2 justify-between items-center shrink-0">
          <span className="text-sm font-medium text-slate-600">Tổng NV: <span className="font-bold text-[#1E2062]">{totalEmp}</span></span>
          <span className="text-sm font-medium text-slate-600">TB Điểm CC: <span className="font-bold text-indigo-600">{formatNum(avgAttScore)}</span></span>
          <span className="text-sm font-medium text-slate-600">Tổng Trễ: <span className="font-bold text-rose-600">{formatNum(totalLate)}</span></span>
          <span className="text-sm font-medium text-slate-600">Tổng Vắng: <span className="font-bold text-rose-600">{formatNum(totalAbsent)}</span></span>
          <span className="text-sm font-medium text-slate-600 border-l border-slate-300 pl-8">Tổng PC CC: <span className="font-bold text-emerald-600">{formatVND(totalAttAllowance)}</span></span>
        </div>
      )}
    </div>
  );
}
