import { Briefcase, Clock, Key, Mail, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEPARTMENTS = ["Phòng Nhân Sự", "Phòng Kế Toán", "Phòng IT", "Phòng Kinh Doanh"];
const POSITIONS = ["Giám đốc", "Trưởng phòng", "Nhân viên", "Thực tập sinh"];
const FUNCTIONS = ["Quản lý", "Chuyên viên", "Hỗ trợ"];
const WORK_STATUS = ["Đang làm", "Nghỉ sinh", "Tạm hoãn", "Đã nghỉ việc"];
const SYSTEM_ROLES = ["Admin", "HR Manager", "Kế Toán", "Nhân viên"];

interface EmployeeFormSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: (data: any) => void;
  isEditing: boolean;
  onSave: () => void;
}

export default function EmployeeFormSheet({ isOpen, onOpenChange, formData, setFormData, isEditing, onSave }: EmployeeFormSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[700px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border flex-shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <UserPlus size={18} />
              </span>
              {isEditing ? "Cập nhật hồ sơ nhân viên" : "Thêm mới nhân viên"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Điền đầy đủ các thông tin cá nhân, công việc và phân quyền hệ thống.
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-[#2E3192]" /> Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Mã NV</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={formData.empCodePrefix || ""} onValueChange={(val) => setFormData({...formData, empCodePrefix: val})}>
                    <SelectTrigger className="w-full sm:w-[120px] rounded-xl border-border">
                      <SelectValue placeholder="Tiền tố" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VNSGN">VNSGN</SelectItem>
                      <SelectItem value="VNHAN">VNHAN</SelectItem>
                      <SelectItem value="VNDAD">VNDAD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    value={formData.empCodeId} 
                    disabled 
                    className="rounded-xl flex-1 border-border bg-muted text-muted-foreground font-medium cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Mã Chấm Công</Label>
                <Input 
                  value={formData.attendanceCode}
                  onChange={e => setFormData({...formData, attendanceCode: e.target.value})}
                  placeholder="VD: 12345"
                  className="rounded-xl border-border"
                />
                <p className="text-[11px] text-muted-foreground line-clamp-1">Dùng để liên kết máy chấm công</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Họ Tên <span className="text-rose-500">*</span></Label>
                <Input 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Nguyễn Văn A"
                  className="rounded-xl border-border focus-visible:ring-[#2E3192]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Tên Tiếng Anh</Label>
                <Input 
                  value={formData.englishName}
                  onChange={e => setFormData({...formData, englishName: e.target.value})}
                  placeholder="John Doe"
                  className="rounded-xl border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="user@example.com"
                    className="rounded-xl pl-9 border-border"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Work info */}
          <div>
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#F7941D]" /> Công việc & Định biên
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Phòng ban</Label>
                <Select value={formData.department || ""} onValueChange={(val) => setFormData({...formData, department: val})}>
                  <SelectTrigger className="rounded-xl border-border">
                    <SelectValue placeholder="-- Chọn phòng ban --" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Tên Vị Trí</Label>
                <Select value={formData.position || ""} onValueChange={(val) => setFormData({...formData, position: val})}>
                  <SelectTrigger className="rounded-xl border-border">
                    <SelectValue placeholder="-- Chọn vị trí --" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Chức năng</Label>
                <Select value={formData.func || ""} onValueChange={(val) => setFormData({...formData, func: val})}>
                  <SelectTrigger className="rounded-xl border-border">
                    <SelectValue placeholder="-- Chọn chức năng --" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNCTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Trạng thái</Label>
                <Select value={formData.status || ""} onValueChange={(val) => setFormData({...formData, status: val})}>
                  <SelectTrigger className="rounded-xl border-border">
                    <SelectValue placeholder="-- Chọn trạng thái --" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Giờ vào làm <span className="text-xs font-normal text-muted-foreground">(Tùy chọn)</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input type="time" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} className="rounded-xl pl-9 border-border" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Giờ tan làm <span className="text-xs font-normal text-muted-foreground">(Tùy chọn)</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input type="time" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} className="rounded-xl pl-9 border-border" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: System Access */}
          <div>
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Key size={18} className="text-[#10b981]" /> Tài khoản hệ thống <span className="text-sm font-normal text-muted-foreground">(Tùy chọn)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Vai trò</Label>
                <Select value={formData.sysRole || "no-role"} onValueChange={(val) => setFormData({...formData, sysRole: val === "no-role" ? "" : val})}>
                  <SelectTrigger className="rounded-xl border-border">
                    <SelectValue placeholder="-- Không gán vai trò --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-role">-- Không gán vai trò --</SelectItem>
                    {SYSTEM_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Mật khẩu đăng nhập</Label>
                <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="rounded-xl border-border" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Xác nhận mật khẩu</Label>
                <Input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" className="rounded-xl border-border" />
              </div>
            </div>
          </div>

        </div>
        
        <div className="p-4 border-t border-border flex-shrink-0 bg-card text-card-foreground flex justify-end gap-3">
           <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
             Hủy
           </Button>
           <Button onClick={onSave} className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.fullName?.trim()}>
             {isEditing ? "Lưu thay đổi" : "Tạo nhân viên"}
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
