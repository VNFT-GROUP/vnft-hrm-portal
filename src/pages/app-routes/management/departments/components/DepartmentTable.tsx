import { useState, useMemo, Fragment } from "react";
import { Edit2, Trash2, ChevronRight, ChevronDown, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export type Department = DepartmentResponse & { children?: Department[] };

interface DepartmentTableProps {
  departments: DepartmentResponse[];
  onEdit: (dept: DepartmentResponse) => void;
  onDelete: (id: string) => void;
}

export default function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  const { t } = useTranslation();
  const [rightClickedDeptId, setRightClickedDeptId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const activeDept = departments.find(d => d.id === rightClickedDeptId);

  const tree = useMemo(() => {
    const map = new Map<string, Department>();
    const roots: Department[] = [];

    departments.forEach(d => {
      map.set(d.id, { ...d, children: [] });
    });

    departments.forEach(d => {
      if (d.parentDepartmentId && map.has(d.parentDepartmentId)) {
        map.get(d.parentDepartmentId)!.children!.push(map.get(d.id)!);
      } else {
        roots.push(map.get(d.id)!);
      }
    });

    return roots;
  }, [departments]);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderRow = (dept: Department, depth: number = 0) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedNodes.has(dept.id);

    return (
      <Fragment key={dept.id}>
        <m.tr 
          layout 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`hover:bg-slate-50 transition-colors duration-200 ${depth === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
          onContextMenu={(e) => {
            e.preventDefault();
            setRightClickedDeptId(dept.id);
          }}
        >
          <td className="px-4 py-3 border-x border-slate-200 align-middle">
            <div className="flex items-center" style={{ paddingLeft: `${depth * 28}px` }}>
              <div className="w-6 shrink-0 flex items-center justify-center">
                {hasChildren ? (
                  <button 
                    onClick={() => toggleNode(dept.id)}
                    className="p-0.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <span className="w-3 h-px bg-slate-300 inline-block mr-1"></span>
                )}
              </div>
              <div className="flex flex-col ml-1">
                 <span className={`font-bold ${depth === 0 ? 'text-[#1E2062] text-[14px]' : 'text-slate-700 text-[13px]'}`}>
                   {dept.name}
                 </span>
                 <span className="text-[11px] text-slate-400 font-medium">Cấp {dept.level}</span>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[200px]">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded truncate block w-fit">
              {dept.parentDepartmentName || "—"}
            </span>
          </td>
          <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[200px]">
            <div className="line-clamp-2 text-[13px]" title={dept.description || ""}>
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
        {isExpanded && hasChildren && (
          dept.children!.map(child => renderRow(child, depth + 1))
        )}
      </Fragment>
    );
  };

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 min-w-[280px]">{t("department.table.name")}</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 w-[200px]">Phòng ban cha</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 min-w-[200px]">{t("department.table.description")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t("department.table.status")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t("department.table.actions")}</th>
              </tr>
            </thead>
        <tbody className="divide-y divide-slate-200">
          <AnimatePresence mode="popLayout">
            {tree.length > 0 ? (
              tree.map(dept => renderRow(dept, 0))
            ) : (
              <tr>
                <td colSpan={5} className="h-40 text-center border-x border-slate-200">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Network size={32} className="mb-2 opacity-30 text-[#1E2062]" />
                    <p>{t("department.table.notFound")}</p>
                  </div>
                </td>
              </tr>
            )}
          </AnimatePresence>
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
