import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { DepartmentResponse } from '@/types/department/DepartmentResponse';

interface DepartmentFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; description: string; active: boolean; parentDepartmentId: string | null };
  setFormData: (data: {
    name: string;
    description: string;
    active: boolean;
    parentDepartmentId: string | null;
  }) => void;
  isEditing: boolean;
  onSave: () => void;
  departments: DepartmentResponse[];
  editingDeptId: string | null;
}

export default function DepartmentFormSheet({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  isEditing,
  onSave,
  departments,
  editingDeptId
}: DepartmentFormSheetProps) {
  const { t } = useTranslation();

  // Build options: exclude the currently editing dept AND its children to prevent cyclic relationships.
  // Actually, a simple exclusion: don't allow selecting yourself as your own parent.
  // Better yet, don't allow selecting any descendants. The exact validation is handled by backend,
  // but frontend should at least disable or hide the current dept.
  const parentOptions = departments.filter(d => d.id !== editingDeptId);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] w-full border-l border-slate-200 shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-slate-50/80">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-2 bg-[#2E3192]/10 text-[#2E3192] rounded-lg">
                <Building2 size={20} />
              </span>
              {isEditing
                ? t("department.form.updateTitle", { defaultValue: "Cập nhật phòng ban" })
                : t("department.form.addTitle", { defaultValue: "Thêm mới phòng ban" })}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground mt-2">
              {t("department.form.subtitle", { defaultValue: "Cấu hình thông tin và nhánh cây tổ chức." })}
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formData.name.trim()) {
              try {
                onSave();
              } catch {
                // Let the mutation error handler handle it natively if possible
              }
            }
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  {t("department.form.nameLabel", { defaultValue: "Tên phòng ban" })} <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("department.form.namePlaceholder", { defaultValue: "VD: Khối Kỹ Thuật" })}
                  className="rounded-xl border-slate-200 focus-visible:ring-[#2E3192]/20 h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="parentId"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Phòng ban cha (Cấp trên)
                </Label>
                <Select
                  value={formData.parentDepartmentId || "ROOT"}
                  onValueChange={(val) => 
                     setFormData({ ...formData, parentDepartmentId: val === "ROOT" ? null : val })
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 focus:ring-[#2E3192]/20">
                    <SelectValue placeholder="Chọn phòng ban cấp trên" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-xl">
                    <SelectItem value="ROOT" className="text-slate-500 italic">-- ROOT (Không có cấp trên) --</SelectItem>
                    {parentOptions.map((dep) => (
                      <SelectItem key={dep.id} value={dep.id}>
                        {dep.name} <span className="text-slate-400 text-[10px] ml-1">(Cấp {dep.level})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-400">Nếu để Root, phòng ban này sẽ nằm ở cấp cao nhất (Level 1).</p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="desc"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  {t("department.form.descLabel", { defaultValue: "Mô tả chi tiết" })}
                </Label>
                <Textarea
                  id="desc"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("department.form.descPlaceholder", { defaultValue: "Nhập mô tả chức năng, nhiệm vụ..." })}
                  rows={4}
                  className="rounded-xl border-slate-200 focus-visible:ring-[#2E3192]/20 resize-none p-3"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 mt-4">
              <div className="space-y-1">
                <Label className="text-[#1E2062] text-sm font-bold block">
                  {t("department.form.statusLabel", { defaultValue: "Kích hoạt hoạt động" })}
                </Label>
                <p className="text-[11px] text-slate-500">
                  {t("department.form.statusDesc", { defaultValue: "Cho phép phân bổ nhân sự vào phòng ban này." })}
                </p>
              </div>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 shrink-0 bg-white flex justify-end gap-3 rounded-b-2xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 w-[120px] h-11 font-medium transition-all"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white px-6 h-11 transition-all shadow-lg shadow-[#2E3192]/20 font-semibold flex-1"
              disabled={!formData.name.trim()}
            >
              {isEditing
                ? t("department.form.saveChanges", { defaultValue: "Lưu thay đổi" })
                : t("department.form.saveBtn", { defaultValue: "Tạo phòng ban" })}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
