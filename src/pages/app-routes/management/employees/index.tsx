import { useState } from "react";
import { Search, Users, UserPlus, Eye, Edit2, CircleDollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";

import EmployeeTable, { type Employee } from "./components/EmployeeTable";
import EmployeeFormSheet from "./components/EmployeeFormSheet";

const initEmployees: Employee[] = [
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
  const [employees, setEmployees] = useState<Employee[]>(initEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const showEmployeeLegend = useLayoutStore(state => state.showEmployeeLegend);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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

  const handleOpenForm = (emp?: Employee) => {
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
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          Quản lý toàn bộ thông tin nhân sự và cấp phát tài khoản trong hệ thống.
        </p>
      </motion.div>

      {/* 2. Legend Section */}
      {showEmployeeLegend && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card text-card-foreground p-4 rounded-xl border border-border flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground w-full shadow-sm items-center"
        >
          <span className="font-semibold text-[#1E2062] mr-2">Chú thích thao tác:</span>
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-sky-500" /> 
            <span>Xem chi tiết thông tin chung</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit2 size={16} className="text-amber-500" />
            <span>Chỉnh sửa thông tin chung</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign size={16} className="text-emerald-500" />
            <span>Xem/chỉnh sửa lương</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-rose-500" />
            <span>Hủy kích hoạt tài khoản</span>
          </div>
          <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
            (Tắt chú thích trong tùy chỉnh <span className="ml-1 font-mono text-[10px] font-semibold bg-background py-0.5 px-1.5 rounded border border-border shadow-sm">Alt + S</span>)
          </div>
        </motion.div>
      )}

      {/* 3. Toolbar Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Tìm kiếm theo Tên hoặc Mã NV..." 
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card text-card-foreground transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenForm()} 
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <UserPlus size={20} className="mr-2" /> Thêm nhân viên
        </Button>
      </motion.div>


      {/* 5. Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1"
      >
        <EmployeeTable employees={filteredData} onEdit={handleOpenForm} onDelete={handleDelete} />
      </motion.div>

      {/* Side Form (Sheet) */}
      <EmployeeFormSheet 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingEmployee}
        onSave={handleSave}
      />
    </div>
  );
}
