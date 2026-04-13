import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Shield, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import type { GroupPermissionResponse } from "@/types/group/GroupPermissionResponse";

interface Props {
  items: GroupPermissionResponse[];
  onEdit: (item: GroupPermissionResponse) => void;
  onDelete: (id: string) => void;
}

export default function GroupPermissionTable({ items, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const [rightClickedItem, setRightClickedItem] = useState<GroupPermissionResponse | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground text-center">
        <Shield size={48} className="mb-4 opacity-20 text-[#2E3192]" />
        <p className="text-lg font-medium">{t('management.noPerms', { defaultValue: 'Chưa có mã quyền nào' })}</p>
        <p className="text-sm opacity-70 mt-1">{t('management.noPermsDesc', { defaultValue: 'Bạn có thể thêm mã quyền mới bằng nút bấm bên trên.' })}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto relative min-h-[300px]">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60 border-b border-border transition-colors">
                <TableHead className="w-[200px] font-semibold text-foreground">{t('management.permCode', { defaultValue: 'Mã Quyền' })}</TableHead>
                <TableHead className="font-semibold text-foreground">{t('management.description', { defaultValue: 'Mô Tả' })}</TableHead>
                <TableHead className="w-[150px] font-semibold text-foreground text-center">{t('management.status', { defaultValue: 'Trạng Thái' })}</TableHead>
                <TableHead className="w-[200px] font-semibold text-foreground text-right">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</TableHead>
                <TableHead className="w-[100px] text-right font-semibold text-foreground">{t('management.action', { defaultValue: 'Thao tác' })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow 
                  key={item.id}
                  className="group border-b border-border hover:bg-muted/40 transition-colors cursor-pointer" 
                  onDoubleClick={() => onEdit(item)}
                  onContextMenu={() => setRightClickedItem(item)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Shield size={16} className="text-indigo-600" />
                      </div>
                      <span className="text-[#1E2062] font-semibold">{item.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground line-clamp-1">{item.description || '—'}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.active !== false
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {item.active !== false
                        ? t('common.active', { defaultValue: 'Hoạt động' })
                        : t('common.inactive', { defaultValue: 'Tạm ngưng' })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-2 text-[#2E3192] hover:bg-[#2E3192]/10 rounded-lg transition-colors tooltip-trigger"
                        title={t('common.edit')}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors tooltip-trigger"
                        title={t('common.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContextMenuTrigger>
        {rightClickedItem && (
          <ContextMenuContent className="w-48 shadow-lg border-border/60">
            <ContextMenuItem onClick={() => onEdit(rightClickedItem)} className="gap-2 focus:bg-[#2E3192]/10 focus:text-[#2E3192] cursor-pointer">
              <Edit2 size={15} /> {t('common.edit')}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDelete(rightClickedItem.id)} className="gap-2 text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
              <Trash2 size={15} /> {rightClickedItem.active !== false ? "Tạm ngưng" : "Xóa"}
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
