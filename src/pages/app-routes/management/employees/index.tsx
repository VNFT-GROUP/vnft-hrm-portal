import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Users, UserPlus, Key, Clock, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// Fake Data for Dropdowns
const DEPARTMENTS = ["Phòng Nhân Sự", "Phòng Kế Toán", "Phòng IT", "Phòng Kinh Doanh"];
const POSITIONS = ["Giám đốc", "Trưởng phòng", "Nhân viên", "Thực tập sinh"];
const FUNCTIONS = ["Quản lý", "Chuyên viên", "Hỗ trợ"];
const WORK_STATUS = ["Đang làm", "Nghỉ sinh", "Tạm hoãn", "Đã nghỉ việc"];
const SYSTEM_ROLES = ["Admin", "HR Manager", "Kế Toán", "Nhân viên"];

const initEmployees = [
  {
    id: "1",
    empCodePrefix: "VNSGN",
    empCodeId: "090",
    attendanceCode: "12345",
    fullName: "Trương Thành Nhân",
    englishName: "Ethan",
    email: "ethan@vnft.com",
    department: "Phòng IT",
    position: "Trưởng phòng",
    func: "Quản lý",
    status: "Đang làm",
    checkInTime: "08:30",
    checkOutTime: "17:30",
    sysRole: "Admin"
  },
  {
    id: "2",
    empCodePrefix: "VNHAN",
    empCodeId: "012",
    attendanceCode: "12346",
    fullName: "Nguyễn Văn A",
    englishName: "John Doe",
    email: "john@vnft.com",
    department: "Phòng Nhân Sự",
    position: "Nhân viên",
    func: "Chuyên viên",
    status: "Tạm hoãn",
    checkInTime: "08:30",
    checkOutTime: "17:30",
    sysRole: ""
  }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const [formData, setFormData] = useState({
    empCodePrefix: "VNSGN",
    empCodeId: "",
    attendanceCode: "",
    fullName: "",
    englishName: "",
    email: "",
    department: "",
    position: "",
    func: "",
    status: "Đang làm",
    checkInTime: "08:30",
    checkOutTime: "17:30",
    sysRole: "",
    password: "",
    confirmPassword: ""
  });

  const filteredData = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `${e.empCodePrefix}${e.empCodeId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (emp?: any) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({ ...emp, password: "", confirmPassword: "" });
    } else {
      setEditingEmployee(null);
      setFormData({
        empCodePrefix: "VNSGN",
        empCodeId: Math.floor(100 + Math.random() * 900).toString().padStart(3, '0'),
        attendanceCode: "",
        fullName: "",
        englishName: "",
        email: "",
        department: "",
        position: "",
        func: "",
        status: "Đang làm",
        checkInTime: "08:30",
        checkOutTime: "17:30",
        sysRole: "",
        password: "",
        confirmPassword: ""
      });
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.fullName.trim()) return;
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...formData } : e));
    } else {
      setEmployees([{ id: Date.now().toString(), ...formData }, ...employees]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Đang làm": return "bg-[#10b981] hover:bg-[#10b981]/90 shadow-[#10b981]/20";
      case "Nghỉ sinh": return "bg-pink-500 hover:bg-pink-500/90 shadow-pink-500/20 text-white";
      case "Tạm hoãn": return "bg-amber-500 hover:bg-amber-500/90 shadow-amber-500/20 text-white";
      case "Đã nghỉ việc": return "bg-slate-300 hover:bg-slate-400 text-slate-700 shadow-none border-0";
      default: return "bg-slate-100 text-slate-500 border-0";
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <Users size={28} />
          </span>
          Hồ sơ nhân viên
        </h1>
        <p className="text-slate-500 text-base md:text-lg ml-1">
          Quản lý toàn bộ thông tin nhân sự và cấp phát tài khoản trong hệ thống.
        </p>
      </motion.div>

      {/* 2 & 3. Toolbar Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        {/* Tìm kiếm */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Tìm kiếm theo Tên hoặc Mã NV..." 
            className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#2E3192] text-base hover:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Nút tạo */}
        <Button 
          onClick={() => handleOpenForm()} 
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <UserPlus size={20} className="mr-2" /> Thêm nhân viên
        </Button>
      </motion.div>

      {/* 4. Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1"
      >
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 w-[120px] border-r border-slate-200 text-center align-middle px-4">Mã NV</TableHead>
                <TableHead className="font-semibold text-slate-700 border-r border-slate-200 text-left align-middle px-6 min-w-[250px]">Họ và Tên</TableHead>
                <TableHead className="font-semibold text-slate-700 w-[200px] border-r border-slate-200 text-left align-middle px-6">Phòng ban</TableHead>
                <TableHead className="font-semibold text-slate-700 w-[150px] border-r border-slate-200 text-center align-middle px-4">Trạng thái</TableHead>
                <TableHead className="font-semibold text-slate-700 w-[120px] text-center align-middle px-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredData.map((emp) => (
                  <motion.tr 
                    key={emp.id}
                    layout // Animate sorting/filtering
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-slate-200 group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-slate-600 py-4 border-r border-slate-200 text-center align-middle px-4">
                      {emp.empCodePrefix}{emp.empCodeId}
                    </TableCell>
                    <TableCell className="py-4 border-r border-slate-200 text-left align-middle px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E2062]/10 flex flex-shrink-0 items-center justify-center text-[#1E2062] font-bold shadow-sm">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1E2062]">{emp.fullName}</span>
                          <span className="text-xs text-slate-500">{emp.englishName ? `(${emp.englishName})` : ''} - {emp.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 border-r border-slate-200 text-left align-middle px-6 text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{emp.department}</span>
                        <span className="text-xs text-slate-500">{emp.position}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 border-r border-slate-200 text-center align-middle">
                      <Badge className={`${getStatusColor(emp.status)} shadow-sm font-medium border-0`}>
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(emp)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Users size={32} className="mb-2 opacity-50" />
                      <p>Không tìm thấy nhân viên nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Side Form (Sheet) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-[700px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
          <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
            <SheetHeader>
               <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
                 <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                   <UserPlus size={18} />
                 </span>
                 {editingEmployee ? "Cập nhật hồ sơ nhân viên" : "Thêm mới nhân viên"}
               </SheetTitle>
               <SheetDescription className="text-slate-500">
                 Điền đầy đủ các thông tin cá nhân, công việc và phân quyền hệ thống.
               </SheetDescription>
            </SheetHeader>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-[#2E3192]" /> Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mã NV</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={formData.empCodePrefix} onValueChange={(val) => setFormData({...formData, empCodePrefix: val})}>
                      <SelectTrigger className="w-full sm:w-[120px] rounded-xl border-slate-300">
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
                      className="rounded-xl flex-1 border-slate-300 bg-slate-100 text-slate-600 font-medium cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mã Chấm Công</Label>
                  <Input 
                    value={formData.attendanceCode}
                    onChange={e => setFormData({...formData, attendanceCode: e.target.value})}
                    placeholder="VD: 12345"
                    className="rounded-xl border-slate-300"
                  />
                  <p className="text-[11px] text-slate-500 line-clamp-1">Dùng để liên kết máy chấm công</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Họ Tên <span className="text-rose-500">*</span></Label>
                  <Input 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Nguyễn Văn A"
                    className="rounded-xl border-slate-300 focus-visible:ring-[#2E3192]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tên Tiếng Anh</Label>
                  <Input 
                    value={formData.englishName}
                    onChange={e => setFormData({...formData, englishName: e.target.value})}
                    placeholder="John Doe"
                    className="rounded-xl border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="user@example.com"
                      className="rounded-xl pl-9 border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Work info */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <Users size={18} className="text-[#F7941D]" /> Công việc & Định biên
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Phòng ban</Label>
                  <Select value={formData.department} onValueChange={(val) => setFormData({...formData, department: val})}>
                    <SelectTrigger className="rounded-xl border-slate-300">
                      <SelectValue placeholder="-- Chọn phòng ban --" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Tên Vị Trí</Label>
                  <Select value={formData.position} onValueChange={(val) => setFormData({...formData, position: val})}>
                    <SelectTrigger className="rounded-xl border-slate-300">
                      <SelectValue placeholder="-- Chọn vị trí --" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Chức năng</Label>
                  <Select value={formData.func} onValueChange={(val) => setFormData({...formData, func: val})}>
                    <SelectTrigger className="rounded-xl border-slate-300">
                      <SelectValue placeholder="-- Chọn chức năng --" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNCTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                    <SelectTrigger className="rounded-xl border-slate-300">
                      <SelectValue placeholder="-- Chọn trạng thái --" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Giờ vào làm <span className="text-xs font-normal text-slate-400">(Tùy chọn)</span></Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input type="time" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} className="rounded-xl pl-9 border-slate-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Giờ tan làm <span className="text-xs font-normal text-slate-400">(Tùy chọn)</span></Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input type="time" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} className="rounded-xl pl-9 border-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: System Access */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <Key size={18} className="text-[#10b981]" /> Tài khoản hệ thống <span className="text-sm font-normal text-slate-400">(Tùy chọn)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Vai trò</Label>
                  <Select value={formData.sysRole} onValueChange={(val) => setFormData({...formData, sysRole: val === "no-role" ? "" : val})}>
                    <SelectTrigger className="rounded-xl border-slate-300">
                      <SelectValue placeholder="-- Không gán vai trò --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-role">-- Không gán vai trò --</SelectItem>
                      {SYSTEM_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mật khẩu đăng nhập</Label>
                  <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="rounded-xl border-slate-300" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu</Label>
                  <Input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" className="rounded-xl border-slate-300" />
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-white flex justify-end gap-3">
             <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 w-32 transition-all">
               Hủy
             </Button>
             <Button onClick={handleSave} className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={!formData.fullName.trim()}>
               {editingEmployee ? "Lưu thay đổi" : "Tạo nhân viên"}
             </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
