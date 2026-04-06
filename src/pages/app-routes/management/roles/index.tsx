import { useState } from "react";
import { Plus, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import RoleTable, { type Role } from "./components/RoleTable";
import RoleFormSheet from "./components/RoleFormSheet";

const initRoles: Role[] = [
  { id: "1", name: "Giám đốc", description: "Quản lý điều hành chung", status: true },
  { id: "2", name: "Trưởng phòng", description: "Quản lý bộ phận kỹ thuật / hành chính", status: true },
  { id: "3", name: "Nhân viên", description: "Nhân viên chính thức các phòng ban", status: true },
  { id: "4", name: "Thực tập sinh", description: "Vị trí học việc và thử việc ngắn hạn", status: false },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState({ name: "", description: "", status: true });

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({ name: role.name, description: role.description, status: role.status });
    } else {
      setEditingRole(null);
      setFormData({ name: "", description: "", status: true });
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
    } else {
      setRoles([...roles, { id: Date.now().toString(), ...formData }]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
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
            <Briefcase size={28} />
          </span>
          Chức vụ
        </h1>
        <p className="text-slate-500 text-base md:text-lg ml-1">
          Quản lý và thiết lập danh sách chức vụ trong công ty.
        </p>
      </motion.div>

      {/* 2 & 3. Toolbar Section (Tìm Kiếm + Nút tạo) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Tìm kiếm theo Tên chức vụ..." 
            className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#2E3192] text-base hover:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenForm()} 
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <Plus size={20} className="mr-2" /> Thêm chức vụ
        </Button>
      </motion.div>

      {/* 4. Main Table Card Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1"
      >
        <RoleTable roles={filteredRoles} onEdit={handleOpenForm} onDelete={handleDelete} />
      </motion.div>

      {/* Side Form (Sheet) */}
      <RoleFormSheet 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingRole}
        onSave={handleSave}
      />
    </div>
  );
}
