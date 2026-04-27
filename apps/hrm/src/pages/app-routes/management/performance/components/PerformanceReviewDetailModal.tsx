import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { performanceService } from "@/services/performance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RichTextViewer } from "@/components/custom/RichTextViewer";
import { Loader2, Star, Calendar, Trash2, User, Building, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, formatVND } from "@/lib/utils";
import { format } from "date-fns";

interface PerformanceReviewDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id: string | null;
}

export default function PerformanceReviewDetailModal({ isOpen, onOpenChange, id }: PerformanceReviewDetailModalProps) {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['performance-review', id],
    queryFn: () => performanceService.getPerformanceReviewById(id!),
    enabled: !!id && isOpen,
  });

  const review = response?.data;

  const deleteMutation = useMutation({
    mutationFn: () => performanceService.deletePerformanceReview(id!),
    onSuccess: () => {
      toast.success("Khóa đánh giá thành công.");
      queryClient.invalidateQueries({ queryKey: ["performance-reviews"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Lỗi khi khóa bảng đánh giá."));
    }
  });

  const handleDelete = () => {
    if (confirm("Chắc chắn muốn khóa đánh giá này? Dữ liệu này sẽ không còn active nữa.")) {
      deleteMutation.mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50 gap-0 border-none rounded-xl">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-100 shrink-0 flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600"><Star size={18} /></div>
              Chi tiết đánh giá hiệu suất
            </DialogTitle>
            <DialogDescription className="text-sm">
              Thông tin đánh giá cho kỳ {review?.reviewMonth}/{review?.reviewYear}
            </DialogDescription>
          </div>
          {review && review.active === false && (
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-rose-200">
               Đã khóa (Inactive)
            </span>
          )}
        </DialogHeader>

        {isLoading || !review ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Header info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Reviewee */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Nhân sự được đánh giá</div>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0">
                     {review.revieweeFullName?.charAt(0) || "U"}
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800">{review.revieweeFullName || "—"}</span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                         <span className="flex items-center gap-1"><User size={12}/> {review.revieweeEmployeeCode || "N/A"}</span>
                         {review.revieweeDepartmentName && <span className="flex items-center gap-1"><Building size={12}/> {review.revieweeDepartmentName}</span>}
                      </div>
                      {review.revieweeJobTitleName && <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Briefcase size={12}/> {review.revieweeJobTitleName}</div>}
                   </div>
                 </div>
              </div>

              {/* Review Info */}
              <div className="bg-linear-to-br from-indigo-500 to-[#2E3192] p-4 rounded-xl border border-indigo-600 shadow-sm flex flex-col gap-3 text-white">
                 <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest border-b border-indigo-500/50 pb-2 flex justify-between">
                    Kết quả đánh giá
                    <span className="font-normal text-indigo-100 flex items-center gap-1 lowercase"><Calendar size={11}/> {review.reviewedAt ? format(new Date(review.reviewedAt), "dd/MM/yyyy") : "N/A"}</span>
                 </div>
                 <div className="flex items-start justify-between">
                   <div className="flex flex-col gap-2">
                      <div>
                        <span className="text-indigo-100 text-[13px]">Điểm & Xếp loại</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <div className="text-3xl font-black tracking-tight">{review.overallScore}</div>
                          <span className="text-lg font-medium text-white bg-white/20 px-2 py-0.5 rounded uppercase tracking-wide">
                              {review.overallScoreName || `Mức ${review.overallScore}`}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-indigo-200 text-[11px] uppercase">Mức thưởng</span>
                        <div className="text-base font-bold text-emerald-300">
                          {review.performanceAllowance != null 
                             ? formatVND(review.performanceAllowance)
                             : "Không có thưởng"}
                        </div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                       <div className="flex gap-1 bg-white/10 p-2 rounded-lg border border-white/20">
                          {Array.from({ length: 5 }).map((_, i) => (
                               <Star key={i} size={18} className={i < review.overallScore ? "fill-amber-400 text-amber-400" : "text-white/20"} />
                          ))}
                       </div>
                   </div>
                 </div>
                 {review.scoreCriteria && review.scoreCriteria.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-white/20">
                         <span className="text-indigo-200 text-[11px] uppercase mb-1 block">Tiêu chí đạt được (Lý do chọn)</span>
                         <ul className="list-disc pl-4 text-xs text-indigo-50 space-y-1.5 opacity-95">
                            {review.scoreCriteria.map((c) => <li key={c}>{c}</li>)}
                         </ul>
                     </div>
                 )}
                 {review.overallScore === 5 && review.performanceImprovementNote && (
                     <div className="mt-4 pt-4 border-t border-white/20">
                         <span className="text-amber-200 text-[11px] font-bold uppercase mb-1 flex items-center gap-1">
                             Ghi chú cải tiến/đổi mới
                         </span>
                         <div className="text-amber-50 text-[13px] bg-white/10 p-3 rounded-lg border border-white/10">
                            {review.performanceImprovementNote}
                         </div>
                     </div>
                 )}
              </div>
            </div>

            {/* Thong tin Reviewer */}
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center gap-3 text-[13px] text-slate-600">
               <span className="font-semibold text-slate-500 shrink-0">Người thực hiện đánh giá:</span>
               <span className="font-bold text-slate-800">{review.reviewerUsername || "—"}</span>
            </div>

            {/* Rich text inputs */}
            <div className="space-y-5">
                <div className="bg-white p-0 border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-700 text-[13px] tracking-wide">
                        Lý do chi tiết
                    </div>
                    <div className="p-4 prose prose-sm max-w-none prose-p:my-0 focus:outline-none">
                        {review.summary && review.summary !== "<p><br></p>" ? <RichTextViewer htmlContent={review.summary} /> : <span className="italic text-slate-400">Không có dữ liệu</span>}
                    </div>
                </div>
                
                <div className="bg-white p-0 border border-emerald-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-200 font-bold text-emerald-800 text-[13px] tracking-wide">
                        Điểm mạnh / Dẫn chứng nổi bật
                    </div>
                    <div className="p-4 prose prose-sm max-w-none prose-p:my-0 focus:outline-none text-emerald-950">
                        {review.strengths && review.strengths !== "<p><br></p>" ? <RichTextViewer htmlContent={review.strengths} /> : <span className="italic text-emerald-600/50">Không có dữ liệu</span>}
                    </div>
                </div>
                
                <div className="bg-white p-0 border border-amber-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 font-bold text-amber-800 text-[13px] tracking-wide">
                        Vấn đề cần cải thiện
                    </div>
                    <div className="p-4 prose prose-sm max-w-none prose-p:my-0 focus:outline-none text-amber-950">
                        {review.improvementAreas && review.improvementAreas !== "<p><br></p>" ? <RichTextViewer htmlContent={review.improvementAreas} /> : <span className="italic text-amber-600/50">Không có dữ liệu</span>}
                    </div>
                </div>
                
                <div className="bg-white p-0 border border-indigo-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-indigo-50 px-4 py-2.5 border-b border-indigo-200 font-bold text-indigo-800 text-[13px] tracking-wide">
                        Lời khuyên cải thiện
                    </div>
                    <div className="p-4 prose prose-sm max-w-none prose-p:my-0 focus:outline-none text-indigo-950">
                        {review.developmentPlan && review.developmentPlan !== "<p><br></p>" ? <RichTextViewer htmlContent={review.developmentPlan} /> : <span className="italic text-indigo-600/50">Không có dữ liệu</span>}
                    </div>
                </div>
            </div>
            
            <div className="text-[11px] text-center text-slate-400 font-medium pt-2">
                Bản ghi tạo lúc: {review.createdAt ? format(new Date(review.createdAt), "dd/MM/yyyy HH:mm:ss") : "--"}
                {review.updatedAt && ` · Cập nhật lúc: ${format(new Date(review.updatedAt), "dd/MM/yyyy HH:mm:ss")}`}
            </div>
          </div>
        )}

        <DialogFooter className="p-4 bg-white border-t border-slate-100 items-center justify-between shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div>
            {review && review.active !== false && (
              <Button onClick={handleDelete} variant="ghost" disabled={deleteMutation.isPending} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 h-9 gap-2">
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />} Khóa đánh giá
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)} className="px-8 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm border border-slate-200">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
