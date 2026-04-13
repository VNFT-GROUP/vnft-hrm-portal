import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { code: string; category?: string; description: string; active: boolean };
  setFormData: React.Dispatch<React.SetStateAction<{ code: string; category?: string; description: string; active: boolean }>>;
  isEditing: boolean;
  onSave: () => void;
}

export default function GroupPermissionFormSheet({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  isEditing,
  onSave,
}: Props) {
  const { t } = useTranslation();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l-0 shadow-2xl flex flex-col h-full bg-background p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/30">
          <SheetTitle className="text-[#1E2062] flex items-center gap-2 text-xl font-bold">
            <div className="p-2 bg-[#2E3192]/10 rounded-lg">
              <Shield size={20} className="text-[#2E3192]" />
            </div>
            {isEditing 
              ? t('management.editPerm', { defaultValue: 'Cập nhật mã quyền' }) 
              : t('management.createPerm', { defaultValue: 'Thêm mới mã quyền' })
            }
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2 group">
            <Label htmlFor="code" className="text-sm font-semibold text-foreground group-focus-within:text-[#2E3192] transition-colors flex items-center gap-1">
              {t('management.permCode', { defaultValue: 'Mã Quyền' })} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: READ_USER, WRITE_POST..."
              className="h-11 rounded-xl bg-background border-border focus-visible:ring-[#2E3192] font-semibold"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="category" className="text-sm font-semibold text-foreground group-focus-within:text-[#2E3192] transition-colors">
              {t('management.permCategory', { defaultValue: 'Nhóm Tính Năng' })}
            </Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="VD: Nhóm người dùng, Quản lý..."
              className="h-11 rounded-xl bg-background border-border focus-visible:ring-[#2E3192]"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground group-focus-within:text-[#2E3192] transition-colors">
              {t('management.description', { defaultValue: 'Mô Tả' })}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chi tiết chức năng..."
              className="resize-none h-28 rounded-xl bg-background border-border focus-visible:ring-[#2E3192]"
            />
          </div>

          <div className="flex flex-row items-center justify-between p-4 rounded-xl border border-border bg-muted/40 mt-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-foreground">
                {t('management.status', { defaultValue: 'Trạng Thái Hoạt Động' })}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('management.statusDesc', { defaultValue: 'Mã quyền có thể sử dụng.' })}
              </p>
            </div>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              className="data-[state=checked]:bg-[#2E3192]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-11 px-6 font-semibold"
          >
            {t('common.cancel', { defaultValue: 'Hủy bỏ' })}
          </Button>
          <Button
            className="bg-[#2E3192] hover:bg-[#1E2062] rounded-xl h-11 px-8 text-white shadow-md shadow-[#2E3192]/20 font-semibold"
            onClick={onSave}
            disabled={!formData.code.trim()}
          >
            {t('common.save', { defaultValue: 'Lưu Thông Tin' })}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
