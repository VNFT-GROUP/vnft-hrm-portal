import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, formatCurrency } from "@/lib/utils";
import { useCreateSalesKpiReview, useUpdateSalesKpiReview, useSalesKpiCandidates } from "@/pages/app-routes/management/performance/hooks/useSalesKpiReviews";
import { salesKpiReviewService } from "@/services/salesKpiReviewService";
import { useQuery } from "@tanstack/react-query";

interface SalesKpiReviewFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  reviewYear: number;
  reviewMonth: number;
  existingReviewId?: string | null;
}

export default function SalesKpiReviewFormModal({
  isOpen, onOpenChange, userId, reviewYear, reviewMonth, existingReviewId,
}: SalesKpiReviewFormModalProps) {
  const [newCustomerCount, setNewCustomerCount] = useState(0);
  const [reportScore, setReportScore] = useState(0);
  const [customerMeetingScore, setCustomerMeetingScore] = useState(0);
  const [note, setNote] = useState("");

  // Load existing review data if editing
  const { data: existingReview, isLoading: isLoadingExisting } = useQuery({
    queryKey: ["sales-kpi-review-detail", existingReviewId],
    queryFn: () => salesKpiReviewService.getById(existingReviewId!),
    enabled: !!existingReviewId && isOpen,
  });

  const isEdit = !!existingReview;

  // Load candidate data if creating new
  const { data: candidates, isLoading: isLoadingCandidates } = useSalesKpiCandidates(
    { reviewYear, reviewMonth },
    !existingReviewId && isOpen && !!userId
  );
  
  const candidate = candidates?.find(c => c.userId === userId);
  const displayData = existingReview ?? candidate;
  
  const isLoading = (isLoadingExisting && !!existingReviewId) || (isLoadingCandidates && !existingReviewId);

  useEffect(() => {
    if (!isOpen) return;
    if (existingReview) {
      setNewCustomerCount(existingReview.newCustomerCount ?? 0);
      setReportScore(existingReview.reportScore ?? 0);
      setCustomerMeetingScore(existingReview.customerMeetingScore ?? 0);
      setNote(existingReview.note ?? "");
    } else {
      setNewCustomerCount(0);
      setReportScore(0);
      setCustomerMeetingScore(0);
      setNote("");
    }
  }, [isOpen, existingReview]);

  const createMutation = useCreateSalesKpiReview();
  const updateMutation = useUpdateSalesKpiReview();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = () => {
    if (!userId) return;
    const payload = {
      userId,
      reviewYear,
      reviewMonth,
      newCustomerCount,
      reportScore,
      customerMeetingScore,
      note: note.trim() || undefined,
    };

    if (isEdit && existingReviewId) {
      updateMutation.mutate(
        { id: existingReviewId, payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật KPI thành công");
            onOpenChange(false);
          },
          onError: (e) => toast.error(getErrorMessage(e, "Lỗi cập nhật KPI")),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Tạo đánh giá KPI thành công");
          onOpenChange(false);
        },
        onError: (e) => toast.error(getErrorMessage(e, "Lỗi tạo đánh giá KPI")),
      });
    }
  };

  const readonlyField = (label: string, value: string | number | null | undefined, suffix?: string) => (
    <div className="flex items-center justify-between py-2.5 px-3.5 bg-slate-50/80 rounded-lg border border-slate-100">
      <span className="text-[13px] text-slate-500 font-medium">{label}</span>
      <span className="text-[13px] font-bold text-slate-800">
        {value != null ? `${value}${suffix ?? ""}` : "—"}
      </span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50 border-none rounded-xl">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-600"><TrendingUp size={18} /></div>
            {isEdit ? "Cập nhật KPI Sales" : "Đánh giá KPI Sales"}
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Đánh giá KPI cho kỳ {reviewMonth}/{reviewYear}. Dữ liệu doanh số được tính từ Profit Report.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !!userId ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar">

            {/* Readonly summary from backend */}
            {displayData && (
              <div className="space-y-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng hợp từ Profit Report (Chỉ đọc)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {readonlyField("Target", formatCurrency(displayData.targetAmount))}
                  {readonlyField("Doanh thu", formatCurrency(displayData.revenueAmount))}
                  {readonlyField("Lợi nhuận", formatCurrency(displayData.profitAmount))}
                  {readonlyField("Biên độ LN", displayData.profitMarginPercent, "%")}
                  {readonlyField("Đạt target", displayData.targetAchievementPercent, "%")}
                  {readonlyField("Điểm doanh số", displayData.salesScore)}
                </div>
              </div>
            )}

            {/* Editable fields */}
            <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá bổ sung</Label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">Khách hàng mới</Label>
                  <Input
                    type="number" min={0}
                    value={newCustomerCount}
                    onChange={(e) => setNewCustomerCount(Number(e.target.value))}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">Điểm báo cáo</Label>
                  <Input
                    type="number" min={0}
                    value={reportScore}
                    onChange={(e) => setReportScore(Number(e.target.value))}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">Điểm gặp KH</Label>
                  <Input
                    type="number" min={0}
                    value={customerMeetingScore}
                    onChange={(e) => setCustomerMeetingScore(Number(e.target.value))}
                    className="h-10 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-slate-700">Ghi chú</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhận xét, ghi chú thêm..."
                  className="h-20 rounded-lg"
                />
              </div>
            </div>

            {/* Readonly KPI total (Live Preview) */}
            {displayData && (() => {
              const liveKpiScore = (displayData.salesScore ?? 0) + (newCustomerCount * 5) + reportScore + customerMeetingScore;
              
              let liveRatingName = "Không đạt";
              if (displayData.functionType === "MARKETING") {
                if (liveKpiScore >= 515) liveRatingName = "Xuất sắc";
                else if (liveKpiScore >= 310) liveRatingName = "Tốt";
                else if (liveKpiScore >= 110) liveRatingName = "Đạt";
                else if (liveKpiScore >= 75) liveRatingName = "Chưa ổn định";
              } else {
                // SALES
                if (liveKpiScore >= 315) liveRatingName = "Xuất sắc";
                else if (liveKpiScore >= 210) liveRatingName = "Tốt";
                else if (liveKpiScore >= 110) liveRatingName = "Đạt";
                else if (liveKpiScore >= 75) liveRatingName = "Chưa ổn định";
              }

              return (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Điểm KPI tổng (Tạm tính)</span>
                    <span className="text-2xl font-black text-emerald-700 mt-0.5">{liveKpiScore}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-lg text-sm font-bold text-emerald-800">
                    {liveRatingName}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <DialogFooter className="p-5 md:p-6 bg-white border-t border-slate-100 flex sm:justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-10 border-slate-200 text-slate-600">
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending}
            className="px-8 h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Lưu thay đổi" : "Lưu đánh giá KPI"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
