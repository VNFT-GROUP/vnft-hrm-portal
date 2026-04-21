import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { performanceService } from "@/services/performance";
import type { PerformanceReviewResponse } from "@/types/performance/PerformanceReviewResponse";
import { m } from "framer-motion";
import { Star, Plus, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/custom/CustomPagination";
import { format } from "date-fns";
import PerformanceReviewFormModal from "./components/PerformanceReviewFormModal";
import PerformanceReviewDetailModal from "./components/PerformanceReviewDetailModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SCORE_COLORS: Record<number, string> = {
  1: "bg-rose-50 text-rose-700 border-rose-200",
  2: "bg-amber-50 text-amber-700 border-amber-200",
  3: "bg-blue-50 text-blue-700 border-blue-200",
  4: "bg-emerald-50 text-emerald-700 border-emerald-200",
  5: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function PerformanceReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [reviewYear, setReviewYear] = useState<string>(new Date().getFullYear().toString());
  const [reviewMonth, setReviewMonth] = useState<string>("all");
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['performance-reviews', reviewYear, reviewMonth],
    queryFn: () => performanceService.getPerformanceReviews({
      reviewYear: reviewYear && reviewYear !== "all" ? parseInt(reviewYear) : undefined,
      reviewMonth: reviewMonth && reviewMonth !== "all" ? parseInt(reviewMonth) : undefined
    })
  });

  const allReviews = response?.data || [];
  
  const totalPages = Math.max(1, Math.ceil(allReviews.length / pageSize));
  
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return allReviews.slice(startIndex, startIndex + pageSize);
  }, [allReviews, currentPage, pageSize]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 bg-slate-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-transparent">
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
            <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
              <Star size={24} strokeWidth={2.5} />
            </span>
            Đánh giá hiệu suất
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">
            Quản lý và thực hiện đánh giá hiệu suất hàng tháng cho nhân sự trong phòng ban.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Button
            onClick={() => {
              setEditingId(null);
              setIsFormModalOpen(true);
            }}
            className="bg-[#2E3192] hover:bg-[#1E2062] active:bg-[#1E2062] text-white shadow-md hover:shadow-lg transition-all px-4 h-11 rounded-lg font-medium gap-2 flex"
          >
            <Plus size={18} strokeWidth={2.5} /> Tạo kỳ đánh giá
          </Button>
        </m.div>
      </div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col grow bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-white z-10 sticky top-0">
          <div className="flex items-center gap-3 flex-wrap">
             <div className="flex items-center gap-2">
                <Select value={reviewYear} onValueChange={(v) => { if (v) { setReviewYear(v); setCurrentPage(1); }}}>
                  <SelectTrigger className="w-[120px] h-10 border-slate-200 bg-slate-50/50">
                    <SelectValue placeholder="Năm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả năm</SelectItem>
                    {years.map(y => <SelectItem key={y} value={y.toString()}>Năm {y}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={reviewMonth} onValueChange={(v) => { if (v) { setReviewMonth(v); setCurrentPage(1); }}}>
                  <SelectTrigger className="w-[120px] h-10 border-slate-200 bg-slate-50/50">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tháng</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 z-0">
              <tr>
                <th className="px-5 py-4 font-semibold tracking-wider">Nhân sự</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Phòng ban / Chức vụ</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Kỳ đánh giá</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Điểm & Xếp loại</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Mức thưởng</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Người đánh giá</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Ngày đánh giá</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-slate-400 bg-slate-50/30">
                    <Star className="w-10 h-10 mx-auto text-slate-300 mb-3" strokeWidth={1} />
                    <p className="text-base text-slate-600 font-medium">Chưa có đánh giá hiệu suất nào</p>
                    <p className="text-sm mt-1">Sử dụng nút "Tạo kỳ đánh giá" để bắt đầu.</p>
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((row: PerformanceReviewResponse) => (
                  <tr key={row.id} className={`hover:bg-indigo-50/30 transition-colors ${row.active === false ? "opacity-50 grayscale" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 ring-2 ring-white shadow-sm">
                          {row.revieweeFullName?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-[13px]">{row.revieweeFullName}</span>
                          <span className="text-[11.5px] text-slate-500 flex items-center gap-1">
                             <span className="bg-slate-100 border border-slate-200 px-1 rounded text-[10px] font-mono">{row.revieweeEmployeeCode || "N/A"}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                         <span className="text-[13px] text-slate-700 font-medium">{row.revieweeDepartmentName || "—"}</span>
                         <span className="text-[11.5px] text-slate-500">{row.revieweeJobTitleName || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                        <Calendar size={13} className="text-slate-500" />
                        {row.reviewMonth}/{row.reviewYear}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold shadow-sm border ${SCORE_COLORS[row.overallScore] || SCORE_COLORS[3]}`}>
                         {row.overallScore} <Star className="fill-current" size={12} />
                         {row.overallScoreName && <span className="ml-1 text-[11px] uppercase tracking-wide opacity-90">• {row.overallScoreName}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                        <span className="font-semibold text-emerald-600">
                          {row.performanceAllowance != null 
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.performanceAllowance)
                              : "—"}
                        </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[13px] text-slate-700 font-medium">
                        {row.reviewerUsername || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-slate-500 text-[13px]">
                      {row.reviewedAt ? format(new Date(row.reviewedAt), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedId(row.id)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
                        >
                          Chi tiết
                        </button>
                        {row.active !== false && (
                          <button
                            onClick={() => {
                              setEditingId(row.id);
                              setIsFormModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
                          >
                            Cập nhật
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 w-full overflow-x-auto flex justify-center sm:justify-start">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </m.div>
      
      <PerformanceReviewFormModal
        isOpen={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        initialId={editingId}
      />
      
      <PerformanceReviewDetailModal
        isOpen={!!selectedId}
        onOpenChange={(v) => !v && setSelectedId(null)}
        id={selectedId}
      />
    </div>
  );
}
