import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface RoleFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; description: string; active: boolean };
  setFormData: (data: { name: string; description: string; active: boolean }) => void;
  isEditing: boolean;
  onSave: () => void;
}

export default function RoleFormSheet({ isOpen, onOpenChange, formData, setFormData, isEditing, onSave }: RoleFormSheetProps) {
  const { t } = useTranslation();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <Layers size={18} />
              </span>
              {isEditing ? t('management.editRole', { defaultValue: 'Cập nhật Vai Trò' }) : t('management.addNewRole', { defaultValue: 'Thêm Mới Vai Trò' })}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {isEditing 
                 ? t('management.editRoleDesc', { defaultValue: 'Chỉnh sửa thông tin chi tiết của vai trò hiện tại.' }) 
                 : t('management.addNewRoleDesc', { defaultValue: 'Nhập đầy đủ thông tin để tạo master-data vai trò mới.' })}
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (formData.name.trim()) {
            try {
              onSave();
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
              {t('management.colRoleName', { defaultValue: 'Tên Vai Trò' })} <span className="text-rose-500">*</span>
            </Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="VD: Quản lý chi nhánh, Trưởng phòng..." 
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="desc" className="text-sm font-semibold text-foreground">{t('management.colDesc', { defaultValue: 'Mô tả chi tiết' })}</Label>
            <Textarea 
              id="desc" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Nhập mô tả cho vai trò..." 
              rows={5}
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-foreground text-sm font-semibold block">{t('management.colStatus', { defaultValue: 'Trạng thái hoạt động' })}</Label>
              <p className="text-xs text-muted-foreground">{t('management.statusRoleHint', { defaultValue: 'Chỉ vai trò ở trạng thái Hoạt động mới có thể sử dụng.' })}</p>
            </div>
            <Switch 
              checked={formData.active} 
              onCheckedChange={checked => setFormData({...formData, active: checked})} 
            />
          </div>
          </div>
          
          <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
              Hủy bỏ
            </Button>
            <Button type="submit" className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.name.trim()}>
              {isEditing ? "Lưu thay đổi" : "Lưu vai trò"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
