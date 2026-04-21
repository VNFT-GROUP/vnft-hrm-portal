import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { performanceService } from "@/services/performance";
import type { PerformanceEmployeeResponse } from "@/types/performance/PerformanceEmployeeResponse";
import { m } from "framer-motion";
import { Star, Plus, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/custom/CustomPagination";
import PerformanceReviewFormModal from "./components/PerformanceReviewFormModal";
import PerformanceReviewDetailModal from "./components/PerformanceReviewDetailModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  
  const [reviewYear, setReviewYear] = useState<number>(new Date().getFullYear());
  const [reviewMonth, setReviewMonth] = useState<number>(new Date().getMonth() + 1);
  const [search, setSearch] = useState("");
  
  // Passed to Detail/Form Modal (we pass userId and period to load review or create new)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['performance-employees', reviewYear, reviewMonth],
    queryFn: () => performanceService.getPerformanceReviewEmployees(reviewYear, reviewMonth)
  });

  const employees = useMemo(() => {
    let arr = response?.data || [];
    if (search.trim()) {
      const s = search.toLowerCase();
      arr = arr.filter(e => (e.fullName || "").toLowerCase().includes(s) || (e.employeeCode || "").toLowerCase().includes(s));
    }
    return arr;
  }, [response?.data, search]);
  
  const totalPages = Math.max(1, Math.ceil(employees.length / pageSize));
  
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return employees.slice(startIndex, startIndex + pageSize);
  }, [employees, currentPage, pageSize]);

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
                <Select value={reviewYear.toString()} onValueChange={(v) => { setReviewYear(parseInt(v as string)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[120px] h-10 border-slate-200 bg-slate-50/50">
                    <SelectValue placeholder="Năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y.toString()}>Năm {y}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={reviewMonth.toString()} onValueChange={(v) => { setReviewMonth(parseInt(v as string)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[120px] h-10 border-slate-200 bg-slate-50/50">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>
          <div className="relative w-full sm:w-[250px] lg:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Tìm kiếm nhân sự..."
              className="pl-9 h-10 border-slate-200 focus-visible:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 z-0">
              <tr>
                <th className="px-5 py-4 font-semibold tracking-wider">Nhân sự</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Phòng ban / Chức vụ</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Trạng thái</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Kết quả</th>
                <th className="px-5 py-4 font-semibold tracking-wider text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2E3192]" />
                    Đang tải danh sách nhân sự...
                  </td>
                </tr>
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-slate-400 bg-slate-50/30">
                    <Star className="w-10 h-10 mx-auto text-slate-300 mb-3" strokeWidth={1} />
                    <p className="text-base text-slate-600 font-medium">Không tìm thấy nhân sự phù hợp</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((row: PerformanceEmployeeResponse) => (
                  <tr key={row.userId} className={cn("hover:bg-indigo-50/30 transition-colors", !row.canReview && "opacity-60 bg-slate-50/50")}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-[#2E3192] font-bold text-xs shrink-0 ring-2 ring-white shadow-sm">
                          {row.fullName?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-[13px]">{row.fullName}</span>
                          <span className="text-[11.5px] text-slate-500 flex items-center gap-1">
                             <span className="bg-slate-100 border border-slate-200 px-1 rounded text-[10px] font-mono">{row.employeeCode || "N/A"}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                         <span className="text-[13px] text-slate-700 font-medium">{row.departmentName || "—"}</span>
                         <span className="text-[11.5px] text-slate-500">{row.jobTitleName || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                       {row.hasReview ? (
                          <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200/60">
                             Đã đánh giá
                          </span>
                       ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                             Chưa đánh giá
                          </span>
                       )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.hasReview && row.overallScore ? (
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-bold shadow-sm border ${SCORE_COLORS[row.overallScore] || SCORE_COLORS[3]}`}>
                           {row.overallScore} <Star className="fill-current" size={12} />
                           {row.overallScoreName && <span className="ml-1 text-[11px] uppercase tracking-wide opacity-90">• {row.overallScoreName}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.hasReview ? (
                          <>
                            <button
                              onClick={() => setSelectedReviewId(row.reviewId!)}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#2E3192]/40 hover:bg-slate-50 hover:text-[#2E3192] text-slate-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => {
                                setActiveUserId(row.userId);
                                setIsFormModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors shadow-sm"
                            >
                              Cập nhật
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUserId(row.userId);
                              setIsFormModalOpen(true);
                            }}
                            disabled={!row.canReview}
                            className="px-4 py-1.5 bg-[#2E3192] hover:bg-[#1E2062] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed border-transparent text-white rounded-lg text-xs font-medium transition-colors shadow-sm gap-1 flex items-center"
                          >
                            <Plus size={14} /> Chấm điểm
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
        onOpenChange={(v) => { setIsFormModalOpen(v); if(!v) setActiveUserId(null); }}
        userId={activeUserId}
        reviewYear={reviewYear}
        reviewMonth={reviewMonth}
      />
      
      <PerformanceReviewDetailModal
        isOpen={!!selectedReviewId}
        onOpenChange={(v) => !v && setSelectedReviewId(null)}
        id={selectedReviewId}
      />
    </div>
  );
}
