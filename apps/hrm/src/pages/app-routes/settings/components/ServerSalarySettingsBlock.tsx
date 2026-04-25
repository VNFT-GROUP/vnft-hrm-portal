import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { DollarSign, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { settingsService } from "@/services/settings";
import type { ServerSettingsResponse } from "@/types/server-settings/ServerSettingsResponse";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function ServerSalarySettingsBlock() {
  const [settings, setSettings] = useState<ServerSettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      let responseData = null;
      try {
        const res = await settingsService.getServerSettings();
        responseData = res.data;
      } catch {
        toast.error("Lỗi khi tải cấu hình máy chủ");
        setIsLoading(false);
      }
      setIsLoading(false);
      
      if (responseData) {
        setSettings(responseData);
      }
    };
    fetchSettings();
  }, []);



  const handleChange = (key: keyof ServerSettingsResponse, value: string | number | boolean) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      const reqPayload: Partial<ServerSettingsResponse> = {
        salaryPersonalDeduction: Number(settings.salaryPersonalDeduction),
        salaryDependentTaxDeductionAmount: Number(settings.salaryDependentTaxDeductionAmount),
        salaryCompanySocialInsuranceRate: Number(settings.salaryCompanySocialInsuranceRate),
        salaryCompanyHealthInsuranceRate: Number(settings.salaryCompanyHealthInsuranceRate),
        salaryCompanyUnemploymentInsuranceRate: Number(settings.salaryCompanyUnemploymentInsuranceRate),
        salaryEmployeeSocialInsuranceRate: Number(settings.salaryEmployeeSocialInsuranceRate),
        salaryEmployeeHealthInsuranceRate: Number(settings.salaryEmployeeHealthInsuranceRate),
        salaryEmployeeUnemploymentInsuranceRate: Number(settings.salaryEmployeeUnemploymentInsuranceRate),
        salaryConfidentialSalaryNote: settings.salaryConfidentialSalaryNote,
      };
      await settingsService.updateServerSettings(reqPayload);
      toast.success("Cập nhật thông tin cấu hình lương thành công");
      setIsSaving(false);
    } catch {
      toast.error("Lỗi khi lưu cấu hình");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex items-center justify-center min-h-[300px]">
        <span className="text-muted-foreground animate-pulse font-medium">Đang tải cấu hình lương...</span>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <m.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#1E2062]">Cấu hình Lương & Thuế</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#2E3192] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1E2062] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mức giảm trừ gia cảnh */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-[#1E2062]">Giảm trừ gia cảnh</h3>
              <p className="text-sm text-muted-foreground">Mức tiền miễn thuế áp dụng khi tính thuế TNCN</p>
            </div>
            
            <div className="flex flex-col gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
              <div className="flex flex-col gap-2">
                <Label>Giảm trừ bản thân (VND)</Label>
                <Input
                  type="number"
                  value={settings.salaryPersonalDeduction}
                  onChange={(e) => handleChange("salaryPersonalDeduction", e.target.value)}
                  className="bg-background max-w-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Giảm trừ người phụ thuộc (VND/người)</Label>
                <Input
                  type="number"
                  value={settings.salaryDependentTaxDeductionAmount}
                  onChange={(e) => handleChange("salaryDependentTaxDeductionAmount", e.target.value)}
                  className="bg-background max-w-sm"
                />
              </div>
            </div>
          </div>

          {/* Tỷ lệ đóng BH */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-[#1E2062]">Tỷ lệ trích nộp bảo hiểm</h3>
              <p className="text-sm text-muted-foreground">Tỷ lệ nộp vào quỹ BHXH, BHYT, BHTN theo quy định</p>
            </div>
            
            <div className="flex flex-col gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                <span className="text-sm font-semibold text-muted-foreground">Loại quỹ</span>
                <span className="text-sm font-semibold text-center text-emerald-600">Công ty</span>
                <span className="text-sm font-semibold text-center text-rose-600">Nhân viên</span>
              </div>
              
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                <Label>BH Xã hội (XH)</Label>
                <Input type="number" step="0.001" value={settings.salaryCompanySocialInsuranceRate} onChange={(e) => handleChange("salaryCompanySocialInsuranceRate", e.target.value)} className="bg-background text-center px-2" />
                <Input type="number" step="0.001" value={settings.salaryEmployeeSocialInsuranceRate} onChange={(e) => handleChange("salaryEmployeeSocialInsuranceRate", e.target.value)} className="bg-background text-center px-2" />
              </div>
              
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                <Label>BH Y tế (YT)</Label>
                <Input type="number" step="0.001" value={settings.salaryCompanyHealthInsuranceRate} onChange={(e) => handleChange("salaryCompanyHealthInsuranceRate", e.target.value)} className="bg-background text-center px-2" />
                <Input type="number" step="0.001" value={settings.salaryEmployeeHealthInsuranceRate} onChange={(e) => handleChange("salaryEmployeeHealthInsuranceRate", e.target.value)} className="bg-background text-center px-2" />
              </div>
              
              <div className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                <Label>BH Thất nghiệp (TN)</Label>
                <Input type="number" step="0.001" value={settings.salaryCompanyUnemploymentInsuranceRate} onChange={(e) => handleChange("salaryCompanyUnemploymentInsuranceRate", e.target.value)} className="bg-background text-center px-2" />
                <Input type="number" step="0.001" value={settings.salaryEmployeeUnemploymentInsuranceRate} onChange={(e) => handleChange("salaryEmployeeUnemploymentInsuranceRate", e.target.value)} className="bg-background text-center px-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Thông báo phiếu lương */}
        <div className="flex flex-col gap-4 border-t border-border/50 pt-6 mt-2">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-[#1E2062]">Ghi chú bảo mật phiếu lương</h3>
            <p className="text-sm text-muted-foreground">Thông điệp này sẽ được đính kèm ở dưới cùng mỗi phiếu lương (Payslip) khi gửi cho nhân viên.</p>
          </div>
          <Textarea 
            value={settings.salaryConfidentialSalaryNote || ""}
            onChange={(e) => handleChange("salaryConfidentialSalaryNote", e.target.value)}
            className="min-h-[100px] resize-y bg-background font-medium"
            placeholder="Nhập ghi chú bảo mật phiếu lương..."
          />
        </div>
      </div>
    </m.section>
  );
}
