import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { m, AnimatePresence  } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

import type { RoleResponse } from '@/types/role/RoleResponse';

interface RoleTableProps {
  roles: RoleResponse[];
  onEdit: (role: RoleResponse) => void;
  onDelete: (id: string) => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const { t } = useTranslation();
  const [rightClickedId, setRightClickedId] = useState<string | null>(null);
  
  const activeItem = roles.find(r => r.id === rightClickedId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 w-[250px]">{t('management.colRoleName', { defaultValue: 'Tên Chức Vụ' })}</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">{t('management.colDesc', { defaultValue: 'Mô tả' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t('management.colStatus', { defaultValue: 'Trạng thái' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t('management.colAction', { defaultValue: 'Thao tác' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
          <AnimatePresence>
            {roles.map((role) => (
              <m.tr 
                key={role.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-slate-50 transition-colors duration-200"
                onContextMenu={() => setRightClickedId(role.id)}
              >
                <td className="px-4 py-3 font-bold text-[#2E3192] border-x border-slate-200 align-middle">
                  {role.name}
                </td>
                <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[300px]">
                  <div className="line-clamp-2" title={role.description}>{role.description || "—"}</div>
                </td>
                <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                  <Badge 
                    variant={role.active ? "default" : "secondary"} 
                    className={role.active 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium border-0"
                    }
                  >
                    {role.active ? t('management.statusActive', { defaultValue: 'Hoạt động' }) : t('management.statusInactive', { defaultValue: 'Tạm ngưng' })}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                  {role.createdAt ? format(new Date(role.createdAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                  {role.updatedAt ? format(new Date(role.updatedAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(role)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(role.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </m.tr>
            ))}
          </AnimatePresence>
          {roles.length === 0 && (
            <tr>
              <td colSpan={6} className="h-40 text-center border-x border-slate-200">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Layers size={32} className="mb-2 opacity-50" />
                  <p>{t('management.emptyRole', { defaultValue: 'Không tìm thấy chức vụ nào' })}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activeItem && (
        <ContextMenuContent className="w-56 z-100">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activeItem)}>
            <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
            <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeItem.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t('management.deleteRole', { defaultValue: 'Xóa chức vụ' })}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
