import { useState } from "react";
import { Edit2, Shield, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";
import { m, AnimatePresence  } from 'framer-motion';
import type { GroupPermissionResponse } from "@/types/group/GroupPermissionResponse";

interface Props {
  items: GroupPermissionResponse[];
  onEdit: (item: GroupPermissionResponse) => void;
  onDelete: (id: string) => void;
}

export default function GroupPermissionTable({ items, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const [rightClickedItem, setRightClickedItem] = useState<GroupPermissionResponse | null>(null);

  return (
    <div className="w-full overflow-x-auto relative min-h-[300px]">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[220px]">{t('management.permCode', { defaultValue: 'Mã Quyền' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t('management.permCategory', { defaultValue: 'Nhóm Tính Năng' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t('management.description', { defaultValue: 'Mô Tả' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t('management.status', { defaultValue: 'Trạng Thái' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t('management.action', { defaultValue: 'Thao tác' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <AnimatePresence>
                {items.map((item) => (
                  <m.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer" 
                    onDoubleClick={() => onEdit(item)}
                    onContextMenu={() => setRightClickedItem(item)}
                  >
                    <td className="px-4 py-3 font-bold text-[#1E2062] border-x border-slate-200 text-center align-middle">
                      {item.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#2E3192] border-x border-slate-200 text-center align-middle">
                      {item.category || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[300px] truncate" title={item.description}>
                      {item.description || '—'}
                    </td>
                    <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                      <Badge 
                        variant={item.active !== false ? "default" : "secondary"} 
                        className={item.active !== false 
                          ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                          : "bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium border-0"
                        }
                      >
                        {item.active !== false
                          ? t('common.active', { defaultValue: 'Hoạt động' })
                          : t('common.inactive', { defaultValue: 'Tạm ngưng' })}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                      {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                      {item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </m.tr>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
            <tr>
              <td colSpan={7} className="h-40 text-center border-x border-slate-200">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Shield size={32} className="mb-2 opacity-50 text-[#2E3192]" />
                  <p className="text-lg font-medium">{t('management.noPerms', { defaultValue: 'Chưa có mã quyền nào' })}</p>
                  <p className="text-sm opacity-70 mt-1">{t('management.noPermsDesc', { defaultValue: 'Bạn có thể thêm mã quyền mới bằng nút bấm bên trên.' })}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
        </ContextMenuTrigger>
        {rightClickedItem && (
          <ContextMenuContent className="w-48 shadow-lg border-border/60">
            <ContextMenuItem onClick={() => onEdit(rightClickedItem)} className="gap-2 focus:bg-[#2E3192]/10 focus:text-[#2E3192] cursor-pointer">
              <Edit2 size={15} /> {t('management.editPerm', { defaultValue: 'Cập nhật mã quyền' })}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDelete(rightClickedItem.id)} className="gap-2 text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
              <Trash2 size={15} /> {rightClickedItem.active !== false ? t('management.statusInactive', { defaultValue: 'Tạm ngưng' }) : t('common.delete', { defaultValue: 'Xóa' })}
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
