import { FileText } from "lucide-react";
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

interface EmployeeCodeFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { prefix: string; description: string; active: boolean };
  setFormData: (data: { prefix: string; description: string; active: boolean }) => void;
  onSave: () => void;
}

export default function EmployeeCodeFormSheet({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSave,
}: EmployeeCodeFormProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <FileText size={18} />
              </span>
              Tạo mới Prefix
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Thông tin cấu hình cho mã định danh nhân viên.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formData.prefix.trim()) {
              onSave();
            }
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="prefix"
                  className="text-sm font-semibold text-foreground"
                >
                  Prefix <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="prefix"
                  value={formData.prefix}
                  onChange={(e) =>
                    setFormData({ ...formData, prefix: e.target.value })
                  }
                  placeholder="VD: VN, SGN"
                  className="rounded-xl border-border focus-visible:ring-[#2E3192]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="desc"
                  className="text-sm font-semibold text-foreground"
                >
                  Mô tả
                </Label>
                <Textarea
                  id="desc"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả"
                  rows={3}
                  className="rounded-xl border-border focus-visible:ring-[#2E3192] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
              <div className="space-y-1">
                <Label className="text-foreground text-sm font-semibold block">
                  Trạng thái hoạt động
                </Label>
                <p className="text-xs text-muted-foreground">
                  Cho phép hoặc vô hiệu hóa prefix này trên hệ thống
                </p>
              </div>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
            </div>
          </div>

          <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20"
              disabled={!formData.prefix.trim()}
            >
              Tạo mới
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
