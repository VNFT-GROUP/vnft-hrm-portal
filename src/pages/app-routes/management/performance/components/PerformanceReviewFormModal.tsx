import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { performanceService } from "@/services/performance";
import type { PerformanceReviewLevelResponse } from "@/types/performance/PerformanceReviewLevelResponse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/custom/RichTextEditor";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { Loader2, CalendarIcon, Star, ClipboardCopy, CheckCircle2, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface PerformanceReviewFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  reviewYear: number;
  reviewMonth: number;
}

export default function PerformanceReviewFormModal({ isOpen, onOpenChange, userId, reviewYear, reviewMonth }: PerformanceReviewFormModalProps) {
  const queryClient = useQueryClient();

  const [overallScore, setOverallScore] = useState<number>(3);
  const [reviewedAt, setReviewedAt] = useState<Date | undefined>(new Date());
  
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  
  const [performanceDescriptions, setPerformanceDescriptions] = useState<Record<string, number[]>>({});
  const [performanceImprovementNote, setPerformanceImprovementNote] = useState("");

  const [isCopied, setIsCopied] = useState(false);

  // Levels data
  const { data: levelsResponse } = useQuery({
    queryKey: ['performance-review-levels'],
    queryFn: () => performanceService.getPerformanceReviewLevels(),
    enabled: isOpen
  });

  const levels = levelsResponse?.data || [];

  // Review Response
  const { data: reviewResponse, isLoading: isLoadingInitial } = useQuery({
    queryKey: ['performance-review', userId, reviewYear, reviewMonth],
    queryFn: () => performanceService.getPerformanceReviewByUserAndPeriod(userId!, reviewYear, reviewMonth),
    enabled: !!userId && isOpen,
  });

  const existingReview = reviewResponse?.data;
  const isEdit = !!existingReview;

  useEffect(() => {
    if (isOpen) {
      if (existingReview) {
        setTimeout(() => {
          setOverallScore(existingReview.overallScore);
          setReviewedAt(existingReview.reviewedAt ? new Date(existingReview.reviewedAt) : new Date());
          setSummary(existingReview.summary || "");
          setStrengths(existingReview.strengths || "");
          setImprovementAreas(existingReview.improvementAreas || "");
          setDevelopmentPlan(existingReview.developmentPlan || "");
          setPerformanceDescriptions(existingReview.performanceDescriptions || {});
          setPerformanceImprovementNote(existingReview.performanceImprovementNote || "");
        }, 0);
      } else {
        setTimeout(() => {
          setOverallScore(3);
          setReviewedAt(new Date());
          setSummary("");
          setStrengths("");
          setImprovementAreas("");
          setDevelopmentPlan("");
          setPerformanceDescriptions({});
          setPerformanceImprovementNote("");
        }, 0);
      }
    }
  }, [isOpen, existingReview]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        revieweeUserId: userId!,
        reviewYear,
        reviewMonth,
        overallScore,
        reviewedAt: reviewedAt ? format(reviewedAt, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        summary,
        strengths,
        improvementAreas,
        developmentPlan,
        performanceDescriptions,
        performanceImprovementNote: overallScore === 5 ? performanceImprovementNote : undefined
      };
      
      if (isEdit) {
        return performanceService.updatePerformanceReview(existingReview.id, payload);
      }
      return performanceService.createPerformanceReview(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Cập nhật đánh giá thành công" : "Tạo đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["performance-employees"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Lỗi khi lưu bảng đánh giá."));
    }
  });

  const onSubmit = () => {
    if (!reviewedAt) return toast.error("Vui lòng chọn ngày đánh giá");
    if (!overallScore) return toast.error("Vui lòng chọn điểm đánh giá");
    if (overallScore === 5 && !performanceImprovementNote.trim()) {
      return toast.error("Vui lòng nhập ghi chú cải tiến/đổi mới khi xếp loại xuất sắc (Điểm 5).");
    }
    
    mutation.mutate();
  };

  const selectedLevel = levels.find(l => l.score === overallScore);

  const handleDescriptionChange = (index: number, checked: boolean) => {
    const key = overallScore.toString();
    setPerformanceDescriptions(prev => {
      const arr = prev[key] || [];
      if (checked) return { ...prev, [key]: [...arr, index] };
      return { ...prev, [key]: arr.filter(x => x !== index) };
    });
  };

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
             Đánh giá cho kỳ {reviewMonth}/{reviewYear}. Vui lòng cung cấp chi tiết minh bạch các dẫn chứng.
          </DialogDescription>
        </DialogHeader>

        {isLoadingInitial && !!userId ? (
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
            <div className="grid grid-cols-1 gap-5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
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
            <div className="space-y-3">
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
                  <div className="mt-3 bg-white border border-[#2E3192]/20 shadow-sm p-5 rounded-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                     <div className="flex justify-between items-start flex-wrap gap-4 border-b border-indigo-500/10 pb-4">
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Xếp loại dự kiến</span>
                           <span className="font-bold text-[#1E2062] text-xl mt-0.5">{selectedLevel.name}</span>
                        </div>
                        <div className="flex flex-col text-right">
                           <span className="text-xs font-semibold text-emerald-600/70 uppercase tracking-widest">Mức thưởng công</span>
                           <span className="font-bold text-emerald-600 text-xl mt-0.5">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedLevel.allowance)}
                           </span>
                        </div>
                     </div>
                     <div className="pt-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3 block">Đánh giá tiêu chí (Chọn các mục đạt được)</span>
                        <div className="flex flex-col space-y-3 pl-1">
                           {selectedLevel.criteria?.map((c, i) => (
                             <div key={i} className="flex items-start space-x-3 group">
                               <Checkbox 
                                  id={`criteria-${selectedLevel.score}-${i}`}
                                  checked={(performanceDescriptions[overallScore.toString()] || []).includes(i)}
                                  onCheckedChange={(v) => handleDescriptionChange(i, !!v)}
                                  className="mt-0.5 data-[state=checked]:bg-[#2E3192] data-[state=checked]:border-[#2E3192]"
                               />
                               <label 
                                  htmlFor={`criteria-${selectedLevel.score}-${i}`}
                                  className="text-[13.5px] leading-relaxed text-slate-700 cursor-pointer select-none group-hover:text-indigo-900 transition-colors"
                               >
                                  {c}
                               </label>
                             </div>
                           ))}
                        </div>
                     </div>

                     {overallScore === 5 && (
                       <div className="mt-4 pt-4 border-t border-amber-200">
                          <Label className="text-[14px] font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                            <AlertCircle size={16} /> Ghi chú cải tiến/đổi mới (Bắt buộc cho Điểm 5) <span className="text-rose-500">*</span>
                          </Label>
                          <Textarea 
                            value={performanceImprovementNote} 
                            onChange={(e) => setPerformanceImprovementNote(e.target.value)}
                            placeholder="Nhập ghi chú hoặc mô tả giải pháp cải tiến quy trình hiệu quả rõ rệt mà nhân sự đã thực hiện..."
                            className="bg-amber-50/50 border-amber-200 focus-visible:ring-amber-500/30 text-sm h-20"
                          />
                       </div>
                     )}
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
