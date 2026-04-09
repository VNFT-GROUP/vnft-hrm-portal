import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface PositionFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; description: string; active: boolean; manager: boolean };
  setFormData: (data: { name: string; description: string; active: boolean; manager: boolean }) => void;
  isEditing: boolean;
  onSave: () => void;
}

export default function PositionFormSheet({ isOpen, onOpenChange, formData, setFormData, isEditing, onSave }: PositionFormSheetProps) {
  const { t } = useTranslation();
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <Briefcase size={18} />
              </span>
              {isEditing ? t("position.form.updateTitle") : t("position.form.addTitle")}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {isEditing ? t("position.form.updateSubtitle") : t("position.form.addSubtitle")}
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (formData.name.trim()) {
            try {
              onSave();
              toast.success("Thành công!", {
                description: isEditing ? "Thay đổi chức vụ đã được lưu thành công." : "Chức vụ mới đã được thêm vào hệ thống."
              });
            } catch {
              toast.error("Có lỗi xảy ra", {
                description: "Không thể lưu dữ liệu, vui lòng thử lại sau."
              });
            }
          } 
        }} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              {t("position.form.nameLabel")} <span className="text-rose-500">*</span>
            </Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder={t("position.form.namePlaceholder")} 
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="desc" className="text-sm font-semibold text-foreground">{t("position.form.descLabel")}</Label>
            <Textarea 
              id="desc" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder={t("position.form.descPlaceholder")} 
              rows={5}
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-foreground text-sm font-semibold block">{t("position.form.managerLabel")}</Label>
              <p className="text-xs text-muted-foreground">{t("position.form.managerDesc")}</p>
            </div>
            <Switch 
              checked={formData.manager} 
              onCheckedChange={checked => setFormData({...formData, manager: checked})} 
            />
          </div>
          
          <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-foreground text-sm font-semibold block">{t("position.form.statusLabel")}</Label>
              <p className="text-xs text-muted-foreground">{t("position.form.statusDesc")}</p>
            </div>
            <Switch 
              checked={formData.active} 
              onCheckedChange={checked => setFormData({...formData, active: checked})} 
            />
          </div>
          </div>
          
          <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
              {t("position.form.cancel")}
            </Button>
            <Button type="submit" className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.name.trim()}>
              {isEditing ? t("position.form.saveChanges") : t("position.form.saveBtn")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
