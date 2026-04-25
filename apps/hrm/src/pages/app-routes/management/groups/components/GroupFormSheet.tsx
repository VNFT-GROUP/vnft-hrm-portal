import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useMemo } from "react";
import type { GroupPermissionResponse } from "@/types/group/GroupPermissionResponse";
import { useTranslation } from "react-i18next";

interface GroupFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; description: string; active: boolean; groupPermissionIds: string[] };
  setFormData: (data: { name: string; description: string; active: boolean; groupPermissionIds: string[] }) => void;
  isEditing: boolean;
  onSave: () => void;
  availablePermissions: GroupPermissionResponse[];
}

export default function GroupFormSheet({ isOpen, onOpenChange, formData, setFormData, isEditing, onSave, availablePermissions }: GroupFormSheetProps) {
  const { t } = useTranslation();
  
  const groupedPermissions = useMemo(() => {
    const map = new Map<string, GroupPermissionResponse[]>();
    availablePermissions.forEach(p => {
      const cat = p.featureGroup || "Cơ bản";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [availablePermissions]);
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[900px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <ShieldCheck size={18} />
              </span>
              {isEditing ? t("management.groupEditTitle", "Cập nhật Nhóm Quyền") : t("management.groupAddTitle", "Thêm Mới Nhóm Quyền")}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {isEditing ? t("management.groupEditDesc", "Chỉnh sửa thông tin chi tiết của nhóm quyền hiện tại trong hệ thống.") : t("management.groupAddDesc", "Nhập đầy đủ thông tin để tạo nhóm quyền mới.")}
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
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar relative">
          <div className="space-y-3 shrink-0">
            <Label htmlFor="name" className="text-sm font-semibold flex mb-1 text-foreground">
              {t("management.formNameRequired", "Tên Nhóm Quyền")} <span className="text-red-500 ml-1.5">*</span>
            </Label>
            <Input
              id="name"
              placeholder={t("management.formNamePlaceholder", "VD: Quản trị viên hệ thống")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded-xl focus-visible:ring-[#2E3192] bg-muted/50 focus:bg-card text-card-foreground text-base transition-colors"
            />
          </div>
          
          <div className="space-y-3 shrink-0">
            <Label htmlFor="description" className="text-sm font-semibold flex mb-1 text-foreground">{t("management.formSystemDesc", "Mô tả hệ thống")}</Label>
            <Textarea
              id="description"
              placeholder={t("management.formSystemDescPlaceholder", "Ghi chú về nhóm quyền này...")}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors resize-none"
            />
          </div>
          
          <div className="space-y-3 shrink-0">
            <Label className="text-sm font-semibold text-foreground">{t("management.formAssignPermissions", "Gán Quyền Thiết Lập")}</Label>
            <div className="border border-border rounded-xl p-4 space-y-5 bg-muted/30">
              {groupedPermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">{t("management.formNoPermissions", "Chưa có dữ liệu mã quyền nào.")}</p>
              ) : (
                groupedPermissions.map(([category, perms]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-sm font-bold text-[#1E2062] bg-[#2E3192]/5 px-3 py-1.5 rounded-md border-b-2 border-[#2E3192] uppercase">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                      {perms.map(p => (
                        <Label key={p.id} htmlFor={`perm-${p.id}`} className="flex items-center gap-3 p-3 hover:bg-card rounded-lg transition-colors border border-border/60 shadow-sm hover:border-[#2E3192]/50 hover:shadow-md cursor-pointer font-normal group/item bg-background">
                          <div className="flex flex-col justify-center flex-1 min-w-0">
                            <span className="text-[14px] font-bold text-[#1E2062] group-hover/item:text-[#2E3192] line-clamp-1" title={p.name || p.code}>
                              {p.name || p.code}
                            </span>
                            {p.description && (
                              <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5" title={p.description}>
                                {p.description}
                              </span>
                            )}
                          </div>
                          <Switch 
                            id={`perm-${p.id}`} 
                            checked={formData.groupPermissionIds.includes(p.id)}
                            onCheckedChange={(checked) => {
                              const current = new Set(formData.groupPermissionIds);
                              if (checked) current.add(p.id);
                              else current.delete(p.id);
                              setFormData({ ...formData, groupPermissionIds: Array.from(current) });
                            }}
                            className="data-[state=checked]:bg-[#2E3192]"
                          />
                        </Label>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1E2062]/5 border border-[#1E2062]/10 relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(c) => setFormData({ ...formData, active: c })}
              className="data-[state=checked]:bg-[#2E3192] shadow-inner mt-0.5"
            />
            <div className="space-y-1.5">
              <Label htmlFor="active" className="cursor-pointer font-bold text-[#1E2062]">{t("management.formStatusActive", "Trạng thái hoạt động")}</Label>
              <p className="text-[13px] text-muted-foreground leading-snug">
                {t("management.formStatusActiveHint", "Chỉ nhóm quyền ở trạng thái Hoạt động mới có thể gán cho user.")}
              </p>
            </div>
          </div>
          </div>
          
          <div className="p-6 border-t border-border bg-muted/30 flex gap-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl text-base font-semibold border-border hover:bg-card shadow-sm hover:shadow-md transition-all" onClick={() => onOpenChange(false)}>
              {t("management.formCancel", "Hủy bỏ")}
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white text-base font-bold shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0" disabled={!formData.name.trim()}>
              {isEditing ? t("management.formSaveChange", "Lưu thay đổi") : t("management.formSaveNew", "Lưu nhóm quyền")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
