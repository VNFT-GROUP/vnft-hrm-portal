import { UserPlus, User, Key, Fingerprint, Mail, Building2, MapPin, Users, UserCircle, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { departmentService } from "@/services/department";
import { positionService } from "@/services/position";
import { groupService } from "@/services/group/groupService";
import { employeeCodeService } from "@/services/employeeCode";
import { roleService } from "@/services/role/roleService";
import { SearchableSelect } from "@/components/custom/SearchableSelect";


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
  
  const { data: departmentsResponse, refetch: refetchDepts, isFetching: isFetchingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
    enabled: isOpen,
  });

  const { data: positionsResponse, refetch: refetchPositions, isFetching: isFetchingPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => positionService.getPositions(),
    enabled: isOpen,
  });

  const { data: groupsResponse, refetch: refetchGroups, isFetching: isFetchingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getGroups(),
    enabled: isOpen,
  });

  const { data: employeeCodesResponse, refetch: refetchCodes, isFetching: isFetchingCodes } = useQuery({
    queryKey: ['employeeCodes'],
    queryFn: () => employeeCodeService.getEmployeeCodes(),
    enabled: isOpen,
  });

  const { data: rolesResponse, refetch: refetchRoles, isFetching: isFetchingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
    enabled: isOpen,
  });

  const departments = departmentsResponse?.data?.map(d => ({ value: d.id, label: d.name })) || [];
  const positions = positionsResponse?.data?.map(p => ({ value: p.id, label: p.name })) || [];
  const groups = groupsResponse?.data?.map(g => ({ value: g.id, label: g.name })) || [];
  const employeeCodes = employeeCodesResponse?.data?.filter(c => c.active).map(c => ({ value: c.id, label: c.prefix })) || [];
  const roles = rolesResponse?.data?.filter(r => r.active !== false).map(r => ({ value: r.id, label: r.name })) || [];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[900px]! w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
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
        
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (formData.fullName?.trim() && formData.englishName?.trim() && formData.email?.trim() && formData.password?.trim() && formData.empCodePrefix && formData.func) {
            onSave();
          }
        }} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Tài khoản <span className="text-rose-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="rounded-xl border-border pl-10 focus-visible:ring-[#2E3192] h-11 bg-background shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Mật khẩu <span className="text-rose-500">*</span></Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  placeholder="••••••••" 
                  className="rounded-xl border-border pl-10 focus-visible:ring-[#2E3192] h-11 bg-background shadow-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Mã nhân viên <span className="text-rose-500">*</span></Label>
              <SearchableSelect 
                options={employeeCodes}
                value={formData.empCodePrefix || ""}
                onChange={(val) => setFormData({...formData, empCodePrefix: val})}
                placeholder="-- Chọn mã nhân viên --"
                onRefresh={() => refetchCodes()}
                isLoading={isFetchingCodes}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Mã Chấm Công</Label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  value={formData.attendanceCode}
                  onChange={e => setFormData({...formData, attendanceCode: e.target.value})}
                  placeholder="VD: 12345"
                  className="rounded-xl border-border pl-10 focus-visible:ring-[#2E3192] h-11 bg-background shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-foreground">Họ Tên <span className="text-rose-500">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Nguyễn Văn A"
                  className="rounded-xl border-border pl-10 focus-visible:ring-[#2E3192] h-11 bg-background shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-foreground">Tên Tiếng Anh <span className="text-rose-500">*</span></Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  value={formData.englishName}
                  onChange={e => setFormData({...formData, englishName: e.target.value})}
                  placeholder="John Doe"
                  className="rounded-xl border-border pl-10 focus-visible:ring-[#2E3192] h-11 bg-background shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Building2 size={14} className="text-muted-foreground"/> Phòng ban</Label>
              <SearchableSelect 
                options={departments}
                value={formData.department || ""}
                onChange={(val) => setFormData({...formData, department: val})}
                placeholder="-- Chọn phòng ban --"
                onRefresh={() => refetchDepts()}
                isLoading={isFetchingDepts}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><MapPin size={14} className="text-muted-foreground"/> Vị trí</Label>
              <SearchableSelect 
                options={positions}
                value={formData.position || ""}
                onChange={(val) => setFormData({...formData, position: val})}
                placeholder="-- Chọn vị trí --"
                onRefresh={() => refetchPositions()}
                isLoading={isFetchingPositions}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Layers size={14} className="text-muted-foreground"/> Chức vụ</Label>
              <SearchableSelect 
                options={roles}
                value={formData.sysRole || ""}
                onChange={(val) => setFormData({...formData, sysRole: val})}
                placeholder="-- Chọn chức vụ --"
                onRefresh={() => refetchRoles()}
                isLoading={isFetchingRoles}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Users size={14} className="text-muted-foreground"/> Nhóm/Chức năng <span className="text-rose-500">*</span></span>
                <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-600 border-sky-200 uppercase pointer-events-none tracking-widest px-1.5 flex h-5 items-center">Phân quyền</Badge>
              </Label>
              <SearchableSelect 
                options={groups}
                value={formData.func || ""}
                onChange={(val) => setFormData({...formData, func: val})}
                placeholder="-- Chọn nhóm/chức năng --"
                onRefresh={() => refetchGroups()}
                isLoading={isFetchingGroups}
              />
            </div>

          </div>
        </div>
        
        <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
           <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
             Hủy
           </Button>
           <Button type="submit" className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.fullName?.trim() || !formData.englishName?.trim() || !formData.email?.trim() || !formData.password?.trim() || !formData.empCodePrefix || !formData.func}>
             {isEditing ? "Lưu thay đổi" : "Tạo nhân viên"}
           </Button>
        </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
