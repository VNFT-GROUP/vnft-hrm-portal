import { Edit2, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export interface Role {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse">
        <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[220px] border-r border-border text-left align-middle px-6">Tên chức vụ</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6">Mô tả</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">Trạng thái</TableHead>
            <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {roles.map((role) => (
              <motion.tr 
                key={role.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
              >
                <TableCell className="font-bold text-[#1E2062] py-4 border-r border-border text-left align-middle px-6">{role.name}</TableCell>
                <TableCell className="text-muted-foreground py-4 max-w-[300px] truncate border-r border-border text-left align-middle px-6" title={role.description}>{role.description || "—"}</TableCell>
                <TableCell className="py-4 border-r border-border text-center align-middle">
                  <Badge 
                    variant={role.status ? "default" : "secondary"} 
                    className={role.status 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-muted text-muted-foreground hover:bg-slate-800 dark:bg-slate-700 hover:text-muted-foreground font-medium border-0"
                    }
                  >
                    {role.status ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(role)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(role.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Briefcase size={32} className="mb-2 opacity-50" />
                  <p>Không tìm thấy chức vụ nào</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
