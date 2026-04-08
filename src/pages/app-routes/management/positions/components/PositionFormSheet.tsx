import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PositionFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; description: string; active: boolean; manager: boolean };
  setFormData: (data: { name: string; description: string; active: boolean; manager: boolean }) => void;
  isEditing: boolean;
  onSave: () => void;
}

export default function PositionFormSheet({ isOpen, onOpenChange, formData, setFormData, isEditing, onSave }: PositionFormSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <Briefcase size={18} />
              </span>
              {isEditing ? "Cập nhật chức vụ" : "Thêm mới chức vụ"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {isEditing ? "Chỉnh sửa thông tin của chức vụ đang chọn." : "Điền thông tin bên dưới để khởi tạo một chức vụ mới trong hệ thống."}
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Tên chức vụ <span className="text-rose-500">*</span>
            </Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="VD: Trưởng phòng Marketing" 
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="desc" className="text-sm font-semibold text-foreground">Mô tả (Tùy chọn)</Label>
            <Textarea 
              id="desc" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Nhập mô tả quyền hạn và trách nhiệm..." 
              rows={5}
              className="rounded-xl border-border focus-visible:ring-[#2E3192] bg-muted focus:bg-card text-card-foreground transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-foreground text-sm font-semibold block">Chức vụ cấp Quản lý?</Label>
              <p className="text-xs text-muted-foreground">Bật nếu đây là chức vụ điều hành (Trưởng phòng, Giám đốc...)</p>
            </div>
            <Switch 
              checked={formData.manager} 
              onCheckedChange={checked => setFormData({...formData, manager: checked})} 
            />
          </div>
          
          <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-foreground text-sm font-semibold block">Trạng thái rảnh rỗi / hoạt động?</Label>
              <p className="text-xs text-muted-foreground">Bật để cho phép gán bộ phận này cho nhân sự</p>
            </div>
            <Switch 
              checked={formData.active} 
              onCheckedChange={checked => setFormData({...formData, active: checked})} 
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
            Hủy
          </Button>
          <Button onClick={onSave} className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.name.trim()}>
            {isEditing ? "Lưu thay đổi" : "Lưu chức vụ"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
