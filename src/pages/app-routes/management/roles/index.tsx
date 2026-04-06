import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Briefcase } from "lucide-react";
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
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

const initRoles = [
  { id: "1", name: "Giám đốc", description: "Quản lý điều hành chung", status: true },
  { id: "2", name: "Trưởng phòng", description: "Quản lý bộ phận kỹ thuật / hành chính", status: true },
  { id: "3", name: "Nhân viên", description: "Nhân viên chính thức các phòng ban", status: true },
  { id: "4", name: "Thực tập sinh", description: "Vị trí học việc và thử việc ngắn hạn", status: false },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const [formData, setFormData] = useState({ name: "", description: "", status: true });

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (role?: any) => {
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
        {/* Tìm kiếm */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Tìm kiếm theo Tên chức vụ..." 
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
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 w-[220px] border-r border-slate-200 text-left align-middle px-6">Tên chức vụ</TableHead>
                <TableHead className="font-semibold text-slate-700 border-r border-slate-200 text-left align-middle px-6">Mô tả</TableHead>
                <TableHead className="font-semibold text-slate-700 w-[150px] border-r border-slate-200 text-center align-middle px-4">Trạng thái</TableHead>
                <TableHead className="font-semibold text-slate-700 w-[120px] text-center align-middle px-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredRoles.map((role) => (
                  <motion.tr 
                    key={role.id}
                    layout // Animate sorting/filtering
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-slate-200 group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                  >
                    <TableCell className="font-bold text-[#1E2062] py-4 border-r border-slate-200 text-left align-middle px-6">{role.name}</TableCell>
                    <TableCell className="text-slate-500 py-4 max-w-[300px] truncate border-r border-slate-200 text-left align-middle px-6" title={role.description}>{role.description || "—"}</TableCell>
                    <TableCell className="py-4 border-r border-slate-200 text-center align-middle">
                      <Badge 
                        variant={role.status ? "default" : "secondary"} 
                        className={role.status 
                          ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium" 
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600 font-medium border-slate-200"
                        }
                      >
                        {role.status ? "Hoạt động" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenForm(role)} 
                          className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(role.id)} 
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredRoles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Briefcase size={32} className="mb-2 opacity-50" />
                      <p>Không tìm thấy chức vụ nào</p>
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
        <SheetContent className="sm:max-w-[500px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full">
          <SheetHeader className="pb-4 border-b border-slate-100">
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <Briefcase size={18} />
              </span>
              {editingRole ? "Cập nhật chức vụ" : "Thêm mới chức vụ"}
            </SheetTitle>
            <SheetDescription className="text-slate-500">
              {editingRole ? "Chỉnh sửa thông tin của chức vụ đang chọn." : "Điền thông tin bên dưới để khởi tạo một chức vụ mới trong hệ thống."}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-6 px-1 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Tên chức vụ <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="VD: Trưởng phòng Marketing" 
                className="rounded-xl border-slate-300 focus-visible:ring-[#2E3192] bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="desc" className="text-sm font-semibold text-slate-700">Mô tả (Tùy chọn)</Label>
              <Textarea 
                id="desc" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Nhập mô tả quyền hạn và trách nhiệm..." 
                rows={5}
                className="rounded-xl border-slate-300 focus-visible:ring-[#2E3192] bg-slate-50 focus:bg-white transition-colors resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-1">
                <Label className="text-slate-800 text-sm font-semibold block">Trạng thái rảnh rỗi / hoạt động?</Label>
                <p className="text-xs text-slate-500">Bật để cho phép gán bộ phận này cho nhân sự</p>
              </div>
              <Switch 
                checked={formData.status} 
                onCheckedChange={checked => setFormData({...formData, status: checked})} 
              />
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t border-slate-100 flex-shrink-0 mt-auto sm:justify-start">
            <Button onClick={handleSave} className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white flex-1 transition-all" disabled={!formData.name.trim()}>
              {editingRole ? "Lưu thay đổi" : "Lưu chức vụ"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 flex-1 transition-all">Hủy</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
