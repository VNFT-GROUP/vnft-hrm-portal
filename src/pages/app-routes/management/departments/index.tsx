import { useState } from "react";
import { Plus, Search, Building2, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";

import DepartmentTable, { type Department, type Manager } from "./components/DepartmentTable";
import DepartmentFormSheet from "./components/DepartmentFormSheet";

const MANAGERS: Manager[] = [
  { id: "m1", name: "Đoàn Trúc Thuỷ", role: "Manager", username: "@jena", deptLabel: "LOG" },
  { id: "m2", name: "Huỳnh Tân Viễn", role: "Manager", username: "@victor", deptLabel: "" },
  { id: "m3", name: "La Hồng Ngọc Cẩm", role: "Manager", username: "@ruby", deptLabel: "OPS" },
  { id: "m4", name: "La Hồng Vân", role: "BOD", username: "@anny", deptLabel: "HR & ADM" },
  { id: "m5", name: "Lê Viết Tuấn", role: "Manager", username: "@tony", deptLabel: "" },
  { id: "m6", name: "Ngô Thị Thuỳ", role: "Manager", username: "@tina", deptLabel: "SALES" },
  { id: "m11", name: "Nguyễn Duy Khánh (Richard)", role: "BOD", username: "@richard", deptLabel: "" },
  { id: "m7", name: "Nguyễn Thị Kim Phượng", role: "Manager", username: "@violet", deptLabel: "ACC" },
  { id: "m8", name: "Phạm Thị Hoài Thu", role: "Manager", username: "@sunny", deptLabel: "HAN" },
  { id: "m9", name: "Trịnh Huyền Trang", role: "Manager", username: "@tracytrang", deptLabel: "AIR FREIGHT" },
  { id: "m10", name: "Võ Thị Trúc Mai", role: "Manager", username: "@candy", deptLabel: "PRICING" },
];

const initDepartments: Department[] = [
  { id: "d1", name: "Phòng Nhân Sự (HR & ADM)", description: "Quản lý tuyển dụng, lương thưởng và văn hóa", managerIds: ["m4"] },
  { id: "d2", name: "Phòng Kinh Doanh (SALES)", description: "Tìm kiếm khách hàng, xúc tiến thương mại", managerIds: ["m6"] },
  { id: "d3", name: "Phòng Chứng Từ (OPS)", description: "Xử lý vận đơn, theo dõi lộ trình hàng", managerIds: ["m3"] },
];

export default function DepartmentsPage() {
  const showDepartmentLegend = useLayoutStore(state => state.showDepartmentLegend);
  const [departments, setDepartments] = useState<Department[]>(initDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [formData, setFormData] = useState<{name: string, description: string, managerIds: string[]}>({ 
    name: "", description: "", managerIds: [] 
  });

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({ name: dept.name, description: dept.description, managerIds: dept.managerIds });
    } else {
      setEditingDept(null);
      setFormData({ name: "", description: "", managerIds: [] });
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...formData } : d));
    } else {
      setDepartments([{ id: Date.now().toString(), ...formData }, ...departments]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <Building2 size={28} />
          </span>
          Phòng ban
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          Thiết lập cấu trúc phòng ban và chỉ định nhân sự quản lý (BOD/Manager).
        </p>
      </motion.div>

      {/* 1.5 Legend Section */}
      {showDepartmentLegend && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card text-card-foreground p-4 rounded-xl border border-border flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground w-full shadow-sm items-center"
        >
          <span className="font-semibold text-[#1E2062] mr-2">Chú thích thao tác:</span>
          <div className="flex items-center gap-2">
            <Edit2 size={16} className="text-[#2E3192]" />
            <span>Chỉnh sửa thông tin phòng ban</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-rose-500" />
            <span>Xóa phòng ban</span>
          </div>
          <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
            (Tắt chú thích trong tùy chỉnh <span className="ml-1 font-mono text-[10px] font-semibold bg-background py-0.5 px-1.5 rounded border border-border shadow-sm">Alt + S</span>)
          </div>
        </motion.div>
      )}

      {/* 2 & 3. Toolbar Section (Tìm Kiếm + Nút tạo) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Tìm kiếm theo Tên phòng ban..." 
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card text-card-foreground transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenForm()} 
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <Plus size={20} className="mr-2" /> Thêm phòng ban
        </Button>
      </motion.div>

      {/* 4. Main Table Card Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1"
      >
        <DepartmentTable 
          departments={filteredDepts} 
          managers={MANAGERS}
          onEdit={handleOpenForm} 
          onDelete={handleDelete} 
        />
      </motion.div>

      {/* Side Form (Sheet) */}
      <DepartmentFormSheet 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingDept}
        onSave={handleSave}
        managers={MANAGERS}
      />
    </div>
  );
}
