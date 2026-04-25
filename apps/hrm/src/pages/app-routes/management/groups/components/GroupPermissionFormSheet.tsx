import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    code: string;
    name: string;
    featureGroup?: string;
    description: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{ code: string; name: string; featureGroup?: string; description: string; }>>;
  onSave: () => void;
}

export default function GroupPermissionFormSheet({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
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
            {t('management.editPerm', { defaultValue: 'Cập nhật mã quyền' })}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2 group">
            <Label htmlFor="code" className="text-sm font-semibold text-foreground group-focus-within:text-[#2E3192] transition-colors flex items-center gap-1">
              {t('management.permCode', { defaultValue: 'Mã Quyền (Code)' })}
            </Label>
            <Input
              id="code"
              value={formData.code}
              readOnly
              disabled
              className="h-11 rounded-xl bg-slate-100 border-border text-slate-500 font-mono font-semibold"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground group-focus-within:text-[#2E3192] transition-colors flex items-center gap-1">
              {t('management.permName', { defaultValue: 'Tên Quyền' })} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Thêm nhân viên"
              className="h-11 rounded-xl bg-background border-border focus-visible:ring-[#2E3192] font-semibold"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="featureGroup" className="text-sm font-semibold text-foreground group-focus-within:text-[#2E3192] transition-colors">
              {t('management.permCategory', { defaultValue: 'Nhóm Tính Năng' })}
            </Label>
            <Input
              id="featureGroup"
              value={formData.featureGroup || ""}
              onChange={(e) => setFormData({ ...formData, featureGroup: e.target.value })}
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
            disabled={!formData.code.trim() || !formData.name.trim()}
          >
            {t('common.save', { defaultValue: 'Lưu Thông Tin' })}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
