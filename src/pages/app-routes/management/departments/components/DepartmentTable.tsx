import { useState } from "react";
import { Edit2, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { m, AnimatePresence  } from 'framer-motion';
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";


import type { DepartmentResponse } from '@/types/department/DepartmentResponse';

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
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 w-[250px]">{t("department.table.name")}</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 min-w-[200px]">{t("department.table.description")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t("department.table.status")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t("department.table.actions")}</th>
              </tr>
            </thead>
        <tbody className="divide-y divide-slate-200">
          <AnimatePresence>
            {departments.map((dept) => {
              return (
                <m.tr 
                  key={dept.id}
                  layout 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50 transition-colors duration-200"
                  onContextMenu={() => setRightClickedDeptId(dept.id)}
                >
                  <td className="px-4 py-3 font-bold text-[#2E3192] border-x border-slate-200 align-middle">
                    {dept.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[300px]">
                    <div className="line-clamp-2" title={dept.description}>
                      {dept.description || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                    <Badge 
                      variant={dept.active ? "default" : "secondary"} 
                      className={dept.active 
                        ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                        : "bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium border-0"
                      }
                    >
                      {dept.active ? t("department.table.active") : t("department.table.inactive")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                    {dept.createdAt ? format(new Date(dept.createdAt), "dd/MM/yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                    {dept.updatedAt ? format(new Date(dept.updatedAt), "dd/MM/yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                       <button
                        onClick={() => onEdit(dept)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(dept.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </m.tr>
              );
            })}
          </AnimatePresence>
          {departments.length === 0 && (
            <tr>
              <td colSpan={6} className="h-40 text-center border-x border-slate-200">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Building2 size={32} className="mb-2 opacity-50" />
                  <p>{t("department.table.notFound")}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activeDept && (
        <ContextMenuContent className="w-56 z-100">
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
