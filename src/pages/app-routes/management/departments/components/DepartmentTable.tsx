import { Edit2, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface Department {
  id: string;
  name: string;
  description: string;
  managerIds: string[];
}

export interface Manager {
  id: string;
  name: string;
  role: string;
  username: string;
  deptLabel: string;
}

interface DepartmentTableProps {
  departments: Department[];
  managers: Manager[];
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}

export default function DepartmentTable({ departments, managers, onEdit, onDelete }: DepartmentTableProps) {
  
  const getManagerDetails = (ids: string[]) => {
    return ids.map(id => managers.find(m => m.id === id)).filter(Boolean) as Manager[];
  };

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse">
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 w-[250px] border-r border-slate-200 text-left align-middle px-6">Tên phòng ban</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200 text-left align-middle px-6 min-w-[200px]">Mô tả</TableHead>
            <TableHead className="font-semibold text-slate-700 w-[350px] border-r border-slate-200 text-left align-middle px-6">Quản lý / BOD</TableHead>
            <TableHead className="font-semibold text-slate-700 w-[120px] text-center align-middle px-4">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {departments.map((dept) => {
              const assignedManagers = getManagerDetails(dept.managerIds);
              return (
                <motion.tr 
                  key={dept.id}
                  layout 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-slate-200 group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                >
                  <TableCell className="font-bold text-[#1E2062] py-4 border-r border-slate-200 text-left align-middle px-6">
                    {dept.name}
                  </TableCell>
                  <TableCell className="text-slate-500 py-4 border-r border-slate-200 text-left align-middle px-6 truncate max-w-[300px]" title={dept.description}>
                    {dept.description || "—"}
                  </TableCell>
                  <TableCell className="py-4 border-r border-slate-200 text-left align-middle px-6">
                    {assignedManagers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {assignedManagers.map(m => (
                          <div key={m.id} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 text-xs">
                            <div className="w-4 h-4 rounded-full bg-[#2E3192]/10 text-[#2E3192] flex items-center justify-center font-bold text-[8px]">
                              {m.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{m.name}</span>
                            <span className="text-slate-400">({m.username})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-sm">Chưa phân bổ quản lý</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(dept)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(dept.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
          {departments.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Building2 size={32} className="mb-2 opacity-50" />
                  <p>Không tìm thấy phòng ban nào</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
