import { useState } from "react";
import { Edit2, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";


import type { DepartmentResponse } from "@/types/response/department/DepartmentResponse";

export type Department = DepartmentResponse;

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}

export default function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  const { t } = useTranslation();
  const [rightClickedDeptId, setRightClickedDeptId] = useState<string | null>(null);

  const activeDept = departments.find(d => d.id === rightClickedDeptId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
        <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[250px] border-r border-border text-left align-middle px-6">{t("department.table.name")}</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6 min-w-[200px]">{t("department.table.description")}</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">{t("department.table.status")}</TableHead>
            <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">{t("department.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {departments.map((dept) => {
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
                  <TableCell className="py-4 border-r border-border text-center align-middle">
                    <Badge 
                      variant={dept.active ? "default" : "secondary"} 
                      className={dept.active 
                        ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                        : "bg-muted text-muted-foreground hover:bg-slate-800 dark:bg-slate-700 hover:text-muted-foreground font-medium border-0"
                      }
                    >
                      {dept.active ? t("department.table.active") : t("department.table.inactive")}
                    </Badge>
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
                  <p>{t("department.table.notFound")}</p>
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
            <span>{t("department.legendEdit")}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeDept.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t("department.legendDelete")}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
