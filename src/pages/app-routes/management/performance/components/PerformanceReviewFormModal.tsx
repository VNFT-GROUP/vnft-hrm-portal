import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { performanceService } from "@/services/performance";
import { userService } from "@/services/user/userService";
import type { UserResponse } from "@/types/user/UserResponse";
import type { PerformanceReviewLevelResponse } from "@/types/performance/PerformanceReviewLevelResponse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/custom/RichTextEditor";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { Loader2, CalendarIcon, Star, ClipboardCopy, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PerformanceReviewFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialId?: string | null;
}

export default function PerformanceReviewFormModal({ isOpen, onOpenChange, initialId }: PerformanceReviewFormModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!initialId;

  const [revieweeUserId, setRevieweeUserId] = useState<string>("");
  const [reviewYear, setReviewYear] = useState<string>(new Date().getFullYear().toString());
  const [reviewMonth, setReviewMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [overallScore, setOverallScore] = useState<number>(3);
  const [reviewedAt, setReviewedAt] = useState<Date | undefined>(new Date());
  
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  
  const [isCopied, setIsCopied] = useState(false);

  // Users data
  const { data: usersResponse } = useQuery({
    queryKey: ['users', 1, 1000],
    queryFn: () => userService.getUsers(1, 1000),
    enabled: isOpen
  });

  // Levels data
  const { data: levelsResponse } = useQuery({
    queryKey: ['performance-review-levels'],
    queryFn: () => performanceService.getPerformanceReviewLevels(),
    enabled: isOpen
  });

  const levels = levelsResponse?.data || [];

  const { data: initialResponse, isLoading: isLoadingInitial } = useQuery({
    queryKey: ['performance-review', initialId],
    queryFn: () => performanceService.getPerformanceReviewById(initialId!),
    enabled: isEdit && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialResponse?.data) {
        const data = initialResponse.data;
        setTimeout(() => {
          setRevieweeUserId(data.revieweeUserId || "");
          setReviewYear(data.reviewYear.toString());
          setReviewMonth(data.reviewMonth.toString());
          setOverallScore(data.overallScore);
          setReviewedAt(data.reviewedAt ? new Date(data.reviewedAt) : new Date());
          setSummary(data.summary || "");
          setStrengths(data.strengths || "");
          setImprovementAreas(data.improvementAreas || "");
          setDevelopmentPlan(data.developmentPlan || "");
        }, 0);
      } else if (!isEdit) {
        setTimeout(() => {
          setRevieweeUserId("");
          setReviewYear(new Date().getFullYear().toString());
          setReviewMonth((new Date().getMonth() + 1).toString());
          setOverallScore(3);
          setReviewedAt(new Date());
          setSummary("");
          setStrengths("");
          setImprovementAreas("");
          setDevelopmentPlan("");
        }, 0);
      }
    }
  }, [isOpen, initialResponse, isEdit]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        revieweeUserId,
        reviewYear: parseInt(reviewYear),
        reviewMonth: parseInt(reviewMonth),
        overallScore,
        reviewedAt: reviewedAt ? format(reviewedAt, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        summary,
        strengths,
        improvementAreas,
        developmentPlan
      };
      
      if (isEdit) {
        return performanceService.updatePerformanceReview(initialId!, payload);
      }
      return performanceService.createPerformanceReview(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Cập nhật đánh giá thành công" : "Tạo đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["performance-reviews"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Lỗi khi lưu bảng đánh giá."));
    }
  });

  const onSubmit = () => {
    if (!revieweeUserId) return toast.error("Vui lòng chọn nhân sự");
    if (!reviewYear || !reviewMonth) return toast.error("Vui lòng chọn kỳ đánh giá");
    if (!reviewedAt) return toast.error("Vui lòng chọn ngày đánh giá");
    if (!overallScore) return toast.error("Vui lòng chọn điểm đánh giá");
    
    mutation.mutate();
  };

  const users = usersResponse?.data?.content || [];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const selectedLevel = levels.find(l => l.score === overallScore);

  const copyPromptHelper = () => {
     const promptText = `Chấm điểm hiệu suất cho nhân viên dựa trên thang điểm 1-5 đã định nghĩa. Dựa trên nội dung đánh giá sau, hãy đưa ra: Điểm & Xếp loại, Mức thưởng, Lý do chi tiết và Lời khuyên cải thiện. Nội dung đánh giá: \n`;
     navigator.clipboard.writeText(promptText);
     setIsCopied(true);
     toast.success("Đã copy Prompt gợi ý");
     setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-w-[95vw] lg:max-w-[850px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50 border-none rounded-xl">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
             <div className="bg-[#2E3192]/10 p-1.5 rounded-lg text-[#2E3192]"><Star size={18} /></div>
             {isEdit ? "Cập nhật đánh giá hiệu suất" : "Tạo đánh giá hiệu suất mới"}
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
             Vui lòng cung cấp chi tiết minh bạch các dẫn chứng để người lao động nắm bắt, đồng thời AI có thêm cơ sở dữ liệu huấn luyện.
          </DialogDescription>
        </DialogHeader>

        {isLoadingInitial && isEdit ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E3192]" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            
            {/* AI Prompter */}
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl shadow-sm text-sm flex flex-col gap-2">
               <div className="font-semibold text-indigo-900 flex items-center gap-2">✨ Prompt gợi ý phân tích (AI Assistant)</div>
               <p className="text-indigo-800/80 italic text-[13px] leading-relaxed">
                 "Chấm điểm hiệu suất cho nhân viên dựa trên thang điểm 1-5 đã định nghĩa. Dựa trên nội dung đánh giá sau, hãy đưa ra: Điểm & Xếp loại, Mức thưởng, Lý do chi tiết và Lời khuyên cải thiện. Nội dung đánh giá: ..."
               </p>
               <Button variant="outline" size="sm" onClick={copyPromptHelper} className="self-start mt-1 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  {isCopied ? <CheckCircle2 size={14} className="mr-2 text-emerald-500" /> : <ClipboardCopy size={14} className="mr-2" />} 
                  {isCopied ? "Đã copy" : "Copy Prompt"}
               </Button>
            </div>

            {/* Base Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[13px] font-semibold text-slate-700">Nhân sự được đánh giá <span className="text-rose-500">*</span></Label>
                <Select value={revieweeUserId} onValueChange={(v) => v && setRevieweeUserId(v)} disabled={isEdit}>
                  <SelectTrigger className="w-full bg-slate-50/50 min-h-[44px]">
                    <SelectValue placeholder="Chọn nhân sự..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u: UserResponse) => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex flex-col text-left py-1">
                          <span className="font-semibold text-slate-800">{u.fullName || u.englishName || u.username} ({u.employeeCode})</span>
                          {(u.departmentName || u.jobTitleName) && (
                            <span className="text-xs text-slate-500 mt-0.5">{u.departmentName} - {u.jobTitleName}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-slate-700">Kỳ đánh giá <span className="text-rose-500">*</span></Label>
                <div className="flex gap-2">
                    <Select value={reviewMonth} onValueChange={(v) => v && setReviewMonth(v)}>
                        <SelectTrigger className="flex-1 bg-slate-50/50">
                            <SelectValue placeholder="Tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={reviewYear} onValueChange={(v) => v && setReviewYear(v)}>
                        <SelectTrigger className="flex-1 bg-slate-50/50">
                            <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y.toString()}>Năm {y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-slate-700">Ngày đánh giá <span className="text-rose-500">*</span></Label>
                <Popover>
                  <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-3 text-[13px]", !reviewedAt && "text-slate-400")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {reviewedAt ? format(reviewedAt, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={reviewedAt} onSelect={(d) => d && setReviewedAt(d)} initialFocus locale={vi} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Score Selector */}
            <div className="space-y-2">
               <Label className="text-[14px] font-bold text-[#1E2062] flex gap-2"><Star size={16} /> Chọn thang điểm xếp loại <span className="text-rose-500">*</span></Label>
               {levels.length === 0 ? (
                  <div className="text-sm text-slate-500 italic p-4 bg-slate-100 rounded-lg border border-slate-200 border-dashed text-center">
                    Không tìm thấy dữ liệu thang điểm (Levels) từ hệ thống. Tham khảo quản trị viên.
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {levels.map((lvl: PerformanceReviewLevelResponse) => (
                      <div 
                        key={lvl.score}
                        onClick={() => setOverallScore(lvl.score)}
                        className={cn(
                          "cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all bg-white relative overflow-hidden",
                          overallScore === lvl.score ? "border-[#2E3192] ring-1 ring-[#2E3192] shadow-md bg-indigo-50/30" : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                        )}
                      >
                         <div className={cn(
                           "text-2xl font-black mb-1",
                           overallScore === lvl.score ? "text-[#2E3192]" : "text-slate-400"
                         )}>
                            {lvl.score}
                         </div>
                         <div className={cn("text-xs font-bold leading-tight mb-2 uppercase", overallScore === lvl.score ? "text-indigo-700" : "text-slate-600")}>
                            {lvl.name}
                         </div>
                         {overallScore === lvl.score && (
                           <div className="absolute top-1 right-1 bg-[#2E3192] text-white rounded-full p-0.5">
                              <CheckCircle2 size={12} />
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
               )}

               {/* Score Info Panel */}
               {selectedLevel && (
                  <div className="mt-3 bg-[#2E3192]/5 border border-[#2E3192]/20 p-4 rounded-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                     <div className="flex justify-between items-start flex-wrap gap-4 border-b border-indigo-500/10 pb-3">
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Xếp loại dự kiến</span>
                           <span className="font-bold text-[#1E2062] text-lg mt-0.5">{selectedLevel.name}</span>
                        </div>
                        <div className="flex flex-col text-right">
                           <span className="text-xs font-semibold text-emerald-600/70 uppercase tracking-widest">Mức thưởng công</span>
                           <span className="font-bold text-emerald-600 text-lg mt-0.5">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedLevel.allowance)}
                           </span>
                        </div>
                     </div>
                     <div className="pt-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Tiêu chí (Criteria)</span>
                        <ul className="list-disc pl-5 text-[13px] text-slate-700 space-y-1">
                           {selectedLevel.criteria?.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                     </div>
                  </div>
               )}
            </div>

            {/* Rich text inputs mapped to correct backend fields */}
            <div className="space-y-6">
                <div className="space-y-1.5 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                    <Label className="text-[14px] font-bold text-slate-800">Lý do chi tiết</Label>
                    <RichTextEditor value={summary} onChange={setSummary} placeholder="Phân tích tổng quan và lý do đưa ra mức điểm này..." />
                </div>
                
                <div className="space-y-1.5 bg-emerald-50/30 p-4 border border-emerald-100 rounded-xl shadow-sm">
                    <Label className="text-[14px] font-bold text-emerald-800">Điểm mạnh / Dẫn chứng nổi bật</Label>
                    <RichTextEditor value={strengths} onChange={setStrengths} placeholder="Liệt kê bằng chứng KPIs hoặc thành tích cụ thể (Strengths)..." />
                </div>
                
                <div className="space-y-1.5 bg-amber-50/30 p-4 border border-amber-100 rounded-xl shadow-sm">
                    <Label className="text-[14px] font-bold text-amber-800">Vấn đề cần cải thiện</Label>
                    <RichTextEditor value={improvementAreas} onChange={setImprovementAreas} placeholder="Đưa ra những mặt hạn chế cần khắc phục (Improvement Areas)..." />
                </div>
                
                <div className="space-y-1.5 bg-indigo-50/30 p-4 border border-indigo-100 rounded-xl shadow-sm">
                    <Label className="text-[14px] font-bold text-indigo-800">Lời khuyên cải thiện</Label>
                    <RichTextEditor value={developmentPlan} onChange={setDevelopmentPlan} placeholder="Lời khuyên, mục tiêu cụ thể, khóa học đề xuất (Development Plan)..." />
                </div>
            </div>
          </div>
        )}

        <DialogFooter className="p-4 bg-white border-t border-slate-100 sm:justify-end shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-10 border-slate-200 text-slate-600 hover:text-slate-800">
            Hủy
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={mutation.isPending || (isEdit && isLoadingInitial)}
            className="px-8 h-10 bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 font-semibold"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Lưu thay đổi" : "Lưu đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
