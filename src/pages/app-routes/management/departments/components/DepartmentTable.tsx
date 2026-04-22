import { useState, useMemo } from "react";
import { Edit2, Trash2, FolderOpen, ChevronRight, ChevronDown, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import type { DepartmentResponse } from '@/types/department/DepartmentResponse';

export type Department = DepartmentResponse & { children?: Department[] };

interface DepartmentTreeProps {
  departments: DepartmentResponse[];
  onEdit: (dept: DepartmentResponse) => void;
  onDelete: (id: string) => void;
}

export default function DepartmentTreeList({ departments, onEdit, onDelete }: DepartmentTreeProps) {
  const { t } = useTranslation();
  const [rightClickedDeptId, setRightClickedDeptId] = useState<string | null>(null);
  
  // Track collapsed nodes
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

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

  // Flatten the tree for rendering an HTML Table
  const flattenedNodes = useMemo(() => {
    const flat: { dept: Department, depth: number, numberPrefix: string }[] = [];
    const traverse = (node: Department, depth: number, prefix: string) => {
      flat.push({ dept: node, depth, numberPrefix: prefix });
      // If NOT collapsed, traverse children
      if (!collapsedNodes.has(node.id) && node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
           traverse(child, depth + 1, `${prefix}${index + 1}.`);
        });
      }
    };
    tree.forEach((root, index) => {
      traverse(root, 0, `${index + 1}.`);
    });
    return flat;
  }, [tree, collapsedNodes]);

  const toggleNode = (id: string) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center p-0 rounded-2xl overflow-hidden animate-in fade-in duration-300">
      <div className="w-full overflow-x-auto">
        <ContextMenu>
          <ContextMenuTrigger className="block w-full min-w-[800px]">
            <table className="w-full text-[13.5px] text-left border-collapse">
              <thead className="bg-[#f8f9fc] text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 border-r border-transparent font-medium w-12 text-center">
                     <Square size={16} className="text-slate-300 mx-auto" strokeWidth={2} />
                  </th>
                  <th className="px-4 py-3.5 border-r border-transparent font-medium">Tiêu đề (Phòng ban)</th>
                  <th className="px-4 py-3.5 border-r border-transparent font-medium text-center">Level</th>
                  <th className="px-4 py-3.5 border-r border-transparent font-medium">Mô tả</th>
                  <th className="px-4 py-3.5 border-r border-transparent font-medium">Trạng thái</th>
                  <th className="px-4 py-3.5 border-r border-transparent font-medium text-right pr-6">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {flattenedNodes.length > 0 ? (
                  flattenedNodes.map(({ dept, depth, numberPrefix }) => {
                    const hasChildren = dept.children && dept.children.length > 0;
                    const isExpanded = !collapsedNodes.has(dept.id);
                    const isRoot = depth === 0;

                    return (
                      <tr 
                        key={dept.id} 
                        className={cn(
                          "transition-colors duration-150 hover:bg-slate-50/70 group relative",
                          rightClickedDeptId === dept.id && "bg-indigo-50/50"
                        )}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setRightClickedDeptId(dept.id);
                        }}
                      >
                        {/* Checkbox Placeholder */}
                        <td className="px-4 py-3 align-middle text-center w-12 shrink-0">
                          <Square size={16} className="text-slate-200 group-hover:text-slate-300 mx-auto transition-colors" strokeWidth={2} />
                        </td>

                        {/* Name (Indented with Numbering) */}
                        <td className="px-4 align-middle relative h-[48px]">
                          <div 
                            className="flex items-center gap-2 relative z-10 w-full h-full my-auto"
                            style={{ paddingLeft: `${depth * 28}px` }}
                          >
                            <div className="w-5 flex items-center justify-center shrink-0">
                               {hasChildren ? (
                                 <button 
                                  onClick={() => toggleNode(dept.id)}
                                  className="text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 p-0.5 rounded-sm z-10 block relative"
                                 >
                                   {isExpanded ? <ChevronDown size={15} strokeWidth={2.5} /> : <ChevronRight size={15} strokeWidth={2.5} />}
                                 </button>
                               ) : (
                                 <div className="w-[5px] h-[5px] rounded-full bg-slate-300 ring-2 ring-white"></div>
                               )}
                            </div>
                            <span className="font-semibold text-slate-400 shrink-0">{numberPrefix}</span>
                            <span 
                              className={cn(
                                "truncate font-medium transition-colors cursor-default select-none",
                                isRoot ? "text-rose-600 font-bold" : "text-slate-700 group-hover:text-indigo-600"
                              )}
                            >
                              {dept.name}
                            </span>
                          </div>
                        </td>

                        {/* Level */}
                        <td className="px-4 py-3 align-middle text-center">
                          <span className="text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs">
                            Cấp {dept.level}
                          </span>
                        </td>

                        <td className="px-4 py-3 align-middle">
                          <span className="text-slate-500 truncate max-w-[200px] block" title={dept.description || undefined}>
                            {dept.description || "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 align-middle">
                           {dept.active ? (
                             <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                               Hoạt động
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                               <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                               Tạm dừng
                             </span>
                           )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 align-middle text-right pr-6">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button
                                onClick={() => onEdit(dept)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                title="Sửa"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => onDelete(dept.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={15} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                         <FolderOpen size={40} className="mb-3 opacity-20" strokeWidth={1} />
                         <p>Không có dữ liệu phòng ban</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ContextMenuTrigger>

          {/* Context Menu Content for Right-click */}
          {activeDept && (
            <ContextMenuContent className="w-48 z-100 rounded-xl shadow-lg border-slate-200">
              <ContextMenuItem className="cursor-pointer font-medium py-2" onClick={() => onEdit(activeDept)}>
                <Edit2 className="mr-2 h-4 w-4 text-indigo-600" />
                <span className="text-slate-700">{t("department.legendEdit")}</span>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem 
                className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 py-2 font-medium" 
                onClick={() => onDelete(activeDept.id)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
                <span>{t("department.legendDelete")}</span>
              </ContextMenuItem>
            </ContextMenuContent>
          )}
        </ContextMenu>
      </div>
    </div>
  );
}
