import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { m, AnimatePresence  } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { AvatarPlaceholder } from '@/components/custom/AvatarPlaceholder';

import type { GroupResponse } from '@/types/group/GroupResponse';

interface GroupTableProps {
  groups: GroupResponse[];
  onEdit: (group: GroupResponse) => void;
  onDelete: (id: string) => void;
}

export default function GroupTable({ groups, onEdit, onDelete }: GroupTableProps) {
  const { t } = useTranslation();
  const [rightClickedGroupId, setRightClickedGroupId] = useState<string | null>(null);
  
  const activeGroup = groups.find(r => r.id === rightClickedGroupId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[220px]">{t('management.colGroupName', { defaultValue: 'Tên nhóm quyền' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left">{t('management.colDesc', { defaultValue: 'Mô tả' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colStatus', { defaultValue: 'Trạng thái' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colCreatedBy', { defaultValue: 'Người Tạo' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[120px]">{t('management.colAction', { defaultValue: 'Thao tác' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
          <AnimatePresence>
            {groups.map((group) => (
              <m.tr 
                key={group.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-muted/30 transition-colors"
                onContextMenu={() => setRightClickedGroupId(group.id)}
              >
                <td className="px-4 py-3 font-bold text-[#2E3192] text-center align-middle">
                  {group.name}
                </td>
                <td className="px-4 py-3 text-slate-700 align-middle max-w-[300px]">
                  <div className="line-clamp-2" title={group.description}>{group.description || "—"}</div>
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <Badge 
                    variant={group.active ? "default" : "secondary"} 
                    className={group.active 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium border-0"
                    }
                  >
                    {group.active ? t('management.statusActive', { defaultValue: 'Hoạt động' }) : t('management.statusInactive', { defaultValue: 'Tạm ngưng' })}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-slate-600 align-middle">
                  {group.createdAt ? format(new Date(group.createdAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-center text-slate-600 align-middle">
                  {group.updatedAt ? format(new Date(group.updatedAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 align-middle text-center text-slate-500 whitespace-nowrap text-xs">
                  {group.createdBy ? (
                    <div className="flex items-center justify-center gap-2">
                      <AvatarPlaceholder name={group.createdBy} className="w-6 h-6 text-[10px]" />
                      <span>{group.createdBy}</span>
                    </div>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(group)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(group.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </m.tr>
            ))}
          </AnimatePresence>
          {groups.length === 0 && (
            <tr>
              <td colSpan={7} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <ShieldCheck size={32} className="mb-2 opacity-50" />
                  <p>{t('management.emptyGroup', { defaultValue: 'Không tìm thấy nhóm quyền nào' })}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activeGroup && (
        <ContextMenuContent className="w-56 z-100">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activeGroup)}>
            <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
            <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeGroup.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t('management.deleteGroup', { defaultValue: 'Xóa nhóm quyền' })}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
