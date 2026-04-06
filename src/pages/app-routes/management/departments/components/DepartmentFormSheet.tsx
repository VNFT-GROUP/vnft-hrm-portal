import { Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { type Manager } from "./DepartmentTable";

interface DepartmentFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; description: string; managerIds: string[] };
  setFormData: (data: { name: string; description: string; managerIds: string[] }) => void;
  isEditing: boolean;
  onSave: () => void;
  managers: Manager[];
}

export default function DepartmentFormSheet({ isOpen, onOpenChange, formData, setFormData, isEditing, onSave, managers }: DepartmentFormSheetProps) {
  const [mgrSearch, setMgrSearch] = useState("");

  const filteredManagers = managers.filter(m => 
    m.name.toLowerCase().includes(mgrSearch.toLowerCase()) || 
    m.username.toLowerCase().includes(mgrSearch.toLowerCase())
  );

  const toggleManager = (id: string) => {
    const isSelected = formData.managerIds.includes(id);
    if (isSelected) {
      setFormData({ ...formData, managerIds: formData.managerIds.filter(mId => mId !== id) });
    } else {
      setFormData({ ...formData, managerIds: [...formData.managerIds, id] });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <SheetHeader>
             <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
               <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                 <Building2 size={18} />
               </span>
               {isEditing ? "Cập nhật phòng ban" : "Thêm phòng ban mới"}
             </SheetTitle>
             <SheetDescription className="text-slate-500">
               Thiết lập thông tin và chỉ định nhân sự cấp quản lý cho phòng ban này.
             </SheetDescription>
          </SheetHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Tên phòng ban <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="VD: Phòng Nhân Sự" 
                className="rounded-xl border-slate-300 focus-visible:ring-[#2E3192]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-semibold text-slate-700">Mô tả</Label>
              <Textarea 
                id="desc" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Vai trò và nhiệm vụ của phòng ban..." 
                rows={3}
                className="rounded-xl border-slate-300 focus-visible:ring-[#2E3192] resize-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 flex justify-between items-center">
              <span>Chọn Manager / BOD quản lý <span className="text-xs font-normal text-slate-400">(Có thể chọn nhiều)</span></span>
              <Badge variant="secondary" className="bg-[#1E2062]/10 text-[#1E2062]">Đã chọn: {formData.managerIds.length}</Badge>
            </Label>
            
            {/* Search within managers */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Tìm quản lý..." 
                className="pl-9 h-10 rounded-lg border-slate-200 bg-slate-50"
                value={mgrSearch}
                onChange={e => setMgrSearch(e.target.value)}
              />
            </div>

            {/* List of managers to select */}
            <div className="border border-slate-200 rounded-xl max-h-[320px] overflow-y-auto bg-white divide-y divide-slate-100 shadow-inner">
              {filteredManagers.length > 0 ? filteredManagers.map(mgr => (
                <div 
                  key={mgr.id} 
                  className={`flex items-center gap-3 p-3 transition-colors cursor-pointer select-none
                    ${formData.managerIds.includes(mgr.id) ? 'bg-[#2E3192]/5 hover:bg-[#2E3192]/10' : 'hover:bg-slate-50'}
                  `} 
                  onClick={() => toggleManager(mgr.id)}
                >
                  <input 
                    type="checkbox" 
                    checked={formData.managerIds.includes(mgr.id)} 
                    readOnly 
                    className="w-4 h-4 ml-1 accent-[#2E3192] cursor-pointer" 
                  />
                  <div className="w-10 h-10 rounded-full bg-[#1E2062]/10 flex flex-shrink-0 items-center justify-center text-[#1E2062] font-bold shadow-sm">
                    {mgr.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${formData.managerIds.includes(mgr.id) ? 'text-[#1E2062]' : 'text-slate-800'}`}>
                      {mgr.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{mgr.username}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant="outline" className={`${mgr.role === 'BOD' ? 'text-rose-600 border-rose-200 bg-rose-50' : 'text-[#2E3192] border-[#2E3192]/20 bg-[#2E3192]/5'}`}>
                      {mgr.role}
                    </Badge>
                    {mgr.deptLabel && <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:block">{mgr.deptLabel}</span>}
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Không tìm thấy quản lý phù hợp
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-white flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 w-32 transition-all">
            Hủy
          </Button>
          <Button onClick={onSave} className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.name.trim()}>
            {isEditing ? "Lưu thay đổi" : "Lưu phòng ban"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
