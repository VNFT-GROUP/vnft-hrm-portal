import { useState } from "react";
import { Edit2, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";


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
  const [rightClickedDeptId, setRightClickedDeptId] = useState<string | null>(null);
  
  const getManagerDetails = (ids: string[]) => {
    return ids.map(id => managers.find(m => m.id === id)).filter(Boolean) as Manager[];
  };

  const activeDept = departments.find(d => d.id === rightClickedDeptId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
        <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[250px] border-r border-border text-left align-middle px-6">Tên phòng ban</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6 min-w-[200px]">Mô tả</TableHead>
            <TableHead className="font-semibold text-foreground w-[350px] border-r border-border text-left align-middle px-6">Quản lý / BOD</TableHead>
            <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">Thao tác</TableHead>
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
                  className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                  onContextMenu={() => setRightClickedDeptId(dept.id)}
                >
                  <TableCell className="font-bold text-[#1E2062] py-4 border-r border-border text-left align-middle px-6">
                    {dept.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4 border-r border-border text-left align-middle px-6 truncate max-w-[300px]" title={dept.description}>
                    {dept.description || "—"}
                  </TableCell>
                  <TableCell className="py-4 border-r border-border text-left align-middle px-6">
                    {assignedManagers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {assignedManagers.map(m => (
                          <div key={m.id} className="flex items-center gap-1.5 bg-muted border border-border rounded-full px-2.5 py-1 text-xs">
                            <div className="w-4 h-4 rounded-full bg-[#2E3192]/10 text-[#2E3192] flex items-center justify-center font-bold text-[8px]">
                              {m.name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{m.name}</span>
                            <span className="text-muted-foreground">({m.username})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">Chưa phân bổ quản lý</span>
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
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Building2 size={32} className="mb-2 opacity-50" />
                  <p>Không tìm thấy phòng ban nào</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activeDept && (
        <ContextMenuContent className="w-56 z-50">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activeDept)}>
            <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
            <span>Chỉnh sửa thông tin phòng ban</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeDept.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>Xóa phòng ban</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
